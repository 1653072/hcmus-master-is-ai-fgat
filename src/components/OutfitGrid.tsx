'use client'

import type { Outfit } from '@/lib/types'
import OutfitCard from './OutfitCard'

interface OutfitGridProps {
  outfits: Outfit[]
  showScore?: boolean
  selectedId?: string | null
  onSelect?: (outfitId: string) => void
  loading?: boolean
}

export default function OutfitGrid({
  outfits,
  showScore = false,
  selectedId,
  onSelect,
  loading = false,
}: OutfitGridProps) {
  if (loading) {
    return (
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 border animate-pulse"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              minHeight: '140px',
            }}
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="space-y-1.5">
                  <div className="h-2.5 rounded w-12" style={{ backgroundColor: 'var(--border)' }} />
                  <div className="h-2.5 rounded w-24" style={{ backgroundColor: 'var(--border)' }} />
                </div>
                <div className="w-10 h-6 rounded" style={{ backgroundColor: 'var(--border)' }} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="rounded-full border"
                    style={{
                      backgroundColor: 'var(--surface2)',
                      borderColor: 'var(--border)',
                      width: '52px',
                      height: '20px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (outfits.length === 0) {
    return (
      <div
        className="py-12 text-center rounded-xl"
        style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
      >
        No outfits found
      </div>
    )
  }

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
    >
      {outfits.map((outfit) => (
        <OutfitCard
          key={outfit.outfit_id}
          outfit={outfit}
          showScore={showScore}
          selected={selectedId === outfit.outfit_id}
          onClick={onSelect ? () => onSelect(outfit.outfit_id) : undefined}
        />
      ))}
    </div>
  )
}
