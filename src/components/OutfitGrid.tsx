'use client'

import type { Outfit } from '@/lib/types'
import OutfitCard from './OutfitCard'

interface OutfitGridProps {
  outfits: Outfit[]
  showScore?: boolean
  selectedId?: string | null
  onSelect?: (outfitId: string) => void
  loading?: boolean
  emptyMessage?: string
}

export default function OutfitGrid({
  outfits,
  showScore = false,
  selectedId,
  onSelect,
  loading = false,
  emptyMessage = 'No outfits found',
}: OutfitGridProps) {
  if (loading) {
    return (
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg skeleton-shimmer"
            style={{ minHeight: '200px' }}
          />
        ))}
      </div>
    )
  }

  if (outfits.length === 0) {
    return (
      <div
        className="py-16 text-center text-xs rounded-lg"
        style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      className="stagger-in grid gap-5"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
    >
      {outfits.map((outfit, i) => (
        <div key={outfit.outfit_id} style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}>
          <OutfitCard
            outfit={outfit}
            showScore={showScore}
            selected={selectedId === outfit.outfit_id}
            onClick={onSelect ? () => onSelect(outfit.outfit_id) : undefined}
          />
        </div>
      ))}
    </div>
  )
}
