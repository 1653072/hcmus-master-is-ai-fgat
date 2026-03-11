'use client'

import { CAT_COLORS } from '@/lib/constants'
import { useItems } from '@/hooks/useItems'

interface ItemSelectorProps {
  category: string
  selectedId: number | null
  onSelect: (itemId: number) => void
}

export default function ItemSelector({
  category,
  selectedId,
  onSelect,
}: ItemSelectorProps) {
  const { items, loading, error } = useItems(category)

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {error && (
        <div
          className="p-2 text-xs"
          style={{
            backgroundColor: 'rgba(232, 124, 124, 0.1)',
            color: '#e87c7c',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {error}
        </div>
      )}

      <div
        className="overflow-y-auto"
        style={{
          maxHeight: '160px',
        }}
      >
        {loading ? (
          <div
            className="p-3 text-xs"
            style={{ color: 'var(--muted)' }}
          >
            Loading items...
          </div>
        ) : items.length === 0 ? (
          <div
            className="p-3 text-xs"
            style={{ color: 'var(--muted)' }}
          >
            {category ? 'No items found' : 'Select a category first'}
          </div>
        ) : (
          <div>
            {items.map((item) => {
              const chipColor = CAT_COLORS[item.category] || '#888888'
              const isSelected = selectedId === item.item_id

              return (
                <button
                  key={item.item_id}
                  onClick={() => onSelect(item.item_id)}
                  className="w-full px-3 py-2 flex items-center gap-2 text-xs border-b transition-colors hover:bg-opacity-50"
                  style={{
                    backgroundColor: isSelected
                      ? 'rgba(200, 169, 110, 0.1)'
                      : 'transparent',
                    borderBottomColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                >
                  {/* Category Chip */}
                  <div
                    className="px-2 py-1 rounded text-xs font-medium shrink-0"
                    style={{
                      backgroundColor: `${chipColor}20`,
                      borderLeft: `2px solid ${chipColor}`,
                      color: chipColor,
                    }}
                  >
                    {item.category.slice(0, 3).toUpperCase()}
                  </div>

                  {/* Title */}
                  <span className="truncate flex-1 text-left">
                    {item.title}
                  </span>

                  {/* Item ID */}
                  <span
                    className="text-xs shrink-0"
                    style={{ color: 'var(--muted)' }}
                  >
                    #{item.item_id}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
