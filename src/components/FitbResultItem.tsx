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
      className="rounded-lg border overflow-hidden"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Optional image */}
      {item.image_url && !imgError && (
        <div
          className="w-full overflow-hidden"
          style={{ height: '100px', backgroundColor: 'var(--surface2)' }}
        >
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="p-3">
        {/* Rank + title */}
        <div className="flex items-start gap-2 mb-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              backgroundColor: isTopThree ? 'var(--accent)' : 'var(--muted)',
              color: isTopThree ? '#0a0a0a' : 'var(--text)',
            }}
          >
            {rank}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-0.5"
              style={{ color: chipColor }}
            >
              Cat.{item.category}
            </div>
            <div
              className="text-xs truncate"
              style={{ color: 'var(--text)' }}
              title={item.title}
            >
              {item.title}
            </div>
          </div>
          <div className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
            #{item.item_id}
          </div>
        </div>

        {/* Score bar */}
        {scoreVal > 0 && (
          <div className="space-y-1">
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--surface2)' }}
            >
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${scorePercentage}%`,
                  background: 'linear-gradient(90deg, #7ec8a0, #5aa074)',
                }}
              />
            </div>
            <div className="text-xs font-semibold text-right" style={{ color: 'var(--green)' }}>
              {item.compatibility_prob !== undefined
                ? `${(item.compatibility_prob * 100).toFixed(1)}%`
                : scoreVal.toFixed(3)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
