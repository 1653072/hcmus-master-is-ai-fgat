'use client'

import { useState, useRef } from 'react'
import UserGrid from '@/components/UserGrid'
import OutfitGrid from '@/components/OutfitGrid'
import { useUsers } from '@/hooks/useUsers'
import { useHistory } from '@/hooks/useHistory'
import { useRecommend } from '@/hooks/useRecommend'

type SubTab = 'history' | 'recommend'

export default function RecommendPage() {
  const { users, loading: usersLoading, error: usersError } = useUsers()
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('history')

  const { history, loading: historyLoading } = useHistory(selectedUserId)
  const { recommendations, loading: recommendLoading } = useRecommend(selectedUserId)

  const resultsRef = useRef<HTMLDivElement>(null)

  // Find selected user info
  const selectedUser = users.find((u) => u.user_id === selectedUserId)

  // Handle user selection
  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId)
    setActiveSubTab('history')

    // Smooth scroll to results panel
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {/* Users Selection Section */}
        <section>
          <div className="mb-6">
            <h2
              className="text-2xl font-bold uppercase tracking-wider mb-1"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--accent)',
              }}
            >
              Select User
            </h2>
            <p style={{ color: 'var(--muted)' }} className="text-sm">
              Choose a user to view their outfit history and recommendations
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
          />
        </section>

        {/* Results Panel */}
        {selectedUserId && (
          <section ref={resultsRef} className="mt-16">
            {/* Panel Header */}
            <div className="mb-8 p-6 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-4">
                {/* User Avatar */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{
                    backgroundColor: `hsl(${(selectedUserId * 137.5) % 360}, 60%, 45%)`,
                  }}
                >
                  {String(selectedUserId).slice(0, 2)}
                </div>

                {/* User Info */}
                <div>
                  <div
                    className="text-lg font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--accent)' }}
                  >
                    User {selectedUserId}
                  </div>
                  <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                    {history.length} outfit{history.length !== 1 ? 's' : ''} in history
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Tab Navigation */}
            <div className="flex gap-1 mb-8 border-b" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setActiveSubTab('history')}
                className="px-4 py-3 relative text-sm font-medium transition-colors"
                style={{
                  color:
                    activeSubTab === 'history'
                      ? 'var(--accent)'
                      : 'var(--muted)',
                }}
              >
                📋 Interaction History
                {activeSubTab === 'history' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                )}
              </button>

              <button
                onClick={() => setActiveSubTab('recommend')}
                className="px-4 py-3 relative text-sm font-medium transition-colors"
                style={{
                  color:
                    activeSubTab === 'recommend'
                      ? 'var(--accent)'
                      : 'var(--muted)',
                }}
              >
                ✨ Top-10 Recommendations
                {activeSubTab === 'recommend' && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                )}
              </button>
            </div>

            {/* Sub-Tab Content */}
            {activeSubTab === 'history' && (
              <div>
                {history.length === 0 && !historyLoading && (
                  <div
                    className="text-center py-8 rounded-lg"
                    style={{
                      backgroundColor: 'var(--surface)',
                      color: 'var(--muted)',
                    }}
                  >
                    No history found for this user
                  </div>
                )}
                <OutfitGrid
                  outfits={history}
                  rank={false}
                  showScore={false}
                  loading={historyLoading}
                />
              </div>
            )}

            {activeSubTab === 'recommend' && (
              <div>
                {recommendations.length === 0 && !recommendLoading && (
                  <div
                    className="text-center py-8 rounded-lg"
                    style={{
                      backgroundColor: 'var(--surface)',
                      color: 'var(--muted)',
                    }}
                  >
                    No recommendations found for this user
                  </div>
                )}
                <OutfitGrid
                  outfits={recommendations}
                  rank={true}
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
