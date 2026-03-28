export const INDUSTRIES = [
  'Investment Banking',
  'Management Consulting',
  'Private Equity & Hedge Funds',
  'Big Tech',
  'Accounting',
  'Law',
  'Biotech & Pharma',
  'Venture Capital',
  'Asset Management',
  'Real Estate',
  'Engineering & Defense',
  'College Engineering Programs',
  'College Business Programs',
  'Technology Consulting',
] as const

export type Industry = (typeof INDUSTRIES)[number]

export function industryToSlug(industry: string): string {
  return industry
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function slugToIndustry(slug: string): string | undefined {
  return INDUSTRIES.find((i) => industryToSlug(i) === slug)
}
