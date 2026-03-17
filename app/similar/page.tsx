'use client'

import { useState } from 'react'
import OutfitGrid from '@/components/OutfitGrid'
import OutfitCard from '@/components/OutfitCard'
import Pagination from '@/components/Pagination'
import { useOutfits } from '@/hooks/useOutfits'
import { useSimilarOutfits } from '@/hooks/useSimilarOutfits'
import { getCategoryColor } from '@/lib/constants'
import type { Outfit } from '@/lib/types'

export default function SimilarPage() {
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null)
  const [selectedImgErrors, setSelectedImgErrors] = useState<Set<string>>(new Set())

  const { outfits, loading: outfitsLoading, page, totalPages, total, setPage } = useOutfits(12)
  const { result, loading: searching, error, submit, reset } = useSimilarOutfits()

  const handleSelectOutfit = (outfitId: string) => {
    setSelectedOutfitId(outfitId)
    setSelectedImgErrors(new Set())
    reset()
  }

  const handleClearSelection = () => {
    setSelectedOutfitId(null)
    setSelectedImgErrors(new Set())
    reset()
  }

  const handleFindSimilar = () => {
    if (selectedOutfitId) submit(selectedOutfitId, 10)
  }

  const handleImageError = (itemId: string) => {
    setSelectedImgErrors((prev) => new Set([...prev, itemId]))
  }

  const selectedOutfitEntry = outfits.find((o) => o.outfit_id === selectedOutfitId)

  const similarOutfits: Outfit[] =
    result?.similar_outfits.map((s) => ({
      outfit_id: s.outfit_id,
      rank: s.rank,
      similarity: s.similarity,
      items: s.items,
    })) ?? []

  // Show the queried outfit from result (enriched by BE) or from local list
  const queryOutfit: Outfit | null = result
    ? { outfit_id: result.outfit_id, items: result.outfit_items }
    : selectedOutfitEntry
      ? { outfit_id: selectedOutfitEntry.outfit_id, items: selectedOutfitEntry.items }
      : null

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold uppercase tracking-wider mb-1"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
        >
          Similar Outfits
        </h1>
        <p style={{ color: 'var(--muted)' }} className="text-sm">
          Browse outfits in the dataset, select one, and discover the most visually similar outfits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Left: Outfit browser ── */}
        <div className="lg:col-span-2 space-y-4">
          <div
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--accent)' }}
          >
            Browse Outfits
            {total > 0 && (
              <span
                className="ml-2 font-normal normal-case"
                style={{ color: 'var(--muted)' }}
              >
                ({total.toLocaleString()} total)
              </span>
            )}
          </div>

          {outfitsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl animate-pulse"
                  style={{ backgroundColor: 'var(--surface)', minHeight: '100px' }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {outfits.map((outfit) => (
                <OutfitCard
                  key={outfit.outfit_id}
                  outfit={{ outfit_id: outfit.outfit_id, items: outfit.items }}
                  selected={selectedOutfitId === outfit.outfit_id}
                  onClick={() => handleSelectOutfit(outfit.outfit_id)}
                />
              ))}
              {outfits.length === 0 && (
                <div
                  className="col-span-2 py-8 text-center text-sm rounded-xl"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
                >
                  No outfits found
                </div>
              )}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

        {/* ── Right: Selected outfit + Results ── */}
        <div className="lg:col-span-3 space-y-6">
          {error && (
            <div
              className="p-4 rounded-lg text-sm"
              style={{
                backgroundColor: 'rgba(232, 124, 124, 0.1)',
                borderLeft: '3px solid #e87c7c',
                color: '#e87c7c',
              }}
            >
              {error}
            </div>
          )}

          {/* SECTION 1: Selected Outfit (always visible when selected) */}
          {selectedOutfitId && queryOutfit && (
            <div
              className="p-4 rounded-xl border relative group"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              {/* Header */}
              <div className="mb-4">
                <div
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--accent)' }}
                >
                  Selected Outfit {selectedOutfitId}
                </div>
              </div>

              {/* Item grid (2 columns) */}
              <div className="grid grid-cols-2 gap-2">
                {queryOutfit.items.map((item) => {
                  const hasError = selectedImgErrors.has(item.item_id)
                  const color = getCategoryColor(item.category)

                  return (
                    <div
                      key={item.item_id}
                      className="rounded-lg overflow-hidden border flex flex-col group"
                      style={{
                        backgroundColor: 'var(--surface2)',
                        borderColor: 'var(--border)',
                      }}
                      title={item.title}
                    >
                      {/* Image or fallback */}
                      {item.image_url && !hasError ? (
                        <div
                          className="w-full overflow-hidden relative"
                          style={{ height: '110px', backgroundColor: 'var(--surface2)', padding: '4px' }}
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
                          className="w-full flex items-center justify-center text-3xl relative"
                          style={{ height: '110px', backgroundColor: 'var(--surface2)' }}
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
                            backgroundColor: `${color}22`,
                            color,
                          }}
                        >
                          Cat.{item.category}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* Delete button (single × at container level) */}
              <button
                onClick={reset}
                className="absolute opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full flex items-center justify-center text-sm"
                style={{
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: '#e87c7c',
                  border: 'none',
                  color: '#ffffff',
                }}
              >
                ×
              </button>            </div>
          )}

          {/* Find Similar button (below selected outfit) */}
          {selectedOutfitId && (
            <button
              onClick={handleFindSimilar}
              disabled={searching}
              className="w-full px-4 py-3 rounded-lg font-semibold uppercase tracking-wider text-sm transition-all"
              style={{
                backgroundColor: !searching ? 'var(--accent)' : 'var(--surface2)',
                color: !searching ? '#0a0a0a' : 'var(--muted)',
                cursor: !searching ? 'pointer' : 'not-allowed',
                opacity: !searching ? 1 : 0.6,
              }}
            >
              {searching ? '🔄 Searching...' : '🔍 Find Similar Outfits'}
            </button>
          )}

          {/* SECTION 2: Results or Idle Placeholder */}
          {/* Show idle placeholder when no outfit selected */}
          {!selectedOutfitId && !result && !searching && (
            <div
              className="p-16 rounded-xl text-center"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
            >
              <div className="text-5xl mb-4">🔍</div>
              <div className="text-sm">
                Select an outfit and click &ldquo;Find Similar Outfits&rdquo;
              </div>
            </div>
          )}

          {/* Show loading state */}
          {searching && (
            <div
              className="p-16 rounded-xl text-center"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
            >
              <div className="text-5xl mb-4 animate-pulse">🔄</div>
              <div className="text-sm">Finding similar outfits…</div>
            </div>
          )}

          {/* Show results */}
          {result && !searching && (
            <div className="space-y-4">
              <div
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--accent)' }}
              >
                Top {result.similar_outfits.length} Most Similar Outfits
              </div>
              <OutfitGrid outfits={similarOutfits} showScore={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
