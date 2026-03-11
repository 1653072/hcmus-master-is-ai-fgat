'use client'

import { Item } from '@/lib/types'
import { CAT_COLORS } from '@/lib/constants'

interface FitbResultItemProps {
  item: Item
  rank: number
  maxScore: number
}

export default function FitbResultItem({
  item,
  rank,
  maxScore,
}: FitbResultItemProps) {
  const chipColor = CAT_COLORS[item.category] || '#888888'
  const scorePercentage = item.score
    ? Math.min((item.score / maxScore) * 100, 100)
    : 0
  const isTopThree = rank <= 3

  return (
    <div
      className="rounded-lg p-4 border overflow-hidden"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Rank + Title */}
      <div className="flex items-start gap-3 mb-3">
        {/* Rank Badge */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{
            backgroundColor: isTopThree ? 'var(--accent)' : 'var(--muted)',
            color: isTopThree ? '#0a0a0a' : 'var(--text)',
          }}
        >
          {rank}
        </div>

        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: chipColor }}
          >
            {item.category}
          </div>
          <div
            className="text-sm truncate"
            style={{ color: 'var(--text)' }}
          >
            {item.title}
          </div>
        </div>

        {/* Item ID */}
        <div
          className="text-xs shrink-0"
          style={{ color: 'var(--muted)' }}
        >
          #{item.item_id}
        </div>
      </div>

      {/* Score Bar */}
      {item.score !== undefined && (
        <div className="space-y-1">
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{
              backgroundColor: 'var(--surface2)',
            }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${scorePercentage}%`,
                background: `linear-gradient(90deg, #7ec8a0, #5aa074)`,
              }}
            />
          </div>

          {/* Score Number */}
          <div
            className="text-xs font-semibold text-right"
            style={{ color: 'var(--green)' }}
          >
            {item.score.toFixed(3)}
          </div>
        </div>
      )}
    </div>
  )
}
