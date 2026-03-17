'use client'

import { useState } from 'react'
import type { Item } from '@/lib/types'
import { getCategoryColor } from '@/lib/constants'

interface SelectedItemsPreviewProps {
  items: Item[]
  onRemoveItem: (item: Item) => void
}

export default function SelectedItemsPreview({ items, onRemoveItem }: SelectedItemsPreviewProps) {
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set())

  const handleImageError = (itemId: string) => {
    setImgErrors((prev) => new Set([...prev, itemId]))
  }

  if (items.length === 0) return null

  return (
    <div>
      <div
        className="text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: 'var(--accent)' }}
      >
        Selected Items ({items.length}/8)
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const hasError = imgErrors.has(item.item_id)
          const color = getCategoryColor(item.category)

          return (
            <div
              key={item.item_id}
              className="rounded-lg border overflow-hidden flex flex-col relative group"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              {/* Image */}
              {item.image_url && !hasError ? (
                <div
                  className="w-full overflow-hidden"
                  style={{ height: '100px', backgroundColor: 'var(--surface2)', padding: '4px' }}
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
                  style={{ height: '100px', backgroundColor: 'var(--surface2)' }}
                >
                  👗
                </div>
              )}

              {/* Info & remove button */}
              <div className="p-2.5 flex-1 flex flex-col relative">
                <p
                  className="text-xs leading-snug line-clamp-2 mb-1"
                  style={{ color: 'var(--text)' }}
                  title={item.title}
                >
                  {item.title}
                </p>

                <div
                  className="text-xs px-1.5 rounded w-fit"
                  style={{
                    backgroundColor: `${color}22`,
                    color,
                  }}
                >
                  Cat.{item.category}
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveItem(item)
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all opacity-0 group-hover:opacity-100"
                  style={{
                    backgroundColor: 'rgba(232, 124, 124, 0.8)',
                    color: '#fff',
                  }}
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
