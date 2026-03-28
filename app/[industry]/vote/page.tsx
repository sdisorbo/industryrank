'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { slugToIndustry } from '@/lib/industries'
import VotingArena from '@/components/VotingArena'
import LevelSelector from '@/components/LevelSelector'

export default function VotePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.industry as string
  const industry = slugToIndustry(slug)

  const [voterLevel, setVoterLevel] = useState<string | null>(null)
  const [industryScope, setIndustryScope] = useState<string | null>(null)
  const [showSelector, setShowSelector] = useState(false)

  useEffect(() => {
    if (!industry) {
      router.push('/')
      return
    }
    const savedLevel = localStorage.getItem('voterLevel')
    const savedInIndustry = localStorage.getItem('inIndustry')
    if (savedLevel && savedInIndustry !== null) {
      setVoterLevel(savedLevel)
      setIndustryScope(savedInIndustry === 'true' ? 'in_industry' : 'all')
    } else {
      setShowSelector(true)
    }
  }, [industry, router])

  if (!industry) return null

  function handleLevelConfirm(level: string, scope: string) {
    localStorage.setItem('voterLevel', level)
    localStorage.setItem('inIndustry', String(scope === 'in_industry'))
    setVoterLevel(level)
    setIndustryScope(scope)
    setShowSelector(false)
  }

  if (showSelector) {
    return (
      <LevelSelector
        industryName={industry}
        onConfirm={handleLevelConfirm}
        onClose={() => router.push(`/${slug}`)}
      />
    )
  }

  if (!voterLevel || !industryScope) {
    return null
  }

  return (
    <VotingArena
      industry={industry}
      voterLevel={voterLevel}
      industryScope={industryScope}
    />
  )
}
