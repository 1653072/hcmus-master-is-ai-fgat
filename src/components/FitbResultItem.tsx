'use client'

import { useState } from 'react'
import type { Item } from '@/lib/types'

interface FitbResultItemProps {
  item: Item
  rank: number
  maxScore: number
  selected?: boolean
  onClick?: () => void
}

export default function FitbResultItem({ item, rank, maxScore, selected = false, onClick }: FitbResultItemProps) {
  const [imgError, setImgError] = useState(false)
  const scoreVal = item.score ?? item.compatibility_prob ?? 0
  const scorePercentage = Math.min((scoreVal / Math.max(maxScore, 0.001)) * 100, 100)
  const isTopThree = rank <= 3

  return (
    <div
      onClick={onClick}
      className="relative rounded-xl border overflow-hidden"
      style={{
        backgroundColor: selected ? 'rgba(212,165,70,0.1)' : 'var(--surface)',
        borderColor: selected ? 'var(--accent)' : 'var(--border)',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: selected
          ? 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 10px rgba(212,165,70,0.25)'
          : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        transition: 'all 0.3s var(--ease-out-expo)',
      }}
      onMouseEnter={(e) => {
        if (onClick && !selected) {
          ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent2)'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 14px rgba(0,0,0,0.35)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick && !selected) {
          ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'none'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.03)'
        }
      }}
    >
      {/* Optional image */}
      {item.image_url && !imgError && (
        <div
          className="w-full overflow-hidden"
          style={{ height: '120px', backgroundColor: 'var(--surface2)', padding: '4px' }}
        >
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="px-4 py-3">
        {/* Rank + title */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 tabular-nums"
            style={{
              backgroundColor: rank === 1 ? 'var(--accent)' : isTopThree ? 'rgba(212,165,70,0.18)' : 'var(--surface2)',
              color: rank === 1 ? '#fff' : isTopThree ? 'var(--accent)' : 'var(--muted)',
              boxShadow: rank === 1 ? '0 2px 6px rgba(212,165,70,0.45)' : 'none',
            }}
          >
            {rank}
          </div>
          <div className="flex-1 min-w-0">
            <span
              className="text-[11px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full inline-block"
              style={{ backgroundColor: 'var(--bg)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
            >
              <abbr title="Category" style={{ textDecoration: 'none' }}></abbr>{item.category}
            </span>
            <div
              className="text-xs truncate"
              style={{ color: 'var(--text)' }}
              title={item.title}
            >
              {item.title}
            </div>
          </div>
          <span className="text-[11px] shrink-0 tabular-nums" style={{ color: 'var(--muted)' }}>
            #{item.item_id}
          </span>
        </div>

        {/* Score bar */}
        {scoreVal > 0 && (
          <div className="space-y-1">
            <div
              className="w-full h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--surface2)' }}
            >
              <div
                className="h-full rounded-full animate-bar-fill"
                style={{
                  width: `${scorePercentage}%`,
                  background: 'linear-gradient(90deg, var(--status-success), var(--green))',
                }}
              />
            </div>
            <div className="text-xs font-semibold text-right tabular-nums" style={{ color: 'var(--green)' }}>
              {item.compatibility_prob !== undefined
                ? `${(item.compatibility_prob * 100).toFixed(1)}%`
                : `${(scoreVal * 100).toFixed(1)}%`}
            </div>
          </div>
        )}
      </div>

      {/* Selected indicator */}
      {selected && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center font-bold"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          <svg width="8" height="7" viewBox="0 0 10 8" fill="none" aria-hidden="true">
            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  )
}
