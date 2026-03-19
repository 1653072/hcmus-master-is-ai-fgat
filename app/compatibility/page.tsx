'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import ItemCard from '@/components/ItemCard'
import FitbResultItem from '@/components/FitbResultItem'
import SelectedItemsPreview from '@/components/SelectedItemsPreview'
import Pagination from '@/components/Pagination'
import { useItems } from '@/hooks/useItems'
import { useCompatibility } from '@/hooks/useCompatibility'
import { MAX_SELECTED_ITEMS } from '@/lib/constants'
import type { Item } from '@/lib/types'

export default function CompatibilityPage() {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [maxItemsWarning, setMaxItemsWarning] = useState(false)
  const [needsReanalysis, setNeedsReanalysis] = useState(false)
  const [scoreAnimated, setScoreAnimated] = useState(false)

  const { result, loading: analyzing, error, submit, reset } = useCompatibility()
  const { items, loading: itemsLoading, page, totalPages, total, setPage } = useItems({
    search: debouncedSearch || undefined,
    limit: 12,
  })

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Animate score bar from 0 on result arrival
  useEffect(() => {
    if (result && !analyzing) {
      setScoreAnimated(false)
      const raf = requestAnimationFrame(() => setScoreAnimated(true))
      return () => cancelAnimationFrame(raf)
    }
  }, [result, analyzing])

  const handleToggleItem = useCallback(
    (item: Item) => {
      setSelectedItems((prev) => {
        const exists = prev.some((i) => i.item_id === item.item_id)
        if (exists) {
          setMaxItemsWarning(false)
          return prev.filter((i) => i.item_id !== item.item_id)
        }
        if (prev.length >= MAX_SELECTED_ITEMS) {
          setMaxItemsWarning(true)
          return prev
        }
        setMaxItemsWarning(false)
        return [...prev, item]
      })
      // Mark stale instead of destroying results
      if (result) setNeedsReanalysis(true)
    },
    [result],
  )

  const handleAnalyze = () => {
    if (selectedItems.length >= 2) {
      submit(selectedItems.map((i) => i.item_id), 5)
      setNeedsReanalysis(false)
    }
  }

  const handleClear = useCallback(() => {
    setSelectedItems([])
    setMaxItemsWarning(false)
    setNeedsReanalysis(false)
    reset()
  }, [reset])

  const compatProb = result?.compatibility.compatibility_prob ?? 0
  const isCompatible = result?.compatibility.label === 'Compatible'
  const maxScore = useMemo(() => result
    ? Math.max(...result.suggested_items.map((i) => i.score ?? i.compatibility_prob ?? 0), 0.001)
    : 1, [result])

  const selectedIds = useMemo(() => new Set(selectedItems.map((i) => i.item_id)), [selectedItems])

  const canAnalyze = selectedItems.length >= 2 && !analyzing

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 page-enter">
      {/* Page header — left-aligned */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold uppercase tracking-tight leading-none section-label"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
        >
          Outfit Compatibility
        </h1>
        <p style={{ color: 'var(--muted)' }} className="text-sm mt-1.5">
          Select fashion items to score their compatibility and receive outfit completion suggestions
        </p>
      </div>

      {/* Sticky action bar */}
      <div
        className="sticky top-[69px] z-20 py-3 -mx-6 px-6 mb-6 flex items-center gap-4 border-b"
        style={{
          backgroundColor: 'var(--glass-bg-heavy)',
          borderColor: 'var(--border)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className="px-5 py-2.5 rounded-lg font-semibold uppercase tracking-wider text-sm tactile-press"
          style={{
            backgroundColor: canAnalyze ? 'var(--accent)' : 'var(--surface2)',
            color: canAnalyze ? '#fff' : 'var(--muted)',
            cursor: canAnalyze ? 'pointer' : 'not-allowed',
            opacity: canAnalyze ? 1 : 0.5,
            transition: 'all 0.3s var(--ease-out-expo)',
          }}
        >
          {analyzing ? 'Analyzing...' : 'Analyze Compatibility'}
        </button>

        <span className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
          {selectedItems.length}/{MAX_SELECTED_ITEMS} items selected
          {selectedItems.length < 2 && ' — select at least 2'}
        </span>

        {needsReanalysis && !analyzing && (
          <span
            className="text-xs px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: 'rgba(212,165,70,0.12)', color: 'var(--accent)' }}
          >
            Items changed — re-analyze to update
          </span>
        )}

        {selectedItems.length > 0 && (
          <button
            onClick={handleClear}
            className="ml-auto text-xs"
            style={{ color: 'var(--muted)', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--status-error)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)' }}
          >
            Clear all
          </button>
        )}
      </div>

      {error && (
        <div className="error-banner mb-5">{error}</div>
      )}

      {/* Max items warning */}
      {maxItemsWarning && (
        <div
          className="px-4 py-2.5 rounded-lg text-xs text-center mb-4"
          style={{
            backgroundColor: 'rgba(212,165,70,0.08)',
            borderLeft: '3px solid var(--accent)',
            color: 'var(--accent)',
          }}
        >
          Maximum {MAX_SELECTED_ITEMS} items reached. Remove an item to add another.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Item search & grid */}
        <div className="lg:col-span-2 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2 space-y-4 thin-scrollbar">
          {/* Search input */}
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wider mb-2 block"
              style={{ color: 'var(--accent)' }}
            >
              Search Items
              {total > 0 && (
                <span className="ml-2 font-normal normal-case tabular-nums" style={{ color: 'var(--muted)' }}>
                  ({total.toLocaleString()} total)
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by item title..."
                className="w-full px-3 py-2 pr-8 rounded-lg text-sm border outline-none"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  transition: 'border-color 0.2s var(--ease-out-expo)',
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
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{ color: 'var(--muted)', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)' }}
                  aria-label="Clear search"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                    <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Item grid */}
          {itemsLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg skeleton-shimmer"
                  style={{ minHeight: '140px' }}
                />
              ))}
            </div>
          ) : (
            <div className="stagger-in grid grid-cols-2 gap-3">
              {items.map((item, i) => (
                <div key={item.item_id} style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                  <ItemCard
                    item={item}
                    selected={selectedIds.has(item.item_id)}
                    onClick={() => handleToggleItem(item)}
                  />
                </div>
              ))}
              {items.length === 0 && (
                <div
                  className="col-span-2 py-8 text-center text-sm rounded-lg"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
                >
                  No items found
                </div>
              )}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

        {/* Right: Selected Items Preview + Analysis Results */}
        <div className="lg:col-span-3 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2 space-y-5 thin-scrollbar">
          {/* Selected Items Preview */}
          {selectedItems.length > 0 && (
            <SelectedItemsPreview items={selectedItems} onRemoveItem={handleToggleItem} />
          )}

          {/* Idle: no items, no result */}
          {selectedItems.length === 0 && !result && !analyzing && (
            <div
              className="py-14 rounded-lg text-center"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
            >
              <div className="text-sm">
                Select items from the left panel, then click &ldquo;Analyze Compatibility&rdquo;
              </div>
            </div>
          )}

          {/* Prompt: items selected but no analysis yet */}
          {selectedItems.length > 0 && !result && !analyzing && (
            <div
              className="py-8 rounded-lg text-center border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="text-sm" style={{ color: 'var(--muted)' }}>
                {selectedItems.length < 2
                  ? 'Select at least 2 items to analyze compatibility'
                  : 'Click "Analyze Compatibility" to score this outfit'}
              </div>
            </div>
          )}

          {/* Loading */}
          {analyzing && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg skeleton-shimmer"
                  style={{ minHeight: '80px' }}
                />
              ))}
            </div>
          )}

          {/* Analysis results */}
          {result && !analyzing && (
            <>
              {/* Compatibility score */}
              <div
                className="p-5 rounded-lg border"
                style={{
                  borderColor: isCompatible ? 'var(--status-success)' : 'var(--status-error)',
                  backgroundColor: 'var(--surface)',
                  opacity: needsReanalysis ? 0.5 : 1,
                  transition: 'opacity 0.3s var(--ease-out-expo)',
                }}
              >
                <div
                  className="text-[11px] font-semibold uppercase tracking-wider mb-3"
                  style={{ color: 'var(--muted)' }}
                >
                  Compatibility Analysis
                </div>

                <div className="flex items-center gap-5">
                  {/* Circular gauge */}
                  <div
                    className="w-20 h-20 rounded-full flex flex-col items-center justify-center border-[3px] shrink-0"
                    style={{
                      borderColor: isCompatible ? 'var(--status-success)' : 'var(--status-error)',
                      backgroundColor: isCompatible
                        ? 'rgba(90, 138, 110, 0.05)'
                        : 'rgba(232, 124, 124, 0.05)',
                    }}
                  >
                    <span
                      className="text-lg font-bold tabular-nums"
                      style={{ color: isCompatible ? 'var(--status-success)' : 'var(--status-error)' }}
                    >
                      {(compatProb * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* Label */}
                  <div className="flex-1">
                    <div
                      className="text-xl font-bold leading-none"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: isCompatible ? 'var(--status-success)' : 'var(--status-error)',
                      }}
                    >
                      {result.compatibility.label}
                    </div>
                    <div className="text-xs mt-1.5 tabular-nums" style={{ color: 'var(--muted)' }}>
                      {result.compatibility.valid_items.length} item
                      {result.compatibility.valid_items.length !== 1 ? 's' : ''} evaluated
                    </div>
                  </div>
                </div>

                {/* Animated progress bar */}
                <div
                  className="mt-4 w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--surface2)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: scoreAnimated ? `${compatProb * 100}%` : '0%',
                      backgroundColor: isCompatible ? 'var(--status-success)' : 'var(--status-error)',
                      transition: 'width 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
              </div>

              {/* Suggested items */}
              {result.suggested_items.length > 0 && (
                <div style={{ opacity: needsReanalysis ? 0.5 : 1, transition: 'opacity 0.3s var(--ease-out-expo)' }}>
                  <div
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: 'var(--accent)' }}
                  >
                    Suggested Items to Complete Outfit
                  </div>
                  <div className="stagger-in grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.suggested_items.map((item, idx) => (
                      <div key={item.item_id} style={{ animationDelay: `${idx * 60}ms` }}>
                        <FitbResultItem
                          item={item}
                          rank={idx + 1}
                          maxScore={maxScore}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
