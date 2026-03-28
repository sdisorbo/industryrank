import IndustryCard from '@/components/IndustryCard'
import { INDUSTRIES } from '@/lib/industries'

export default function Home() {
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
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 300,
            letterSpacing: '0.15em',
            color: '#ffffff',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 1,
          }}
        >
          INDUSTRYRANK
        </h1>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 300,
            color: '#444444',
            letterSpacing: '0.1em',
            marginTop: '24px',
          }}
        >
          The market decides.
        </p>
      </div>

      {/* Industry grid */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          maxWidth: '900px',
        }}
      >
        {INDUSTRIES.map((industry) => (
          <IndustryCard key={industry} industry={industry} />
        ))}
      </div>
    </div>
  )
}
