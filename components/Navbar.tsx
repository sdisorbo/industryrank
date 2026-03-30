'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { slugToIndustry } from '@/lib/industries'

export default function Navbar() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const industrySlug = segments[0]
  const industryName = industrySlug ? slugToIndustry(industrySlug) : null

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          fontWeight: 400,
          letterSpacing: '0.2em',
          color: '#ffffff',
          textDecoration: 'none',
          textTransform: 'uppercase',
        }}
      >
        INDUSTRYRANK
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {industryName && (
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.15em',
              color: '#888888',
              textTransform: 'uppercase',
            }}
          >
            {industryName}
          </span>
        )}
        <Link
          href="/about"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.15em',
            color: '#444',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          About
        </Link>
      </div>
    </nav>
  )
}
