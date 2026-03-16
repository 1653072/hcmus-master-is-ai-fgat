'use client'

import { useState, useRef } from 'react'
import UserGrid from '@/components/UserGrid'
import OutfitGrid from '@/components/OutfitGrid'
import Pagination from '@/components/Pagination'
import { useUsers } from '@/hooks/useUsers'
import { useHistory } from '@/hooks/useHistory'
import { useRecommend } from '@/hooks/useRecommend'
import type { Outfit } from '@/lib/types'

type SubTab = 'history' | 'recommend'

export default function RecommendPage() {
  const { users, loading: usersLoading, error: usersError, page, totalPages, total, setPage } =
    useUsers()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('history')
  const resultsRef = useRef<HTMLDivElement>(null)

  const { history, loading: historyLoading, error: historyError } = useHistory(selectedUserId)
  const { recommendations, loading: recommendLoading, error: recommendError } =
    useRecommend(selectedUserId)

  const selectedUser = users.find((u) => u.user_id === selectedUserId)

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId)
    setActiveSubTab('history')
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  // Map to Outfit shape for OutfitGrid
  const historyOutfits: Outfit[] = history.map((h) => ({
    outfit_id: h.outfit_id,
    items: h.items,
  }))

  const recommendOutfits: Outfit[] = recommendations.map((r) => ({
    outfit_id: r.outfit_id,
    rank: r.rank,
    score: r.score,
    items: r.items,
  }))

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* ── User selection ── */}
      <section>
        <div className="mb-6">
          <h2
            className="text-2xl font-bold uppercase tracking-wider mb-1"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
          >
            Select User
          </h2>
          <p style={{ color: 'var(--muted)' }} className="text-sm">
            Choose a user to view their interaction history and personalized outfit recommendations
            {total > 0 && (
              <span> — {total.toLocaleString()} users total</span>
            )}
          </p>
        </div>

        {usersError && (
          <div
            className="p-4 rounded-lg mb-4 text-sm"
            style={{
              backgroundColor: 'rgba(232, 124, 124, 0.1)',
              borderLeft: '3px solid #e87c7c',
              color: '#e87c7c',
            }}
          >
            {usersError}
          </div>
        )}

        <UserGrid
          users={users}
          selectedId={selectedUserId}
          onSelect={handleSelectUser}
          loading={usersLoading}
        />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-6" />
      </section>

      {/* ── Results panel ── */}
      {selectedUserId && (
        <section ref={resultsRef} className="pt-2">
          {/* User info banner */}
          <div
            className="mb-6 p-5 rounded-xl border"
            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{
                  backgroundColor: `hsl(${(parseInt(selectedUserId, 10) * 137.508) % 360}, 55%, 45%)`,
                }}
              >
                {selectedUserId.slice(0, 2)}
              </div>
              <div>
                <div
                  className="text-lg font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--accent)' }}
                >
                  User {selectedUserId}
                </div>
                <div className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                  {selectedUser?.outfit_count ?? '—'} outfit interactions
                </div>
              </div>
            </div>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
            {(
              [
                { tab: 'history', label: '📋 Interaction History' },
                { tab: 'recommend', label: '✨ Top-10 Recommendations' },
              ] as { tab: SubTab; label: string }[]
            ).map(({ tab, label }) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className="px-4 py-3 relative text-sm font-medium transition-colors"
                style={{ color: activeSubTab === tab ? 'var(--accent)' : 'var(--muted)' }}
              >
                {label}
                {activeSubTab === tab && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* History tab */}
          {activeSubTab === 'history' && (
            <div>
              {historyError && (
                <div
                  className="p-4 rounded-lg mb-4 text-sm"
                  style={{
                    backgroundColor: 'rgba(232, 124, 124, 0.1)',
                    borderLeft: '3px solid #e87c7c',
                    color: '#e87c7c',
                  }}
                >
                  {historyError}
                </div>
              )}
              <OutfitGrid outfits={historyOutfits} showScore={false} loading={historyLoading} />
            </div>
          )}

          {/* Recommendations tab */}
          {activeSubTab === 'recommend' && (
            <div>
              {recommendError && (
                <div
                  className="p-4 rounded-lg mb-4 text-sm"
                  style={{
                    backgroundColor: 'rgba(232, 124, 124, 0.1)',
                    borderLeft: '3px solid #e87c7c',
                    color: '#e87c7c',
                  }}
                >
                  {recommendError}
                </div>
              )}
              <OutfitGrid
                outfits={recommendOutfits}
                showScore={true}
                loading={recommendLoading}
              />
            </div>
          )}
        </section>
      )}
    </div>
  )
}
