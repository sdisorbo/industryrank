'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CompanyCard from './CompanyCard'
import { industryToSlug } from '@/lib/industries'

interface Company {
  id: string
  name: string
  domain: string
  industry: string
  elo: number
}

interface VotingArenaProps {
  industry: string
  voterLevel: string
  industryScope: string
}

/**
 * Weighted random pick from `pool`, biased toward companies whose ELO is
 * close to `anchorElo`.  Companies already in `seenIds` are skipped unless
 * the entire pool has been seen (then we reset for that company).
 */
function pickWeightedOpponent(
  anchorElo: number,
  pool: Company[],
  seenIds: Set<string>
): Company {
  let candidates = pool.filter((c) => !seenIds.has(c.id))
  if (candidates.length === 0) candidates = pool // all seen → reset

  // Gaussian weight centred on anchorElo; σ = 300 ELO points
  const sigma = 300
  const weights = candidates.map((c) => {
    const diff = c.elo - anchorElo
    return Math.exp(-(diff * diff) / (2 * sigma * sigma))
  })

  let rand = Math.random() * weights.reduce((a, b) => a + b, 0)
  for (let i = 0; i < candidates.length; i++) {
    rand -= weights[i]
    if (rand <= 0) return candidates[i]
  }
  return candidates[candidates.length - 1]
}

export default function VotingArena({ industry, voterLevel, industryScope }: VotingArenaProps) {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [left, setLeft] = useState<Company | null>(null)
  const [right, setRight] = useState<Company | null>(null)
  // Per-company seen opponents: companyId → Set of opponent IDs already faced
  const [seenOpponents, setSeenOpponents] = useState<Map<string, Set<string>>>(new Map())
  const [loading, setLoading] = useState(true)
  const [voteCount, setVoteCount] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [voting, setVoting] = useState(false)
  const [skipping, setSkipping] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const slug = industryToSlug(industry)

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Fetch all companies (all pages)
  useEffect(() => {
    const base = `/api/companies?industry=${encodeURIComponent(industry)}&industryScope=${industryScope}&voterLevel=global`
    fetch(`${base}&page=1`)
      .then((r) => {
        if (!r.ok) throw new Error(`API error ${r.status}`)
        return r.json()
      })
      .then((data) => {
        const total: number = data.total ?? 0
        const pages = Math.ceil(total / 25)
        const promises: Promise<Company[]>[] = []
        for (let i = 2; i <= pages; i++) {
          promises.push(
            fetch(`${base}&page=${i}`)
              .then((r) => {
                if (!r.ok) throw new Error(`API error ${r.status}`)
                return r.json()
              })
              .then((d) => (d.companies ?? []) as Company[])
          )
        }
        return Promise.all(promises).then((results) => {
          const all = [...(data.companies ?? []), ...results.flat()] as Company[]
          setCompanies(all)
          setLoading(false)
        })
      })
      .catch((err) => {
        console.error('Failed to load companies:', err)
        setLoading(false)
      })
  }, [industry, industryScope])

  // Pick initial pair once companies are loaded
  useEffect(() => {
    if (companies.length < 2) return
    const idx = Math.floor(Math.random() * companies.length)
    const c1 = companies[idx]
    const pool2 = companies.filter((c) => c.id !== c1.id)
    const c2 = pickWeightedOpponent(c1.elo, pool2, new Set())

    const initSeen = new Map<string, Set<string>>()
    initSeen.set(c1.id, new Set([c2.id]))
    initSeen.set(c2.id, new Set([c1.id]))
    setSeenOpponents(initSeen)
    setLeft(c1)
    setRight(c2)
  }, [companies]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleVote(winner: Company, loser: Company) {
    if (voting) return
    setVoting(true)

    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winnerId: winner.id, loserId: loser.id, industry, industryScope, voterLevel }),
    })

    if (!res.ok) {
      console.error('Vote failed', res.status, await res.json().catch(() => ({})))
      setVoting(false)
      return
    }

    const newCount = voteCount + 1
    setVoteCount(newCount)
    if (newCount % 10 === 0) {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }

    // Update seen-opponent sets (compute first, then set state)
    const winnerSeen = new Set([...(seenOpponents.get(winner.id) ?? []), loser.id])
    const loserSeen  = new Set([...(seenOpponents.get(loser.id)  ?? []), winner.id])
    const nextSeen   = new Map(seenOpponents)
    nextSeen.set(winner.id, winnerSeen)
    nextSeen.set(loser.id, loserSeen)
    setSeenOpponents(nextSeen)

    // Winner stays; pick weighted opponent for winner
    const pool     = companies.filter((c) => c.id !== winner.id)
    const newCard  = pickWeightedOpponent(winner.elo, pool, winnerSeen)
    // Track new card as seen by winner
    nextSeen.set(winner.id, new Set([...winnerSeen, newCard.id]))
    setSeenOpponents(new Map(nextSeen))

    if (winner.id === left?.id) setRight(newCard)
    else setLeft(newCard)

    setVoting(false)
  }

  function handleSkip() {
    if (voting || skipping || !left || !right) return
    setSkipping(true)

    // Mark current pair as mutually seen
    const nextSeen = new Map(seenOpponents)
    nextSeen.set(left.id,  new Set([...(nextSeen.get(left.id)  ?? []), right.id]))
    nextSeen.set(right.id, new Set([...(nextSeen.get(right.id) ?? []), left.id]))

    // Fresh random anchor, weighted opponent
    const idx = Math.floor(Math.random() * companies.length)
    const c1  = companies[idx]
    const pool2 = companies.filter((c) => c.id !== c1.id)
    const c1Seen = new Set([...(nextSeen.get(c1.id) ?? []), left.id, right.id])
    const c2 = pickWeightedOpponent(c1.elo, pool2, c1Seen)

    nextSeen.set(c1.id, new Set([...c1Seen, c2.id]))
    nextSeen.set(c2.id, new Set([...(nextSeen.get(c2.id) ?? []), c1.id]))
    setSeenOpponents(nextSeen)
    setLeft(c1)
    setRight(c2)
    setSkipping(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Loading
        </span>
      </div>
    )
  }

  if (companies.length < 2) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#888' }}>
          Not enough companies to vote.
        </span>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '56px' }}>
      {/* Top bar */}
      <div
        style={{
          borderBottom: '1px solid #1a1a1a',
          padding: isMobile ? '12px 16px' : '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.15em',
            color: '#444',
            textTransform: 'uppercase',
          }}
        >
          {industry}
        </span>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link
            href={`/${slug}/rankings`}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#888',
              textDecoration: 'none',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            View Rankings →
          </Link>
          <button
            onClick={() => router.push(`/${slug}`)}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#444',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Exit
          </button>
        </div>
      </div>

      {/* Voting area */}
      <div
        style={
          isMobile
            ? {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                minHeight: 'calc(100vh - 56px - 49px)',
              }
            : {
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                minHeight: 'calc(100vh - 56px - 57px)',
              }
        }
      >
        {/* Left / Top card */}
        {left && (
          <VoteCard
            company={left}
            onClick={() => handleVote(left, right!)}
            disabled={voting}
            isMobile={isMobile}
          />
        )}

        {/* VS + New Pair */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '20px' : '24px',
            borderTop:    isMobile ? '1px solid #111' : 'none',
            borderBottom: isMobile ? '1px solid #111' : 'none',
            padding:      isMobile ? '14px 24px' : '0 40px',
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 300,
              letterSpacing: '0.4em',
              color: '#222',
              textTransform: 'uppercase',
            }}
          >
            VS
          </span>
          <button
            onClick={handleSkip}
            disabled={voting || skipping}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: voting || skipping ? '#222' : '#444',
              background: 'none',
              border: '1px solid #1a1a1a',
              padding: '6px 14px',
              cursor: voting || skipping ? 'default' : 'pointer',
              transition: '200ms ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!voting && !skipping) (e.currentTarget as HTMLButtonElement).style.color = '#888'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.color = voting || skipping ? '#222' : '#444'
            }}
          >
            New Pair
          </button>
        </div>

        {/* Right / Bottom card */}
        {right && (
          <VoteCard
            company={right}
            onClick={() => handleVote(right, left!)}
            disabled={voting}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* Toast */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#161616',
            border: '1px solid #222',
            padding: '12px 24px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#888',
            letterSpacing: '0.05em',
            zIndex: 200,
          }}
        >
          Rankings updated —{' '}
          <Link href={`/${slug}/rankings`} style={{ color: '#ffffff', textDecoration: 'none' }}>
            view leaderboard
          </Link>
        </div>
      )}
    </div>
  )
}

function VoteCard({
  company,
  onClick,
  disabled,
  isMobile,
}: {
  company: Company
  onClick: () => void
  disabled: boolean
  isMobile: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? '20px' : '32px',
        padding: isMobile ? '40px 24px' : '80px 40px',
        background: hovered ? '#1c1c1c' : 'transparent',
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        transition: '200ms ease',
        height: isMobile ? undefined : '100%',
        width: '100%',
        minHeight: isMobile ? '220px' : undefined,
      }}
    >
      <CompanyCard
        name={company.name}
        domain={company.domain}
        industry={company.industry}
        size={isMobile ? 80 : 120}
        showLabel={true}
      />
    </button>
  )
}
