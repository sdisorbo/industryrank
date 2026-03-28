export function getClearbitLogoUrl(domain: string): string {
  // Use Google's favicon service — reliable, free, no rate limits
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

export function getClearbitFallbackUrl(domain: string): string {
  return `https://logo.clearbit.com/${domain}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}
