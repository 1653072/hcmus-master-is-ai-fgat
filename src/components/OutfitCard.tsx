'use client'

import { Outfit } from '@/lib/types'
import { CAT_COLORS } from '@/lib/constants'

interface OutfitCardProps {
  outfit: Outfit
  rank?: number
  showScore?: boolean
}

export default function OutfitCard({ outfit, rank, showScore }: OutfitCardProps) {
  return (
    <div
      className="rounded-xl p-4 border transition-all"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div>
          {rank !== undefined && (
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: 'var(--muted)' }}
            >
              #{rank}
            </div>
          )}
          <div
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--accent)' }}
          >
            Outfit {outfit.outfit_id}
          </div>
        </div>

        {showScore && outfit.score !== undefined && (
          <div
            className="px-2 py-1 rounded text-xs font-semibold text-white"
            style={{
              backgroundColor: 'var(--green)',
            }}
          >
            {outfit.score.toFixed(3)}
          </div>
        )}
      </div>

      {/* Item Chips */}
      <div className="flex flex-wrap gap-2">
        {outfit.items.map((item) => {
          const chipColor = CAT_COLORS[item.category] || '#888888'

          return (
            <div
              key={item.item_id}
              className="px-3 py-1 rounded-full text-xs border-2 transition-all cursor-default"
              style={{
                backgroundColor: `${chipColor}15`, // 15% opacity
                borderColor: chipColor,
                color: chipColor,
              }}
              title={item.title}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.borderColor =
                  'var(--accent2)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 0 8px ${chipColor}`
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.borderColor =
                  chipColor
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
              }}
            >
              {item.category}
            </div>
          )
        })}
      </div>
    </div>
  )
}
