'use client'

import { useState } from 'react'
import type { Item } from '@/lib/types'
import { getCategoryColor } from '@/lib/constants'

interface FitbResultItemProps {
  item: Item
  rank: number
  maxScore: number
}

export default function FitbResultItem({ item, rank, maxScore }: FitbResultItemProps) {
  const [imgError, setImgError] = useState(false)
  const chipColor = getCategoryColor(item.category)
  const scoreVal = item.score ?? item.compatibility_prob ?? 0
  const scorePercentage = Math.min((scoreVal / Math.max(maxScore, 0.001)) * 100, 100)
  const isTopThree = rank <= 3

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
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
              className="text-[11px] font-semibold uppercase tracking-wider inline-block"
              style={{ color: chipColor }}
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
    </div>
  )
}
