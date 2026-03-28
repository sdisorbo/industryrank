'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { slugToIndustry, industryToSlug } from '@/lib/industries'
import RankingsTable from '@/components/RankingsTable'

export default function RankingsPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.industry as string
  const industry = slugToIndustry(slug)

  useEffect(() => {
    if (!industry) router.push('/')
  }, [industry, router])

  if (!industry) return null

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        padding: '64px 32px 80px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '48px',
        }}
      >
        <Link
          href={`/${slug}`}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: '#444',
            textDecoration: 'none',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          ← {industry}
        </Link>
        <span style={{ color: '#222' }}>|</span>
        <Link
          href={`/${slug}/vote`}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: '#888',
            textDecoration: 'none',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Start Voting →
        </Link>
      </div>

      <h1
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 300,
          letterSpacing: '-0.01em',
          color: '#ffffff',
          margin: '0 0 8px 0',
        }}
      >
        Rankings
      </h1>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          fontWeight: 300,
          color: '#444',
          margin: '0 0 48px 0',
        }}
      >
        {industry}
      </p>

      <RankingsTable industry={industry} />
    </div>
  )
}
