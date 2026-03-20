'use client'

import { useState } from 'react'
import type { Outfit } from '@/lib/types'

interface OutfitCardProps {
  outfit: Outfit
  showScore?: boolean
  showImages?: boolean
  selected?: boolean
  onClick?: () => void
  onClear?: () => void
}

export default function OutfitCard({ outfit, showScore, showImages = true, selected, onClick, onClear }: OutfitCardProps) {
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState(false)
  const displayScore = outfit.score ?? outfit.similarity

  const handleImageError = (itemId: string) => {
    setImgErrors((prev) => {
      const next = new Set(prev)
      next.add(itemId)
      return next
    })
  }

  const hasMore = outfit.items.length > 4
  const visibleItems = expanded ? outfit.items : outfit.items.slice(0, hasMore ? 3 : 4)
  const moreCount = outfit.items.length - 3

  return (
    <div
      onClick={onClick}
      className="rounded-xl border overflow-hidden flex flex-col relative tactile-press"
      style={{
        backgroundColor: selected ? 'rgba(212,165,70,0.1)' : 'var(--surface)',
        borderColor: selected ? 'var(--accent)' : 'var(--border)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s var(--ease-out-expo)',
        boxShadow: selected
          ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 12px rgba(212,165,70,0.2)'
          : 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
      onMouseEnter={(e) => {
        if (onClick && !selected) {
          ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent2)'
          ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
          ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)'
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
      {/* Selected checkmark badge */}
      {selected && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10"
          style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
        >
          <svg width="8" height="7" viewBox="0 0 10 8" fill="none" aria-hidden="true">
            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Header row */}
      <div className="px-5 pt-4 pb-2.5 flex items-baseline justify-between gap-2">
        <div className="min-w-0">
          {outfit.rank !== undefined && (
            <span
              className="text-[11px] font-semibold uppercase tracking-wider mr-2 tabular-nums"
              style={{ color: 'var(--muted)' }}
            >
              #{outfit.rank}
            </span>
          )}
          <span
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--accent)' }}
          >
            Outfit {outfit.outfit_id}
          </span>
        </div>

        {showScore && displayScore !== undefined && (
          <span
            className="px-2 py-0.5 rounded text-xs font-bold tabular-nums shrink-0"
            style={{ backgroundColor: 'rgba(90,138,110,0.12)', color: 'var(--green)' }}
          >
            {`${(displayScore * 100).toFixed(1)}%`}
          </span>
        )}

        {onClear && (
          <button
            onClick={(e) => { e.stopPropagation(); onClear() }}
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 opacity-60 hover:opacity-100 tactile-press ml-auto"
            style={{
              backgroundColor: 'var(--status-error)',
              color: '#fff',
              transition: 'opacity 0.2s var(--ease-out-expo)',
            }}
            aria-label="Clear selection"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
              <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Image grid */}
      {showImages && outfit.items.length > 0 && (
        <div className="px-3 pb-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(2, visibleItems.length)}, 1fr)` }}>
          {visibleItems.map((item) => {
            const hasError = imgErrors.has(item.item_id)
            return (
              <div
                key={item.item_id}
                className="rounded-md overflow-hidden"
                style={{ backgroundColor: 'var(--surface2)' }}
                title={item.title}
              >
                {item.image_url && !hasError ? (
                  <div className="w-full overflow-hidden" style={{ height: '96px', padding: '4px' }}>
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-contain"
                      onError={() => handleImageError(item.item_id)}
                    />
                  </div>
                ) : (
                  <div
                    className="w-full flex items-center justify-center"
                    style={{ height: '96px', color: 'var(--muted)' }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ opacity: 0.3 }}>
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 17L8 12L12 16L16 11L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                <div className="px-2 py-1.5">
                  <p
                    className="text-[11px] leading-tight line-clamp-1"
                    style={{ color: 'var(--text)' }}
                  >
                    {item.title}
                  </p>
                  <span
                    className="text-[10px] px-1.5 rounded-full mt-0.5 inline-block"
                    style={{ backgroundColor: 'var(--bg)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                  >
                    {item.category}
                  </span>
                </div>
              </div>
            )
          })}

          {/* Dim slot — shown when collapsed and hasMore */}
          {hasMore && !expanded && (() => {
            const moreItem = outfit.items[3]
            const hasError = imgErrors.has(moreItem.item_id)
            return (
              <div
                key="more-slot"
                className="relative rounded-md overflow-hidden"
                style={{ backgroundColor: 'var(--surface2)', minHeight: '96px', cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); setExpanded(true) }}
              >
                {moreItem.image_url && !hasError ? (
                  <img
                    src={moreItem.image_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain p-1"
                    onError={() => handleImageError(moreItem.item_id)}
                  />
                ) : null}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0,0,0,0.62)' }}
                >
                  <span className="text-sm font-bold" style={{ color: '#fff' }}>
                    +{moreCount}
                  </span>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Show less */}
      {hasMore && expanded && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(false) }}
          className="pb-2 text-xs font-medium self-center"
          style={{ color: 'var(--accent)', cursor: 'pointer' }}
        >
          Show less
        </button>
      )}

      {/* Category chips */}
      <div
        className="px-5 py-3 flex flex-wrap gap-2 border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        {outfit.items.map((item) => (
          <span
            key={item.item_id}
            className="px-2 py-0.5 rounded-full text-[10px]"
            style={{ backgroundColor: 'var(--bg)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
            title={item.title}
          >
            {item.category}
          </span>
        ))}
      </div>
    </div>
  )
}
