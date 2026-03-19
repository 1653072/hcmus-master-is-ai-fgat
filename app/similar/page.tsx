'use client'

import { useState, useEffect, useMemo } from 'react'
import OutfitGrid from '@/components/OutfitGrid'
import OutfitCard from '@/components/OutfitCard'
import Pagination from '@/components/Pagination'
import { useOutfits } from '@/hooks/useOutfits'
import { useSimilarOutfits } from '@/hooks/useSimilarOutfits'
import type { Outfit } from '@/lib/types'

export default function SimilarPage() {
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const { outfits, loading: outfitsLoading, error: outfitsError, page, totalPages, total, setPage } = useOutfits(
    12,
    debouncedSearch || undefined,
  )
  const { result, loading: searching, error, submit, reset } = useSimilarOutfits()

  const handleSelectOutfit = (outfit: Outfit) => {
    setSelectedOutfit(outfit)
    reset()
  }

  const handleClearSelection = () => {
    setSelectedOutfit(null)
    reset()
  }

  const handleFindSimilar = () => {
    if (selectedOutfit) submit(selectedOutfit.outfit_id, 10)
  }

  const isSelectedOnCurrentPage = selectedOutfit
    ? outfits.some((o) => o.outfit_id === selectedOutfit.outfit_id)
    : false

  const similarOutfits: Outfit[] = result?.similar_outfits ?? []

  // Show the queried outfit from result (enriched by BE) or from stored selection
  const queryOutfit: Outfit | null = useMemo(() => result
    ? { outfit_id: result.outfit_id, items: result.outfit_items }
    : selectedOutfit, [result, selectedOutfit])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 page-enter">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold uppercase tracking-tight leading-none section-label"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
        >
          Similar Outfits
        </h1>
        <p style={{ color: 'var(--muted)' }} className="text-sm mt-1.5">
          Browse outfits in the dataset, select one, and discover the most visually similar outfits
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Outfit browser */}
        <div className="lg:col-span-2 lg:sticky lg:top-[69px] lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2 space-y-4 thin-scrollbar">
          {/* Search input */}
          <div>
            <div
              className="section-label text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--accent)' }}
            >
              Search Outfits
              {total > 0 && (
                <span className="ml-2 font-normal normal-case tabular-nums" style={{ color: 'var(--muted)' }}>
                  ({total.toLocaleString()} total)
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by item title..."
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
                onFocus={(e) => {
                  ;(e.currentTarget as HTMLInputElement).style.borderColor = 'var(--accent)'
                }}
                onBlur={(e) => {
                  ;(e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border)'
                }}
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ color: 'var(--muted)' }}
                  aria-label="Clear search"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                    <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {selectedOutfit && !isSelectedOnCurrentPage && (
            <div
              className="px-3 py-2 rounded-lg text-xs flex items-center justify-between"
              style={{
                backgroundColor: 'rgba(212,165,70,0.08)',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
              }}
            >
              <span>Outfit {selectedOutfit.outfit_id} selected (on another page)</span>
              <button
                onClick={handleClearSelection}
                className="ml-2 w-5 h-5 flex items-center justify-center rounded-full shrink-0"
                style={{ color: 'var(--muted)' }}
                aria-label="Clear selection"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                  <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}

          {outfitsError && (
            <div className="error-banner">{outfitsError}</div>
          )}

          {outfitsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg skeleton-shimmer" style={{ minHeight: '120px' }} />
              ))}
            </div>
          ) : (
            <div className="stagger-in grid grid-cols-1 sm:grid-cols-2 gap-3">
              {outfits.map((outfit, i) => (
                <div key={outfit.outfit_id} style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}>
                  <OutfitCard
                    outfit={outfit}
                    selected={selectedOutfit?.outfit_id === outfit.outfit_id}
                    onClick={() => handleSelectOutfit(outfit)}
                  />
                </div>
              ))}
              {outfits.length === 0 && (
                <div
                  className="col-span-2 py-8 text-center text-sm rounded-lg"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
                >
                  No outfits found
                </div>
              )}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

        {/* Right: Selected outfit + Results */}
        <div
          className="lg:col-span-3 lg:sticky lg:top-[69px] lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pl-2 space-y-5 thin-scrollbar lg:border-l"
          style={{ borderColor: 'var(--border)' }}
        >
          {error && <div className="error-banner">{error}</div>}

          {selectedOutfit && queryOutfit && (
            <OutfitCard outfit={queryOutfit} onClear={handleClearSelection} />
          )}

          {selectedOutfit && (
            <button
              onClick={handleFindSimilar}
              disabled={searching}
              className="w-full px-4 py-3 rounded-lg font-semibold uppercase tracking-wider text-sm tactile-press"
              style={{
                backgroundColor: !searching ? 'var(--accent)' : 'var(--surface2)',
                color: !searching ? '#fff' : 'var(--muted)',
                cursor: !searching ? 'pointer' : 'not-allowed',
                opacity: !searching ? 1 : 0.5,
                transition: 'all 0.3s var(--ease-out-expo)',
              }}
              onMouseEnter={(e) => {
                if (!searching) {
                  ;(e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)'
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(212,165,70,0.4)'
                }
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.filter = 'none'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'none'
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
              }}
            >
              {searching ? 'Searching...' : 'Find Similar Outfits'}
            </button>
          )}

          {!selectedOutfit && !result && !searching && (
            <div
              className="py-14 rounded-lg text-center"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
            >
              <div className="text-sm">
                Select an outfit and click &ldquo;Find Similar Outfits&rdquo;
              </div>
            </div>
          )}

          {searching && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg skeleton-shimmer" style={{ minHeight: '130px' }} />
              ))}
            </div>
          )}

          {result && !searching && (
            <div className="space-y-4">
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <h3
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--green)' }}
                >
                  Top {result.similar_outfits.length} Most Similar
                </h3>
              </div>
              <div className="mt-3">
                <OutfitGrid outfits={similarOutfits} showScore={true} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
