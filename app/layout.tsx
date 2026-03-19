import type { Metadata } from 'next'
import { Oswald, Raleway } from 'next/font/google'
import NavBar from '@/components/NavBar'
import './globals.css'

const oswald = Oswald({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const raleway = Raleway({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${oswald.variable} ${raleway.variable} antialiased`}
        style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
        }}
      >
        <NavBar />
        <main className="pt-2">
          {children}
        </main>
      </body>
    </html>
  )
}
