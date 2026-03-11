'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname()

  const isRecommendActive = pathname === '/recommend' || pathname === '/'
  const isFitbActive = pathname === '/fitb'

  return (
    <header
      className="sticky top-0 z-20 border-b"
      style={{
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div>
            <h1
              className="text-3xl font-bold tracking-widest"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--accent)',
              }}
            >
              H·HFGAT
            </h1>
            <p
              className="text-xs mt-1 uppercase tracking-widest"
              style={{
                color: 'var(--muted)',
              }}
            >
              Fashion Graph Attention Network
            </p>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-1">
            {/* Top-K Recommend Tab */}
            <Link href="/recommend">
              <button
                className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: isRecommendActive ? 'var(--accent)' : 'var(--muted)',
                  borderBottom: isRecommendActive ? '2px solid var(--accent)' : '2px solid transparent',
                  backgroundColor: isRecommendActive ? 'rgba(200, 169, 110, 0.05)' : 'transparent',
                }}
              >
                ① Top-K Recommend
              </button>
            </Link>

            {/* Fill-in-the-Blank Tab */}
            <Link href="/fitb">
              <button
                className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: isFitbActive ? 'var(--accent)' : 'var(--muted)',
                  borderBottom: isFitbActive ? '2px solid var(--accent)' : '2px solid transparent',
                  backgroundColor: isFitbActive ? 'rgba(200, 169, 110, 0.05)' : 'transparent',
                }}
              >
                ② Fill-in-the-Blank
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
