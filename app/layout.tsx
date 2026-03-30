import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'IndustryRank',
  description: 'Industry rankings, anonymously curated.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        style={{
          background: '#0a0a0a',
          color: '#ffffff',
          margin: 0,
          padding: 0,
          fontFamily: 'Inter, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />
        <main style={{ flex: 1, paddingTop: '56px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
