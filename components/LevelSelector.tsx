'use client'

import { useState, useEffect } from 'react'

interface LevelSelectorProps {
  onConfirm: (voterLevel: string, industryScope: string) => void
  onClose: () => void
  industryName: string
  industrySlug: string
}

const LEVELS = [
  { id: 'student', label: 'Student / Not in workforce' },
  { id: 'entry', label: 'Entry Level (0–3 yrs)' },
  { id: 'mid', label: 'Mid Level (3–8 yrs)' },
  { id: 'senior', label: 'Senior+ (8+ yrs)' },
]

export default function LevelSelector({ onConfirm, onClose, industryName, industrySlug }: LevelSelectorProps) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [inIndustry, setInIndustry] = useState<boolean | null>(null)

  // Pre-fill saved global level; auto-confirm only if this industry's answer is also saved
  useEffect(() => {
    const savedLevel = localStorage.getItem('voterLevel')
    const savedInIndustry = localStorage.getItem(`inIndustry_${industrySlug}`)
    if (savedLevel) setSelectedLevel(savedLevel)
    if (savedLevel && savedInIndustry !== null) {
      // Both answered — skip the modal
      onConfirm(savedLevel, savedInIndustry === 'true' ? 'in_industry' : 'all')
    }
  }, [onConfirm, industrySlug])

  function handleConfirm() {
    if (!selectedLevel || inIndustry === null) return
    const scope = inIndustry ? 'in_industry' : 'all'
    // voterLevel is global; inIndustry is per-industry
    localStorage.setItem('voterLevel', selectedLevel)
    localStorage.setItem(`inIndustry_${industrySlug}`, String(inIndustry))
    onConfirm(selectedLevel, scope)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,10,10,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#111111',
          border: '1px solid #222',
          padding: '48px',
          maxWidth: '480px',
          width: '100%',
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
            marginBottom: '8px',
          }}
        >
          Before you vote
        </div>
        <h2
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '28px',
            fontWeight: 300,
            color: '#ffffff',
            marginBottom: '32px',
            letterSpacing: '-0.01em',
          }}
        >
          Who are you?
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              style={{
                padding: '12px 20px',
                border: '1px solid',
                borderColor: selectedLevel === level.id ? '#ffffff' : '#222',
                background: selectedLevel === level.id ? '#ffffff' : 'transparent',
                color: selectedLevel === level.id ? '#0a0a0a' : '#ffffff',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 300,
                cursor: 'pointer',
                transition: '200ms ease',
                textAlign: 'left',
              }}
            >
              {level.label}
            </button>
          ))}
        </div>

        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 300,
            color: '#888',
            marginBottom: '16px',
          }}
        >
          Are you in {industryName}?
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
          {['Yes', 'No'].map((opt) => {
            const val = opt === 'Yes'
            return (
              <button
                key={opt}
                onClick={() => setInIndustry(val)}
                style={{
                  padding: '10px 24px',
                  border: '1px solid',
                  borderColor: inIndustry === val ? '#ffffff' : '#222',
                  background: inIndustry === val ? '#ffffff' : 'transparent',
                  color: inIndustry === val ? '#0a0a0a' : '#ffffff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 300,
                  cursor: 'pointer',
                  transition: '200ms ease',
                }}
              >
                {opt}
              </button>
            )
          })}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedLevel || inIndustry === null}
          style={{
            width: '100%',
            padding: '14px',
            background: selectedLevel && inIndustry !== null ? '#ffffff' : '#1c1c1c',
            color: selectedLevel && inIndustry !== null ? '#0a0a0a' : '#444',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            border: 'none',
            cursor: selectedLevel && inIndustry !== null ? 'pointer' : 'not-allowed',
            transition: '200ms ease',
          }}
        >
          Start Voting
        </button>
      </div>
    </div>
  )
}
