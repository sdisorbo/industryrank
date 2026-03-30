import Link from 'next/link'

export const metadata = {
  title: 'About — IndustryRank',
  description: 'Industry rankings, anonymously curated.',
}

export default function AboutPage() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 32px',
      }}
    >
      <div style={{ maxWidth: '560px', width: '100%' }}>

        {/* Heading */}
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#444',
            margin: '0 0 48px 0',
          }}
        >
          About
        </h1>

        {/* Body */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            fontWeight: 300,
            color: '#aaaaaa',
            lineHeight: 1.8,
            margin: '0 0 24px 0',
          }}
        >
          IndustryRank is a community-driven ranking platform for companies and institutions
          across major industries. Every ranking is built entirely through anonymous head-to-head
          votes — no editorial bias, no sponsored placements.
        </p>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            fontWeight: 300,
            color: '#aaaaaa',
            lineHeight: 1.8,
            margin: '0 0 24px 0',
          }}
        >
          Choose an industry, pick a winner in each matchup, and watch the leaderboard shift in
          real time. You can vote as an industry insider or as an outside observer — both
          perspectives are tracked separately so the data stays meaningful.
        </p>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            fontWeight: 300,
            color: '#aaaaaa',
            lineHeight: 1.8,
            margin: '0 0 64px 0',
          }}
        >
          Rankings are powered by an ELO rating system — the same model used in competitive chess
          — so every vote carries weight and upsets actually matter.
        </p>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1a1a1a', marginBottom: '48px' }} />

        {/* Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#333',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Business inquiries &amp; questions
            </span>
            <a
              href="mailto:sfdisorbo@gmail.com"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 300,
                color: '#888',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              sfdisorbo@gmail.com
            </a>
          </div>

          <div>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#333',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              GitHub
            </span>
            <a
              href="https://github.com/sdisorbo"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 300,
                color: '#888',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              github.com/sdisorbo
            </a>
          </div>

          <div>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#333',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              LinkedIn
            </span>
            <a
              href="https://www.linkedin.com/in/sam-disorbo-b51056220/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 300,
                color: '#888',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              linkedin.com/in/sam-disorbo-b51056220
            </a>
          </div>
        </div>

        {/* Back link */}
        <div style={{ marginTop: '64px' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#333',
              textDecoration: 'none',
            }}
          >
            ← Back to Rankings
          </Link>
        </div>

      </div>
    </div>
  )
}
