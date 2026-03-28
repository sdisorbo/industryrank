import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const industry = searchParams.get('industry')

  if (!query) {
    return NextResponse.json({ companies: [] })
  }

  let dbQuery = supabase
    .from('companies')
    .select('id, name, domain, industry')
    .ilike('name', `%${query}%`)
    .eq('verified', true)
    .limit(10)

  if (industry) {
    dbQuery = dbQuery.eq('industry', industry)
  }

  const { data, error } = await dbQuery

  if (error) {
    return NextResponse.json({ error: 'Search failed.' }, { status: 500 })
  }

  return NextResponse.json({ companies: data ?? [] })
}
