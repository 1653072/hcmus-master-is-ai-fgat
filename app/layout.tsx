import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Mono } from 'next/font/google'
import NavBar from '@/components/NavBar'
import './globals.css'

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const dmMono = DM_Mono({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'H-HFGAT Fashion Demo',
  description: 'Hybrid-Hierarchical Fashion Graph Attention Network for outfit recommendation',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorantGaramond.variable} ${dmMono.variable} antialiased`}
        style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
        }}
      >
        <NavBar />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
