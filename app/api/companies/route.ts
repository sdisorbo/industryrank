import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const industry = searchParams.get('industry')
  const industryScope = searchParams.get('industryScope') ?? 'all'
  const voterLevel = searchParams.get('voterLevel') ?? 'global'
  const sortBy = searchParams.get('sortBy') ?? 'elo'
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const pageSize = 25

  if (!industry) {
    return NextResponse.json({ error: 'Industry required.' }, { status: 400 })
  }

  // Fetch companies in this industry
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, name, domain, industry')
    .eq('industry', industry)
    .eq('verified', true)

  if (error) {
    console.error('Failed to fetch companies:', error)
    return NextResponse.json({ error: 'Failed to fetch companies.' }, { status: 500 })
  }

  if (!companies || companies.length === 0) {
    return NextResponse.json({ companies: [], total: 0 })
  }

  const companyIds = companies.map((c) => c.id)

  // Fetch ratings
  const { data: ratings, error: ratingsError } = await supabase
    .from('ratings')
    .select('company_id, elo, wins, losses, total_votes')
    .in('company_id', companyIds)
    .eq('industry_scope', industryScope)
    .eq('voter_level', voterLevel)

  if (ratingsError) {
    console.error('Failed to fetch ratings:', ratingsError)
    return NextResponse.json({ error: 'Failed to fetch ratings.' }, { status: 500 })
  }

  const ratingsMap = new Map(ratings?.map((r) => [r.company_id, r]) ?? [])

  let merged = companies.map((company) => {
    const rating = ratingsMap.get(company.id)
    return {
      ...company,
      elo: rating?.elo ?? 1200,
      wins: rating?.wins ?? 0,
      losses: rating?.losses ?? 0,
      total_votes: rating?.total_votes ?? 0,
      win_rate:
        (rating?.wins ?? 0) + (rating?.losses ?? 0) > 0
          ? (rating?.wins ?? 0) / ((rating?.wins ?? 0) + (rating?.losses ?? 0))
          : 0,
    }
  })

  // Sort
  if (sortBy === 'elo') {
    merged.sort((a, b) => b.elo - a.elo)
  } else if (sortBy === 'win_rate') {
    merged.sort((a, b) => b.win_rate - a.win_rate)
  } else if (sortBy === 'total_votes') {
    merged.sort((a, b) => b.total_votes - a.total_votes)
  }

  const total = merged.length
  const paginated = merged.slice((page - 1) * pageSize, page * pageSize)

  return NextResponse.json({ companies: paginated, total })
}
