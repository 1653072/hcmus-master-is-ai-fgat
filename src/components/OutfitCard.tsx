'use client'

import type { Outfit } from '@/lib/types'
import { getCategoryColor } from '@/lib/constants'

interface OutfitCardProps {
  outfit: Outfit
  showScore?: boolean
  selected?: boolean
  onClick?: () => void
}

export default function OutfitCard({ outfit, showScore, selected, onClick }: OutfitCardProps) {
  const displayScore = outfit.score ?? outfit.similarity

  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 border transition-all duration-150"
      style={{
        backgroundColor: selected ? 'rgba(200, 169, 110, 0.1)' : 'var(--surface)',
        borderColor: selected ? 'var(--accent)' : 'var(--border)',
        cursor: onClick ? 'pointer' : 'default',
        transform: selected ? 'translateY(-2px)' : 'none',
        boxShadow: selected ? '0 4px 16px rgba(200, 169, 110, 0.2)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (onClick && !selected) {
          ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent2)'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick && !selected) {
          ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'none'
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div>
          {outfit.rank !== undefined && (
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-0.5"
              style={{ color: 'var(--muted)' }}
            >
              #{outfit.rank}
            </div>
          )}
          <div
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--accent)' }}
          >
            Outfit {outfit.outfit_id}
          </div>
        </div>

        {showScore && displayScore !== undefined && (
          <div
            className="px-2 py-1 rounded text-xs font-semibold text-white shrink-0"
            style={{ backgroundColor: 'var(--green)' }}
          >
            {outfit.similarity !== undefined
              ? `${(outfit.similarity * 100).toFixed(1)}%`
              : displayScore.toFixed(3)}
          </div>
        )}
      </div>

      {/* Item chips */}
      <div className="flex flex-wrap gap-1.5">
        {outfit.items.map((item) => {
          const color = getCategoryColor(item.category)
          return (
            <div
              key={item.item_id}
              className="px-2 py-0.5 rounded-full text-xs border"
              style={{
                backgroundColor: `${color}18`,
                borderColor: color,
                color,
              }}
              title={item.title}
            >
              Cat.{item.category}
            </div>
          )
        })}
      </div>
    </div>
  )
}
