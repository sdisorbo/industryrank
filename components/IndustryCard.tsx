'use client'

import { useState } from 'react'
import { industryToSlug } from '@/lib/industries'
import { useRouter } from 'next/navigation'

interface IndustryCardProps {
  industry: string
}

export default function IndustryCard({ industry }: IndustryCardProps) {
  const [hovered, setHovered] = useState(false)
  const router = useRouter()
  const slug = industryToSlug(industry)

  return (
    <button
      onClick={() => router.push(`/${slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 20px',
        border: '1px solid #222',
        background: hovered ? '#ffffff' : 'transparent',
        color: hovered ? '#0a0a0a' : '#ffffff',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        fontWeight: 400,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: '200ms ease',
        borderRadius: '9999px',
        whiteSpace: 'nowrap',
      }}
    >
      {industry}
    </button>
  )
}
