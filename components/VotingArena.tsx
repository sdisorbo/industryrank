'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CompanyCard from './CompanyCard'
import { industryToSlug } from '@/lib/industries'

interface Company {
  id: string
  name: string
  domain: string
  industry: string
}

interface VotingArenaProps {
  industry: string
  voterLevel: string
  industryScope: string
}

export default function VotingArena({ industry, voterLevel, industryScope }: VotingArenaProps) {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [left, setLeft] = useState<Company | null>(null)
  const [right, setRight] = useState<Company | null>(null)
  const [usedPairs, setUsedPairs] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [voteCount, setVoteCount] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [voting, setVoting] = useState(false)
  const [skipping, setSkipping] = useState(false)
  const slug = industryToSlug(industry)

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
          const all = [...(data.companies ?? []), ...results.flat()]
          setCompanies(all)
          setLoading(false)
        })
      })
      .catch((err) => {
        console.error('Failed to load companies:', err)
        setLoading(false)
      })
  }, [industry, industryScope])

  const pickPair = useCallback(
    (pool: Company[], exclude: Company | null, pairs: Set<string>) => {
      const available = exclude ? pool.filter((c) => c.id !== exclude.id) : pool

      for (let attempt = 0; attempt < 50; attempt++) {
        const idx1 = Math.floor(Math.random() * available.length)
        const idx2 = Math.floor(Math.random() * available.length)
        if (idx1 === idx2) continue

        const c1 = available[idx1]
        const c2 = available[idx2]
        const pairKey = [c1.id, c2.id].sort().join('|')
        if (!pairs.has(pairKey)) return { c1, c2, pairKey }
      }

      // If all pairs used, reset
      const idx1 = Math.floor(Math.random() * available.length)
      let idx2 = Math.floor(Math.random() * available.length)
      while (idx2 === idx1) idx2 = Math.floor(Math.random() * available.length)
      const c1 = available[idx1]
      const c2 = available[idx2]
      const pairKey = [c1.id, c2.id].sort().join('|')
      return { c1, c2, pairKey }
    },
    []
  )

  useEffect(() => {
    if (companies.length >= 2) {
      const { c1, c2, pairKey } = pickPair(companies, null, usedPairs)
      setLeft(c1)
      setRight(c2)
      setUsedPairs((prev) => new Set([...prev, pairKey]))
    }
  }, [companies]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleVote(winner: Company, loser: Company) {
    if (voting) return
    setVoting(true)

    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        winnerId: winner.id,
        loserId: loser.id,
        industry,
        industryScope,
        voterLevel,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      console.error('Vote failed', res.status, body)
      setVoting(false)
      return
    }

    const newCount = voteCount + 1
    setVoteCount(newCount)

    if (newCount % 10 === 0) {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }

    // Winner stays (the clicked one), replace the loser
    const isLeftWinner = winner.id === left?.id

    const nextPool = isLeftWinner
      ? companies.filter((c) => c.id !== left?.id)
      : companies.filter((c) => c.id !== right?.id)

    const stayingCard = isLeftWinner ? left! : right!
    const { c1: newCard, pairKey } = pickPair(nextPool, stayingCard, usedPairs)

    setUsedPairs((prev) => new Set([...prev, pairKey]))

    if (isLeftWinner) {
      setRight(newCard)
    } else {
      setLeft(newCard)
    }

    setVoting(false)
  }

  function handleSkip() {
    if (voting || skipping || !left || !right) return
    setSkipping(true)

    // Mark current pair as used so it won't immediately reappear
    const skippedKey = [left.id, right.id].sort().join('|')
    const nextPairs = new Set([...usedPairs, skippedKey])

    // Pick fresh pair excluding both current cards
    const excludeBoth = companies.filter((c) => c.id !== left.id && c.id !== right.id)
    const pool = excludeBoth.length >= 2 ? excludeBoth : companies

    const { c1, c2, pairKey } = pickPair(pool, null, nextPairs)
    setUsedPairs(new Set([...nextPairs, pairKey]))
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
          padding: '16px 32px',
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
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          minHeight: 'calc(100vh - 56px - 57px)',
        }}
      >
        {/* Left card */}
        {left && (
          <VoteCard
            company={left}
            onClick={() => handleVote(left, right!)}
            disabled={voting}
          />
        )}

        {/* VS divider + skip */}
        <div
          style={{
            padding: '0 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
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

        {/* Right card */}
        {right && (
          <VoteCard
            company={right}
            onClick={() => handleVote(right, left!)}
            disabled={voting}
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
}: {
  company: Company
  onClick: () => void
  disabled: boolean
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
        gap: '32px',
        padding: '80px 40px',
        background: hovered ? '#1c1c1c' : 'transparent',
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        transition: '200ms ease',
        height: '100%',
        width: '100%',
      }}
    >
      <CompanyCard
        name={company.name}
        domain={company.domain}
        industry={company.industry}
        size={120}
        showLabel={true}
      />
    </button>
  )
}
