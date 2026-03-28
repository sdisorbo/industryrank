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

  // Fetch all 4 rating rows in parallel
  const [
    { data: winnerRating },
    { data: loserRating },
    { data: winnerGlobal },
    { data: loserGlobal },
  ] = await Promise.all([
    supabase.from('ratings').select('id, elo, wins, losses, total_votes').eq('company_id', winnerId).eq('industry_scope', industryScope).eq('voter_level', voterLevel).maybeSingle(),
    supabase.from('ratings').select('id, elo, wins, losses, total_votes').eq('company_id', loserId).eq('industry_scope', industryScope).eq('voter_level', voterLevel).maybeSingle(),
    supabase.from('ratings').select('id, elo, wins, losses, total_votes').eq('company_id', winnerId).eq('industry_scope', industryScope).eq('voter_level', 'global').maybeSingle(),
    supabase.from('ratings').select('id, elo, wins, losses, total_votes').eq('company_id', loserId).eq('industry_scope', industryScope).eq('voter_level', 'global').maybeSingle(),
  ])

  if (!winnerRating || !loserRating || !winnerGlobal || !loserGlobal) {
    return NextResponse.json({ error: 'Rating rows not found.' }, { status: 404 })
  }

  // Compute new ELOs
  const { winner: newWinnerElo, loser: newLoserElo } = newRatings(
    winnerRating.elo,
    loserRating.elo
  )
  const { winner: newWinnerGlobalElo, loser: newLoserGlobalElo } = newRatings(
    winnerGlobal.elo,
    loserGlobal.elo
  )

  // Run all 4 updates in parallel
  const now = new Date().toISOString()
  const [{ error: e1 }, { error: e2 }, { error: e3 }, { error: e4 }] = await Promise.all([
    supabase.from('ratings').update({ elo: newWinnerElo, wins: winnerRating.wins + 1, total_votes: winnerRating.total_votes + 1, updated_at: now }).eq('id', winnerRating.id),
    supabase.from('ratings').update({ elo: newLoserElo, losses: loserRating.losses + 1, total_votes: loserRating.total_votes + 1, updated_at: now }).eq('id', loserRating.id),
    supabase.from('ratings').update({ elo: newWinnerGlobalElo, wins: winnerGlobal.wins + 1, total_votes: winnerGlobal.total_votes + 1, updated_at: now }).eq('id', winnerGlobal.id),
    supabase.from('ratings').update({ elo: newLoserGlobalElo, losses: loserGlobal.losses + 1, total_votes: loserGlobal.total_votes + 1, updated_at: now }).eq('id', loserGlobal.id),
  ])

  if (e1 || e2 || e3 || e4) {
    console.error('Rating update errors:', { e1, e2, e3, e4 })
    return NextResponse.json({ error: 'Failed to update ratings.' }, { status: 500 })
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
