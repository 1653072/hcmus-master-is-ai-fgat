'use client'

import { useState } from 'react'
import type { Item } from '@/lib/types'
import { getCategoryColor } from '@/lib/constants'

interface ItemCardProps {
  item: Item
  selected?: boolean
  onClick?: () => void
}

export default function ItemCard({ item, selected, onClick }: ItemCardProps) {
  const [imgError, setImgError] = useState(false)
  const color = getCategoryColor(item.category)

  return (
    <div
      onClick={onClick}
      className="relative rounded-lg border transition-all duration-150 overflow-hidden"
      style={{
        backgroundColor: selected ? 'rgba(200, 169, 110, 0.1)' : 'var(--surface)',
        borderColor: selected ? 'var(--accent)' : 'var(--border)',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: selected ? '0 2px 10px rgba(200, 169, 110, 0.25)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (onClick && !selected) {
          ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent2)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick && !selected) {
          ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
        }
      }}
    >
      {/* Image */}
      {item.image_url && !imgError ? (
        <div
          className="w-full overflow-hidden"
          style={{ height: '110px', backgroundColor: 'var(--surface2)', padding: '4px' }}
        >
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div
          className="w-full flex items-center justify-center text-3xl"
          style={{ height: '110px', backgroundColor: 'var(--surface2)' }}
        >
          👗
        </div>
      )}

      {/* Info */}
      <div className="p-2.5">
        <div className="flex items-start justify-between gap-1 mb-1">
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${color}22`, color }}
          >
            Cat.{item.category}
          </span>
          <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>
            #{item.item_id}
          </span>
        </div>

        <p
          className="text-xs leading-snug line-clamp-2"
          style={{ color: 'var(--text)' }}
          title={item.title}
        >
          {item.title}
        </p>

        {item.score !== undefined && (
          <div className="text-xs mt-1.5 font-semibold" style={{ color: 'var(--green)' }}>
            Score: {item.score.toFixed(3)}
          </div>
        )}
      </div>

      {/* Selected indicator */}
      {selected && (
        <div
          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          ✓
        </div>
      )}
    </div>
  )
}
