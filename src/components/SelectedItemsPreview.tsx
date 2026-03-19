'use client'

import { useState } from 'react'
import type { Item } from '@/lib/types'
import { getCategoryColor, MAX_SELECTED_ITEMS } from '@/lib/constants'

interface SelectedItemsPreviewProps {
  items: Item[]
  onRemoveItem: (item: Item) => void
}

export default function SelectedItemsPreview({ items, onRemoveItem }: SelectedItemsPreviewProps) {
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  const handleImageError = (itemId: string) => {
    setImgErrors((prev) => {
      const next = new Set(prev)
      next.add(itemId)
      return next
    })
  }

  if (items.length === 0) return null

  return (
    <div>
      <div
        className="section-label text-[10px] font-semibold uppercase tracking-wider mb-3 tabular-nums"
        style={{ color: 'var(--accent)' }}
      >
        Selected Items ({items.length}/{MAX_SELECTED_ITEMS})
      </div>
      <div className="grid grid-cols-4 gap-3">
        {items.map((item) => {
          const hasError = imgErrors.has(item.item_id)
          const color = getCategoryColor(item.category)

          return (
            <div
              key={item.item_id}
              className="rounded-xl border overflow-hidden flex flex-col relative group"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
              }}
            >
              {/* Remove button — anchored to card */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveItem(item)
                }}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100"
                style={{
                  backgroundColor: 'var(--status-error)',
                  color: '#fff',
                  transition: 'opacity 0.2s var(--ease-out-expo)',
                }}
                title="Remove item"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                  <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Image */}
              {item.image_url && !hasError ? (
                <div
                  className="w-full overflow-hidden"
                  style={{ height: '86px', backgroundColor: 'var(--surface2)', padding: '4px' }}
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
                  className="w-full flex items-center justify-center"
                  style={{ height: '86px', backgroundColor: 'var(--surface2)', color: 'var(--muted)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ opacity: 0.3 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 17L8 12L12 16L16 11L21 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Info */}
              <div className="px-3 py-2 flex-1 flex flex-col">
                <p
                  className="text-[11px] leading-tight line-clamp-1"
                  style={{ color: 'var(--text)' }}
                  title={item.title}
                >
                  {item.title}
                </p>

                <span
                  className="text-[10px] px-1.5 rounded inline-block w-fit mt-1"
                  style={{ backgroundColor: `${color}1a`, color }}
                >
                  <abbr title="Category" style={{ textDecoration: 'none' }}></abbr>{item.category}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
