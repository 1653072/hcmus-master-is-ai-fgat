'use client'

import { Outfit } from '@/lib/types'
import OutfitCard from './OutfitCard'

interface OutfitGridProps {
  outfits: Outfit[]
  rank?: boolean
  showScore?: boolean
  loading?: boolean
}

export default function OutfitGrid({
  outfits,
  rank = false,
  showScore = false,
  loading = false,
}: OutfitGridProps) {
  return (
    <div
      className="grid gap-[10px]"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      }}
    >
      {loading ? (
        // Skeleton loading: 8 placeholder cards
        Array.from({ length: 8 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="rounded-xl p-4 border animate-pulse"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              minHeight: '150px',
            }}
          >
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2 flex-1">
                <div
                  className="h-3 rounded w-20"
                  style={{ backgroundColor: 'var(--border)' }}
                />
                <div
                  className="h-3 rounded w-32"
                  style={{ backgroundColor: 'var(--border)' }}
                />
              </div>
              <div
                className="w-12 h-6 rounded"
                style={{ backgroundColor: 'var(--border)' }}
              />
            </div>

            {/* Items skeleton */}
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="px-3 py-1 rounded-full border-2"
                  style={{
                    backgroundColor: 'var(--surface2)',
                    borderColor: 'var(--border)',
                    width: '60px',
                    height: '24px',
                  }}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        // Actual outfit cards
        outfits.map((outfit, index) => (
          <OutfitCard
            key={outfit.outfit_id}
            outfit={outfit}
            rank={rank ? index + 1 : undefined}
            showScore={showScore}
          />
        ))
      )}
    </div>
  )
}
