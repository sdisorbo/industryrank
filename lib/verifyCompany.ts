export interface VerificationResult {
  verified: boolean
  domain: string | null
  canonicalName: string | null
}

export async function verifyCompany(
  name: string,
  industry: string
): Promise<VerificationResult> {
  const braveKey = process.env.BRAVE_SEARCH_API_KEY
  const serpKey = process.env.SERP_API_KEY

  if (braveKey) {
    return verifyWithBrave(name, industry, braveKey)
  }

  if (serpKey) {
    return verifyWithSerp(name, industry, serpKey)
  }

  // No API key available — queue for manual review
  return { verified: false, domain: null, canonicalName: null }
}

async function verifyWithBrave(
  name: string,
  industry: string,
  apiKey: string
): Promise<VerificationResult> {
  try {
    const query = encodeURIComponent(`${name} ${industry} company`)
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${query}&count=5`,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': apiKey,
        },
      }
    )

    if (!res.ok) return { verified: false, domain: null, canonicalName: null }

    const data = await res.json()
    const results = data?.web?.results ?? []

    const nameLower = name.toLowerCase()
    const match = results.find(
      (r: { title: string; description: string; url: string }) =>
        r.title?.toLowerCase().includes(nameLower) ||
        r.description?.toLowerCase().includes(nameLower)
    )

    if (!match) return { verified: false, domain: null, canonicalName: null }

    const url = new URL(match.url)
    const domain = url.hostname.replace('www.', '')

    return { verified: true, domain, canonicalName: match.title?.split(' - ')[0] ?? name }
  } catch {
    return { verified: false, domain: null, canonicalName: null }
  }
}

async function verifyWithSerp(
  name: string,
  industry: string,
  apiKey: string
): Promise<VerificationResult> {
  try {
    const query = encodeURIComponent(`${name} ${industry} company`)
    const res = await fetch(
      `https://serpapi.com/search.json?q=${query}&api_key=${apiKey}&num=5`
    )

    if (!res.ok) return { verified: false, domain: null, canonicalName: null }

    const data = await res.json()
    const results = data?.organic_results ?? []

    const nameLower = name.toLowerCase()
    const match = results.find(
      (r: { title: string; snippet: string; link: string }) =>
        r.title?.toLowerCase().includes(nameLower) ||
        r.snippet?.toLowerCase().includes(nameLower)
    )

    if (!match) return { verified: false, domain: null, canonicalName: null }

    const url = new URL(match.link)
    const domain = url.hostname.replace('www.', '')

    return { verified: true, domain, canonicalName: match.title?.split(' - ')[0] ?? name }
  } catch {
    return { verified: false, domain: null, canonicalName: null }
  }
}
