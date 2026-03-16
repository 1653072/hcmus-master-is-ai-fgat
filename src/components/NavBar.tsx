'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/recommend', label: '① Recommend Outfit' },
  { href: '/compatibility', label: '② Outfit Compatibility' },
  { href: '/similar', label: '③ Similar Outfits' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <header
      className="sticky top-0 z-20 border-b"
      style={{
        backgroundColor: 'rgba(240, 235, 227, 0.92)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Logo */}
          <div>
            <h1
              className="text-3xl font-bold tracking-widest"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
            >
              H·HFGAT
            </h1>
            <p className="text-xs mt-0.5 uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
              Fashion Graph Attention Network
            </p>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 flex-wrap">
            {TABS.map(({ href, label }) => {
              const isActive = pathname === href || (href === '/recommend' && pathname === '/')
              return (
                <Link key={href} href={href}>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      color: isActive ? 'var(--accent)' : 'var(--muted)',
                      borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      backgroundColor: isActive ? 'rgba(200, 169, 110, 0.08)' : 'transparent',
                    }}
                  >
                    {label}
                  </button>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
