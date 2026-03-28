import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { newRatings } from '@/lib/elo'
import crypto from 'crypto'

const DAILY_VOTE_LIMIT = 100

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { winnerId, loserId, industry, industryScope, voterLevel } = body

  if (!winnerId || !loserId || !industry || !industryScope || !voterLevel) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const validScopes = ['in_industry', 'all']
  const validLevels = ['student', 'entry', 'mid', 'senior']
  if (!validScopes.includes(industryScope) || !validLevels.includes(voterLevel)) {
    return NextResponse.json({ error: 'Invalid scope or level.' }, { status: 400 })
  }

  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex')
  const today = new Date().toISOString().split('T')[0]

  const supabase = createServiceClient()

  const { data: limitRow, error: limitErr } = await supabase
    .from('vote_limits')
    .select('count')
    .eq('ip_hash', ipHash)
    .eq('industry', industry)
    .eq('date', today)
    .maybeSingle()

  if (limitErr) console.error('Rate limit check error:', limitErr)

  if (limitRow && limitRow.count >= DAILY_VOTE_LIMIT) {
    return NextResponse.json(
      { error: 'Vote limit reached. Try again tomorrow.' },
      { status: 429 }
    )
  }

  // Always update 'all' scope (aggregate). Also update in_industry scope if voter selected it.
  const scopesToUpdate = industryScope === 'in_industry'
    ? ['all', 'in_industry']
    : ['all']

  // Fetch rating rows for all scopes × [voterLevel, global] in parallel
  const fetchPromises = scopesToUpdate.flatMap((scope) => [
    supabase.from('ratings').select('id, elo, wins, losses, total_votes').eq('company_id', winnerId).eq('industry_scope', scope).eq('voter_level', voterLevel).maybeSingle(),
    supabase.from('ratings').select('id, elo, wins, losses, total_votes').eq('company_id', loserId).eq('industry_scope', scope).eq('voter_level', voterLevel).maybeSingle(),
    supabase.from('ratings').select('id, elo, wins, losses, total_votes').eq('company_id', winnerId).eq('industry_scope', scope).eq('voter_level', 'global').maybeSingle(),
    supabase.from('ratings').select('id, elo, wins, losses, total_votes').eq('company_id', loserId).eq('industry_scope', scope).eq('voter_level', 'global').maybeSingle(),
  ])

  const fetchResults = await Promise.all(fetchPromises)

  const now = new Date().toISOString()
  let anyUpdated = false

  for (let i = 0; i < scopesToUpdate.length; i++) {
    const base = i * 4
    const winnerRating = fetchResults[base].data
    const loserRating  = fetchResults[base + 1].data
    const winnerGlobal = fetchResults[base + 2].data
    const loserGlobal  = fetchResults[base + 3].data

    if (!winnerRating || !loserRating || !winnerGlobal || !loserGlobal) {
      console.error('Rating rows not found for scope', scopesToUpdate[i], { winnerId, loserId, voterLevel })
      continue
    }

    const { winner: newWElo, loser: newLElo } = newRatings(winnerRating.elo, loserRating.elo)
    const { winner: newWGElo, loser: newLGElo } = newRatings(winnerGlobal.elo, loserGlobal.elo)

    const [r1, r2, r3, r4] = await Promise.all([
      supabase.from('ratings').update({ elo: newWElo,  wins: winnerRating.wins + 1, total_votes: winnerRating.total_votes + 1, updated_at: now }).eq('id', winnerRating.id),
      supabase.from('ratings').update({ elo: newLElo,  losses: loserRating.losses + 1, total_votes: loserRating.total_votes + 1, updated_at: now }).eq('id', loserRating.id),
      supabase.from('ratings').update({ elo: newWGElo, wins: winnerGlobal.wins + 1, total_votes: winnerGlobal.total_votes + 1, updated_at: now }).eq('id', winnerGlobal.id),
      supabase.from('ratings').update({ elo: newLGElo, losses: loserGlobal.losses + 1, total_votes: loserGlobal.total_votes + 1, updated_at: now }).eq('id', loserGlobal.id),
    ])

    if (r1.error || r2.error || r3.error || r4.error) {
      console.error('Rating update errors:', r1.error, r2.error, r3.error, r4.error)
      return NextResponse.json({ error: 'Failed to update ratings.' }, { status: 500 })
    }

    anyUpdated = true
  }

  if (!anyUpdated) {
    return NextResponse.json({ error: 'Rating rows not found.' }, { status: 404 })
  }

  // Update vote limit counter
  if (limitRow) {
    await supabase
      .from('vote_limits')
      .update({ count: limitRow.count + 1 })
      .eq('ip_hash', ipHash)
      .eq('industry', industry)
      .eq('date', today)
  } else {
    await supabase
      .from('vote_limits')
      .insert({ ip_hash: ipHash, industry, date: today, count: 1 })
  }

  return NextResponse.json({ success: true })
}
