export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #1a1a1a',
        padding: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 300,
          letterSpacing: '0.15em',
          color: '#444444',
          textTransform: 'uppercase',
        }}
      >
        INDUSTRYRANK
      </span>
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '11px',
          fontWeight: 300,
          color: '#444444',
        }}
      >
        Rankings powered by ELO
      </span>
    </footer>
  )
}
