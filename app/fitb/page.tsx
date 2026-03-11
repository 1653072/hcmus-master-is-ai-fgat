'use client'

import { useState } from 'react'
import CategorySelect from '@/components/CategorySelect'
import ItemSelector from '@/components/ItemSelector'
import FitbResultItem from '@/components/FitbResultItem'
import { useFitb } from '@/hooks/useFitb'

interface SlotSelection {
  category: string
  itemId: number | null
}

export default function FitbPage() {
  const { results, loading, error, submit } = useFitb()
  const [slots, setSlots] = useState<SlotSelection[]>([
    { category: '', itemId: null },
    { category: '', itemId: null },
    { category: '', itemId: null },
  ])
  const [targetCategory, setTargetCategory] = useState('')

  // Check if form is complete
  const isFormComplete =
    slots.filter((s) => s.itemId !== null).length >= 2 && targetCategory !== ''

  // Get max score for result items
  const maxScore = Math.max(
    ...(results.map((r) => r.score || 0) || [1]),
    1
  )

  // Handle slot category change
  const handleSlotCategoryChange = (index: number, category: string) => {
    const newSlots = [...slots]
    newSlots[index] = { category, itemId: null }
    setSlots(newSlots)
  }

  // Handle slot item select
  const handleSlotItemSelect = (index: number, itemId: number) => {
    const newSlots = [...slots]
    newSlots[index] = { ...newSlots[index], itemId }
    setSlots(newSlots)
  }

  // Handle submit
  const handleSubmit = async () => {
    const selectedItemIds = slots
      .filter((s) => s.itemId !== null)
      .map((s) => s.itemId!)

    if (selectedItemIds.length >= 2 && targetCategory) {
      await submit(selectedItemIds, targetCategory)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold uppercase tracking-wider mb-1"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--accent)',
            }}
          >
            Fill-in-the-Blank
          </h1>
          <p style={{ color: 'var(--muted)' }} className="text-sm">
            Select items from different categories to complete an outfit
          </p>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Slot Selectors */}
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                  Select Items
                </div>

                {slots.map((slot, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      Item {index + 1}
                    </div>
                    <CategorySelect
                      value={slot.category}
                      onChange={(cat) => handleSlotCategoryChange(index, cat)}
                    />
                    <ItemSelector
                      category={slot.category}
                      selectedId={slot.itemId}
                      onSelect={(id) => handleSlotItemSelect(index, id)}
                    />
                  </div>
                ))}
              </div>

              {/* Target Category */}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>
                  Complete With
                </div>
                <CategorySelect
                  value={targetCategory}
                  onChange={setTargetCategory}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isFormComplete || loading}
                className="w-full px-4 py-3 rounded-lg font-semibold uppercase tracking-wider transition-all text-sm"
                style={{
                  backgroundColor: isFormComplete && !loading
                    ? 'var(--accent)'
                    : 'var(--muted)',
                  color: isFormComplete && !loading ? '#0a0a0a' : 'var(--text)',
                  cursor: isFormComplete && !loading ? 'pointer' : 'not-allowed',
                  opacity: isFormComplete && !loading ? 1 : 0.5,
                }}
              >
                {loading ? '🔄 Predicting...' : '✨ Predict Outfit'}
              </button>

              {/* Form Help Text */}
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                Select at least 2 items from different categories and choose a
                category to fill
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--accent)' }}>
              Recommended Items
            </div>

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

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-4 border animate-pulse"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      minHeight: '120px',
                    }}
                  />
                ))}
              </div>
            )}

            {!loading && results.length === 0 && !error && (
              <div
                className="p-8 rounded-lg text-center"
                style={{
                  backgroundColor: 'var(--surface)',
                  color: 'var(--muted)',
                }}
              >
                {targetCategory
                  ? 'Click "Predict Outfit" to see recommendations'
                  : 'Select items and a target category to get started'}
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((item, idx) => (
                  <FitbResultItem
                    key={item.item_id}
                    item={item}
                    rank={idx + 1}
                    maxScore={maxScore}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
    </div>
  )
}
