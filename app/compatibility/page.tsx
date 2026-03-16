'use client'

import { useState, useEffect, useCallback } from 'react'
import ItemCard from '@/components/ItemCard'
import FitbResultItem from '@/components/FitbResultItem'
import Pagination from '@/components/Pagination'
import { useItems } from '@/hooks/useItems'
import { useCompatibility } from '@/hooks/useCompatibility'
import type { Item } from '@/lib/types'

export default function CompatibilityPage() {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedItems, setSelectedItems] = useState<Item[]>([])

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

  const handleToggleItem = useCallback(
    (item: Item) => {
      setSelectedItems((prev) => {
        const exists = prev.some((i) => i.item_id === item.item_id)
        if (exists) return prev.filter((i) => i.item_id !== item.item_id)
        if (prev.length >= 8) return prev
        return [...prev, item]
      })
      reset()
    },
    [reset],
  )

  const handleAnalyze = () => {
    if (selectedItems.length >= 1) {
      submit(selectedItems.map((i) => i.item_id), 5)
    }
  }

  const handleClear = useCallback(() => {
    setSelectedItems([])
    reset()
  }, [reset])

  const compatProb = result?.compatibility.compatibility_prob ?? 0
  const isCompatible = result?.compatibility.label === 'Compatible'
  const maxScore = result
    ? Math.max(...result.suggested_items.map((i) => i.score ?? i.compatibility_prob ?? 0), 0.001)
    : 1

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold uppercase tracking-wider mb-1"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
        >
          Outfit Compatibility
        </h1>
        <p style={{ color: 'var(--muted)' }} className="text-sm">
          Select fashion items to score their compatibility and receive outfit completion suggestions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Left: Item search & selection ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search input */}
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--accent)' }}
            >
              Search Items
              {total > 0 && (
                <span
                  className="ml-2 font-normal normal-case"
                  style={{ color: 'var(--muted)' }}
                >
                  ({total.toLocaleString()} total)
                </span>
              )}
            </div>
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
          </div>

          {/* Item grid */}
          {itemsLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg animate-pulse"
                  style={{ backgroundColor: 'var(--surface)', minHeight: '180px' }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {items.map((item) => (
                <ItemCard
                  key={item.item_id}
                  item={item}
                  selected={selectedItems.some((i) => i.item_id === item.item_id)}
                  onClick={() => handleToggleItem(item)}
                />
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

          {/* Selected items */}
          {selectedItems.length > 0 && (
            <div
              className="p-3 rounded-xl border"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--accent)' }}
                >
                  Selected ({selectedItems.length}/8)
                </div>
                <button
                  onClick={handleClear}
                  className="text-xs transition-colors"
                  style={{ color: 'var(--muted)' }}
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedItems.map((item) => (
                  <button
                    key={item.item_id}
                    onClick={() => handleToggleItem(item)}
                    className="px-2 py-0.5 rounded-full text-xs border transition-all"
                    style={{
                      backgroundColor: 'rgba(200, 169, 110, 0.1)',
                      borderColor: 'var(--accent)',
                      color: 'var(--accent)',
                    }}
                    title={`Remove: ${item.title}`}
                  >
                    #{item.item_id} ×
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={selectedItems.length < 1 || analyzing}
            className="w-full px-4 py-3 rounded-lg font-semibold uppercase tracking-wider text-sm transition-all"
            style={{
              backgroundColor:
                selectedItems.length >= 1 && !analyzing ? 'var(--accent)' : 'var(--surface2)',
              color:
                selectedItems.length >= 1 && !analyzing ? '#0a0a0a' : 'var(--muted)',
              cursor: selectedItems.length >= 1 && !analyzing ? 'pointer' : 'not-allowed',
              opacity: selectedItems.length >= 1 && !analyzing ? 1 : 0.6,
            }}
          >
            {analyzing ? '🔄 Analyzing...' : '✨ Analyze Compatibility'}
          </button>

          {selectedItems.length < 1 && (
            <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
              Select at least 1 item to begin analysis
            </p>
          )}
        </div>

        {/* ── Right: Results ── */}
        <div className="lg:col-span-3">
          {error && (
            <div
              className="p-4 rounded-lg mb-4 text-sm"
              style={{
                backgroundColor: 'rgba(232, 124, 124, 0.1)',
                borderLeft: '3px solid #e87c7c',
                color: '#e87c7c',
              }}
            >
              {error}
            </div>
          )}

          {!result && !analyzing && (
            <div
              className="p-16 rounded-xl text-center"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
            >
              <div className="text-5xl mb-4">👗</div>
              <div className="text-sm">
                Select items from the left panel, then click &ldquo;Analyze Compatibility&rdquo;
              </div>
            </div>
          )}

          {analyzing && (
            <div
              className="p-16 rounded-xl text-center"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
            >
              <div className="text-5xl mb-4 animate-pulse">🔄</div>
              <div className="text-sm">Analyzing outfit compatibility…</div>
            </div>
          )}

          {result && !analyzing && (
            <div className="space-y-6">
              {/* Compatibility score card */}
              <div
                className="p-6 rounded-xl border"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: isCompatible ? '#5a8a6e' : '#e87c7c',
                }}
              >
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: 'var(--muted)' }}
                >
                  Compatibility Analysis
                </div>

                <div className="flex items-center gap-6">
                  {/* Circular gauge */}
                  <div
                    className="w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 shrink-0"
                    style={{
                      borderColor: isCompatible ? '#5a8a6e' : '#e87c7c',
                      backgroundColor: isCompatible
                        ? 'rgba(90, 138, 110, 0.06)'
                        : 'rgba(232, 124, 124, 0.06)',
                    }}
                  >
                    <span
                      className="text-xl font-bold tabular-nums"
                      style={{ color: isCompatible ? '#5a8a6e' : '#e87c7c' }}
                    >
                      {(compatProb * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* Label & details */}
                  <div className="flex-1">
                    <div
                      className="text-2xl font-bold mb-1"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        color: isCompatible ? '#5a8a6e' : '#e87c7c',
                      }}
                    >
                      {result.compatibility.label}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--muted)' }}>
                      Raw logit:{' '}
                      <span style={{ color: 'var(--text)' }}>
                        {result.compatibility.raw_score.toFixed(4)}
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                      {result.compatibility.valid_items.length} item
                      {result.compatibility.valid_items.length !== 1 ? 's' : ''} evaluated
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  className="mt-5 w-full h-2.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--surface2)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${compatProb * 100}%`,
                      backgroundColor: isCompatible ? '#5a8a6e' : '#e87c7c',
                    }}
                  />
                </div>
              </div>

              {/* Suggested items */}
              {result.suggested_items.length > 0 && (
                <div>
                  <div
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: 'var(--accent)' }}
                  >
                    Suggested Items to Complete Outfit
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.suggested_items.map((item, idx) => (
                      <FitbResultItem
                        key={item.item_id}
                        item={item}
                        rank={idx + 1}
                        maxScore={maxScore}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
