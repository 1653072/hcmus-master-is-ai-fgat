'use client'

import { useState } from 'react'
import type { Item } from '@/lib/types'

interface ItemCardProps {
  item: Item
  selected?: boolean
  onClick?: () => void
}

export default function ItemCard({ item, selected, onClick }: ItemCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      onClick={onClick}
      className="relative rounded-xl border overflow-hidden tactile-press"
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
      {/* Image */}
      {item.image_url && !imgError ? (
        <div
          className="w-full overflow-hidden"
          style={{ height: '116px', backgroundColor: 'var(--surface2)', padding: '5px' }}
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
          className="w-full flex items-center justify-center"
          style={{ height: '116px', backgroundColor: 'var(--surface2)', color: 'var(--muted)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ opacity: 0.3 }}>
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 17L8 12L12 16L16 11L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Info */}
      <div className="px-3.5 py-2.5">
        <div className="flex items-start justify-between gap-1.5 mb-1">
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
          >
            <abbr title="Category" style={{ textDecoration: 'none' }}></abbr>{item.category}
          </span>
          <span className="text-[11px] shrink-0 tabular-nums" style={{ color: 'var(--muted)' }}>
            #{item.item_id}
          </span>
        </div>

        <p
          className="text-xs leading-tight line-clamp-1"
          style={{ color: 'var(--text)' }}
          title={item.title}
        >
          {item.title}
        </p>

        {item.score !== undefined && (
          <div className="text-xs mt-1.5 font-semibold tabular-nums" style={{ color: 'var(--green)' }}>
            Score: {item.score.toFixed(3)}
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
