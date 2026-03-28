'use client'

import { useState, useEffect, useRef } from 'react'

interface SearchBarProps {
  industry: string
  onSearch?: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ industry, onSearch, placeholder = 'Search companies...' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showRequest, setShowRequest] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [requestResult, setRequestResult] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch?.(query)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, onSearch])

  async function handleRequest() {
    setRequesting(true)
    setRequestResult(null)
    const res = await fetch('/api/request-company', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: query, industry }),
    })
    const data = await res.json()
    setRequestResult(data.message ?? data.error ?? 'Unknown error.')
    setRequesting(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setShowRequest(false)
          setRequestResult(null)
        }}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: '#111',
          border: '1px solid #222',
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          fontWeight: 300,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />

      {query && !showRequest && !requestResult && (
        <div
          style={{
            marginTop: '8px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#444',
          }}
        >
          Can&apos;t find &ldquo;{query}&rdquo;?{' '}
          <button
            onClick={() => setShowRequest(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Request it →
          </button>
        </div>
      )}

      {showRequest && !requestResult && (
        <div
          style={{
            marginTop: '12px',
            padding: '16px',
            background: '#111',
            border: '1px solid #222',
          }}
        >
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#888',
              marginBottom: '12px',
            }}
          >
            Request &ldquo;{query}&rdquo; for {industry}?
          </div>
          <button
            onClick={handleRequest}
            disabled={requesting}
            style={{
              padding: '8px 20px',
              background: '#ffffff',
              color: '#0a0a0a',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              cursor: requesting ? 'wait' : 'pointer',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {requesting ? 'Verifying...' : 'Submit'}
          </button>
        </div>
      )}

      {requestResult && (
        <div
          style={{
            marginTop: '8px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#888',
          }}
        >
          {requestResult}
        </div>
      )}
    </div>
  )
}
