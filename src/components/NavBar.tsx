'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/hooks/useTheme'

const TABS = [
  { href: '/recommend', label: 'Recommend' },
  { href: '/compatibility', label: 'Compatibility' },
  { href: '/similar', label: 'Similar' },
]

export default function NavBar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <header
      className="sticky top-0 z-20"
      style={{
        backgroundColor: 'var(--glass-bg)',
        backdropFilter: 'blur(28px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.6)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 0 rgba(0,0,0,0.3)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo — left-aligned */}
          <div className="shrink-0">
            <h1
              className="text-2xl font-bold tracking-wider leading-none"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
            >
              H·HFGAT
            </h1>
            <p
              className="text-[10px] mt-1 uppercase tracking-[0.25em]"
              style={{ color: 'var(--muted)' }}
            >
              Fashion Graph Attention Network
            </p>
          </div>

          {/* Tabs */}
          <nav
            className="flex gap-1 p-1 rounded-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
          >
            {TABS.map(({ href, label }) => {
              const isActive = pathname === href || (href === '/recommend' && pathname === '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className="px-5 py-1.5 rounded-lg text-xs font-medium no-underline tactile-press"
                  style={{
                    color: isActive ? 'var(--accent2)' : 'var(--muted)',
                    backgroundColor: isActive ? 'var(--glass-surface)' : 'transparent',
                    boxShadow: isActive
                      ? 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.4)'
                      : 'none',
                    transition: 'all 0.3s var(--ease-out-expo)',
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center tactile-press shrink-0"
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--muted)',
              transition: 'all 0.3s var(--ease-out-expo)',
            }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.17 3.17l1.06 1.06M11.77 11.77l1.06 1.06M3.17 12.83l1.06-1.06M11.77 4.23l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
