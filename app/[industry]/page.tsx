'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { slugToIndustry, industryToSlug } from '@/lib/industries'
import LevelSelector from '@/components/LevelSelector'

export default function IndustryHub() {
  const params = useParams()
  const router = useRouter()
  const slug = params.industry as string
  const industry = slugToIndustry(slug)
  const [showLevelSelector, setShowLevelSelector] = useState(false)

  useEffect(() => {
    if (!industry) {
      router.push('/')
    }
  }, [industry, router])

  if (!industry) return null

  function handleStartVoting() {
    const savedLevel = localStorage.getItem('voterLevel')
    const savedInIndustry = localStorage.getItem(`inIndustry_${slug}`)
    if (savedLevel && savedInIndustry !== null) {
      router.push(`/${slug}/vote`)
    } else {
      setShowLevelSelector(true)
    }
  }

  function handleLevelConfirm(voterLevel: string, industryScope: string) {
    localStorage.setItem('voterLevel', voterLevel)
    localStorage.setItem(`inIndustry_${slug}`, String(industryScope === 'in_industry'))
    setShowLevelSelector(false)
    router.push(`/${slug}/vote`)
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        padding: '80px 32px',
        maxWidth: '960px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0.15em',
          color: '#444',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        Industry
      </div>
      <h1
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(32px, 5vw, 64px)',
          fontWeight: 300,
          letterSpacing: '-0.01em',
          color: '#ffffff',
          margin: '0 0 64px 0',
        }}
      >
        {industry}
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1px',
          background: '#1a1a1a',
          border: '1px solid #222',
        }}
      >
        {/* View Rankings */}
        <Link
          href={`/${slug}/rankings`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px',
            background: '#0a0a0a',
            textDecoration: 'none',
            transition: '200ms ease',
            minHeight: '240px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#111111')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#0a0a0a')}
        >
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.15em',
              color: '#444',
              textTransform: 'uppercase',
            }}
          >
            01
          </div>
          <div>
            <h2
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '24px',
                fontWeight: 300,
                color: '#ffffff',
                margin: '0 0 12px 0',
                letterSpacing: '-0.01em',
              }}
            >
              View Rankings
            </h2>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 300,
                color: '#444',
                margin: 0,
              }}
            >
              See where companies stand.
            </p>
          </div>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#444',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            View →
          </span>
        </Link>

        {/* Start Voting */}
        <button
          onClick={handleStartVoting}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px',
            background: '#0a0a0a',
            border: 'none',
            cursor: 'pointer',
            transition: '200ms ease',
            textAlign: 'left',
            minHeight: '240px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#111111')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#0a0a0a')}
        >
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.15em',
              color: '#444',
              textTransform: 'uppercase',
            }}
          >
            02
          </div>
          <div>
            <h2
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '24px',
                fontWeight: 300,
                color: '#ffffff',
                margin: '0 0 12px 0',
                letterSpacing: '-0.01em',
              }}
            >
              Start Voting
            </h2>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 300,
                color: '#444',
                margin: 0,
              }}
            >
              Pick winners. Shape the rankings.
            </p>
          </div>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#444',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Vote →
          </span>
        </button>
      </div>

      {showLevelSelector && (
        <LevelSelector
          industryName={industry}
          industrySlug={slug}
          onConfirm={handleLevelConfirm}
          onClose={() => setShowLevelSelector(false)}
        />
      )}
    </div>
  )
}
