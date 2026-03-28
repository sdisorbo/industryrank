'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CompanyLogo } from './CompanyCard'
import SearchBar from './SearchBar'

interface RankedCompany {
  id: string
  name: string
  domain: string
  industry: string
  elo: number
  wins: number
  losses: number
  total_votes: number
  win_rate: number
}

interface RankingsTableProps {
  industry: string
}

const SCOPE_OPTIONS = [
  { id: 'all', label: 'All Voters' },
  { id: 'in_industry', label: 'In Industry' },
]

const LEVEL_OPTIONS = [
  { id: 'global', label: 'Overall' },
  { id: 'student', label: 'Student' },
  { id: 'entry', label: 'Entry' },
  { id: 'mid', label: 'Mid' },
  { id: 'senior', label: 'Senior' },
]

const SORT_OPTIONS = [
  { id: 'elo', label: 'ELO' },
  { id: 'win_rate', label: 'Win Rate' },
  { id: 'total_votes', label: 'Votes' },
]

export default function RankingsTable({ industry }: RankingsTableProps) {
  const [scope, setScope] = useState('all')
  const [level, setLevel] = useState('global')
  const [sortBy, setSortBy] = useState('elo')
  const [companies, setCompanies] = useState<RankedCompany[]>([])
  const [filtered, setFiltered] = useState<RankedCompany[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchRankings = useCallback(() => {
    setLoading(true)
    fetch(
      `/api/companies?industry=${encodeURIComponent(industry)}&industryScope=${scope}&voterLevel=${level}&sortBy=${sortBy}&page=${page}`
    )
      .then((r) => r.json())
      .then((data) => {
        setCompanies(data.companies ?? [])
        setTotal(data.total ?? 0)
        setLoading(false)
      })
  }, [industry, scope, level, sortBy, page])

  useEffect(() => {
    setPage(1)
  }, [scope, level, sortBy])

  useEffect(() => {
    fetchRankings()
  }, [fetchRankings])

  useEffect(() => {
    if (!searchQuery) {
      setFiltered(companies)
    } else {
      setFiltered(
        companies.filter((c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
  }, [companies, searchQuery])

  const pageOffset = (page - 1) * 25

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          position: 'sticky',
          top: '56px',
          zIndex: 20,
          background: '#0a0a0a',
          borderBottom: '1px solid #1a1a1a',
          padding: '16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Scope toggle */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {SCOPE_OPTIONS.map((opt) => (
            <FilterButton
              key={opt.id}
              active={scope === opt.id}
              onClick={() => setScope(opt.id)}
            >
              {opt.label}
            </FilterButton>
          ))}
        </div>

        {/* Level + sort row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {LEVEL_OPTIONS.map((opt) => (
              <FilterButton
                key={opt.id}
                active={level === opt.id}
                onClick={() => setLevel(opt.id)}
              >
                {opt.label}
              </FilterButton>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                color: '#444',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginRight: '8px',
              }}
            >
              Sort
            </span>
            {SORT_OPTIONS.map((opt) => (
              <FilterButton
                key={opt.id}
                active={sortBy === opt.id}
                onClick={() => setSortBy(opt.id)}
              >
                {opt.label}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Search */}
        <SearchBar industry={industry} onSearch={setSearchQuery} />
      </div>

      {/* Table */}
      <div style={{ marginTop: '32px' }}>
        {loading ? (
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#444',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '48px 0',
              textAlign: 'center',
            }}
          >
            Loading
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#444',
              padding: '48px 0',
              textAlign: 'center',
            }}
          >
            No rankings yet. Be the first to vote.
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 48px 1fr 100px 60px 60px 80px 80px',
                gap: '16px',
                padding: '8px 0',
                borderBottom: '1px solid #1a1a1a',
                marginBottom: '4px',
              }}
            >
              {['Rank', '', 'Company', 'ELO', 'W', 'L', 'Win %', 'Votes'].map((h) => (
                <span
                  key={h}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    fontWeight: 400,
                    letterSpacing: '0.15em',
                    color: '#444',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            <AnimatePresence>
              {filtered.map((company, idx) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, delay: idx * 0.02 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 48px 1fr 100px 60px 60px 80px 80px',
                    gap: '16px',
                    padding: '14px 0',
                    borderBottom: '1px solid #1a1a1a',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '20px',
                      fontWeight: 300,
                      color: '#333',
                    }}
                  >
                    #{pageOffset + idx + 1}
                  </span>
                  <CompanyLogo name={company.name} domain={company.domain} size={32} />
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 300,
                      color: '#ffffff',
                    }}
                  >
                    {company.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#ffffff',
                    }}
                  >
                    {Math.round(company.elo)}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888' }}>
                    {company.wins}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888' }}>
                    {company.losses}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888' }}>
                    {company.total_votes > 0
                      ? `${(company.win_rate * 100).toFixed(1)}%`
                      : '—'}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#444' }}>
                    {company.total_votes}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* ELO explanation */}
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#444',
                lineHeight: 1.6,
                marginTop: '32px',
              }}
            >
              Rankings use the ELO system — each vote updates scores based on the expected probability of winning. A victory over a higher-ranked company gains more points.
            </p>

            {/* Pagination */}
            {total > 25 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '32px', alignItems: 'center' }}>
                <PaginationButton
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ←
                </PaginationButton>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: '#444',
                  }}
                >
                  {page} / {Math.ceil(total / 25)}
                </span>
                <PaginationButton
                  disabled={page >= Math.ceil(total / 25)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  →
                </PaginationButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        border: '1px solid',
        borderColor: active ? '#ffffff' : '#222',
        background: active ? '#ffffff' : 'transparent',
        color: active ? '#0a0a0a' : '#888',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        fontWeight: 400,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: '200ms ease',
        borderRadius: '9999px',
      }}
    >
      {children}
    </button>
  )
}

function PaginationButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: '6px 16px',
        border: '1px solid #222',
        background: 'transparent',
        color: disabled ? '#333' : '#888',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: '200ms ease',
      }}
    >
      {children}
    </button>
  )
}
