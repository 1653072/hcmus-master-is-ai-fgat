'use client'

import { useState } from 'react'
import type { Outfit } from '@/lib/types'
import { getCategoryColor } from '@/lib/constants'

interface OutfitCardProps {
  outfit: Outfit
  showScore?: boolean
  showImages?: boolean
  selected?: boolean
  onClick?: () => void
}

export default function OutfitCard({ outfit, showScore, showImages = true, selected, onClick }: OutfitCardProps) {
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())
  const displayScore = outfit.score ?? outfit.similarity

  const handleImageError = (itemId: string) => {
    setImgErrors((prev) => new Set([...prev, itemId]))
  }

  const visibleItems = outfit.items.slice(0, 4)

  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 border transition-all duration-150 flex flex-col relative"
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
      {/* Selected checkmark badge */}
      {selected && (
        <div
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          ✓
        </div>
      )}
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

      {/* Image grid */}
      {showImages && outfit.items.length > 0 && (
        <div className="mb-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(2, visibleItems.length)}, 1fr)` }}>
          {visibleItems.map((item) => {
            const hasError = imgErrors.has(item.item_id)
            return (
              <div
                key={item.item_id}
                className="rounded-lg overflow-hidden border flex flex-col"
                style={{
                  backgroundColor: 'var(--surface2)',
                  borderColor: 'var(--border)',
                }}
                title={item.title}
              >
                {/* Image or fallback */}
                {item.image_url && !hasError ? (
                  <div
                    className="w-full overflow-hidden"
                    style={{ height: '80px', backgroundColor: 'var(--surface2)', padding: '4px' }}
                  >
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-contain"
                      onError={() => handleImageError(item.item_id)}
                    />
                  </div>
                ) : (
                  <div
                    className="w-full flex items-center justify-center text-3xl"
                    style={{ height: '80px', backgroundColor: 'var(--surface2)' }}
                  >
                    👗
                  </div>
                )}

                {/* Title & category */}
                <div className="p-2 flex-1 flex flex-col">
                  <p
                    className="text-xs leading-tight line-clamp-1 mb-1"
                    style={{ color: 'var(--text)' }}
                    title={item.title}
                  >
                    {item.title}
                  </p>
                  <div
                    className="text-xs px-1 rounded w-fit"
                    style={{
                      backgroundColor: `${getCategoryColor(item.category)}22`,
                      color: getCategoryColor(item.category),
                    }}
                  >
                    Cat.{item.category}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Item chips (category legend) */}
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
