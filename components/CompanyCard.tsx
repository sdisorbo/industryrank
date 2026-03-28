'use client'

import { useState } from 'react'
import { getClearbitLogoUrl, getInitials } from '@/lib/clearbit'

interface CompanyCardProps {
  name: string
  domain: string
  industry?: string
  size?: number
  showLabel?: boolean
}

export default function CompanyCard({
  name,
  domain,
  industry,
  size = 80,
  showLabel = true,
}: CompanyCardProps) {
  const [imgError, setImgError] = useState(false)
  const initials = getInitials(name)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      {!imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getClearbitLogoUrl(domain)}
          alt={name}
          width={size}
          height={size}
          onError={() => setImgError(true)}
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            background: '#161616',
            borderRadius: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            background: '#1c1c1c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #222',
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: size * 0.3,
              fontWeight: 500,
              color: '#ffffff',
              letterSpacing: '0.05em',
            }}
          >
            {initials}
          </span>
        </div>
      )}

      {showLabel && (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              color: '#ffffff',
              letterSpacing: '0.02em',
            }}
          >
            {name}
          </div>
          {industry && (
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 300,
                color: '#444444',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              {industry}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Small inline logo for tables
export function CompanyLogo({ name, domain, size = 32 }: { name: string; domain: string; size?: number }) {
  const [imgError, setImgError] = useState(false)
  const initials = getInitials(name)

  if (!imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getClearbitLogoUrl(domain)}
        alt={name}
        width={size}
        height={size}
        onError={() => setImgError(true)}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        background: '#1c1c1c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #222',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: size * 0.35,
          fontWeight: 500,
          color: '#ffffff',
        }}
      >
        {initials}
      </span>
    </div>
  )
}
