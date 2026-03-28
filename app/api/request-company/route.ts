import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { verifyCompany } from '@/lib/verifyCompany'

const VOTER_LEVELS = ['student', 'entry', 'mid', 'senior', 'global']
const INDUSTRY_SCOPES = ['in_industry', 'all']

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, industry } = body

  if (!name || !industry) {
    return NextResponse.json({ error: 'Name and industry are required.' }, { status: 400 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  const supabase = createServiceClient()

  // Check if already exists
  const { data: existing } = await supabase
    .from('companies')
    .select('id')
    .eq('industry', industry)
    .ilike('name', name)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Company already exists in this industry.' }, { status: 409 })
  }

  // Verify the company
  const result = await verifyCompany(name, industry)

  if (!result.verified || !result.domain) {
    // Log request for manual review
    await supabase.from('company_requests').insert({
      name,
      industry,
      status: 'pending',
      requester_ip: ip,
    })

    return NextResponse.json(
      { verified: false, message: "We couldn't verify that company. Please check the name." },
      { status: 422 }
    )
  }

  // Insert company
  const { data: newCompany, error: insertError } = await supabase
    .from('companies')
    .insert({
      name: result.canonicalName ?? name,
      domain: result.domain,
      industry,
      verified: true,
    })
    .select('id')
    .single()

  if (insertError || !newCompany) {
    return NextResponse.json({ error: 'Failed to add company.' }, { status: 500 })
  }

  // Create rating rows for all combinations
  const ratingRows = []
  for (const scope of INDUSTRY_SCOPES) {
    for (const level of VOTER_LEVELS) {
      ratingRows.push({
        company_id: newCompany.id,
        industry_scope: scope,
        voter_level: level,
        elo: 1200,
        wins: 0,
        losses: 0,
        total_votes: 0,
      })
    }
  }

  await supabase.from('ratings').insert(ratingRows)

  // Log approved request
  await supabase.from('company_requests').insert({
    name: result.canonicalName ?? name,
    industry,
    status: 'approved',
    requester_ip: ip,
  })

  return NextResponse.json({
    verified: true,
    message: "Added! It will appear after its first votes.",
    company: { id: newCompany.id, name: result.canonicalName ?? name, domain: result.domain },
  })
}
