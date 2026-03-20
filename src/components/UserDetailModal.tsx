'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import OutfitGrid from './OutfitGrid'
import { useHistory } from '@/hooks/useHistory'
import { useRecommend } from '@/hooks/useRecommend'
import type { User, Outfit } from '@/lib/types'

type SubTab = 'history' | 'recommend'

interface UserDetailModalProps {
  user: User
  onClose: () => void
}

export default function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('history')

  const { history, loading: historyLoading, loadingMore, error: historyError, hasMore, loadMore } = useHistory(user.user_id)
  const { recommendations, loading: recommendLoading, error: recommendError } =
    useRecommend(user.user_id)

  const historyOutfits: Outfit[] = useMemo(() => history.map((h) => ({
    outfit_id: h.outfit_id,
    items: h.items,
  })), [history])

  const recommendOutfits: Outfit[] = useMemo(() => recommendations.map((r) => ({
    outfit_id: r.outfit_id,
    rank: r.rank,
    score: r.score,
    items: r.items,
  })), [recommendations])

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center backdrop-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      {/* Modal — glass panel */}
      <div
        className="relative w-full max-w-4xl mx-4 my-8 rounded-2xl overflow-hidden flex flex-col fade-scale-in"
        style={{
          backgroundColor: 'var(--glass-panel)',
          border: '1px solid var(--glass-panel-border)',
          maxHeight: 'calc(100vh - 64px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.04)',
          backdropFilter: 'blur(24px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-7 py-6 border-b shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-4">
            <img
              src={`https://api.dicebear.com/9.x/notionists/svg?seed=${user.user_id}`}
              alt={`Avatar of user ${user.user_id}`}
              className="w-16 h-16 rounded-full shrink-0"
              style={{ backgroundColor: 'var(--surface2)', boxShadow: '0 0 0 2px var(--accent), 0 0 0 4px rgba(212,165,70,0.2)' }}
            />
            <div className="flex-1 min-w-0">
              <div
                className="text-2xl font-bold uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
              >
                User {user.user_id}
              </div>
              <div className="text-sm mt-0.5 tabular-nums" style={{ color: 'var(--muted)' }}>
                {user.outfit_count} outfit interactions
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center tactile-press"
              style={{
                color: 'var(--muted)',
                backgroundColor: 'var(--surface)',
                transition: 'all 0.2s var(--ease-out-expo)',
              }}
              aria-label="Close modal"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex gap-1 mt-6">
            {(
              [
                {
                  tab: 'history' as SubTab,
                  label: 'Interaction History',
                  count: user.outfit_count,
                },
                {
                  tab: 'recommend' as SubTab,
                  label: 'Recommendations',
                  count: recommendLoading ? null : recommendOutfits.length,
                },
              ]
            ).map(({ tab, label, count }) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className="px-4 py-2 rounded-lg text-xs font-medium tactile-press"
                style={{
                  color: activeSubTab === tab ? 'var(--accent)' : 'var(--muted)',
                  backgroundColor: activeSubTab === tab ? 'rgba(212,165,70,0.12)' : 'transparent',
                  transition: 'color 0.2s var(--ease-out-expo)',
                }}
              >
                {label}
                {count !== null && (
                  <span
                    className="ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] tabular-nums"
                    style={{
                      backgroundColor: activeSubTab === tab ? 'rgba(212,165,70,0.15)' : 'var(--surface2)',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content (scrollable) */}
        <div className="flex-1 overflow-y-auto px-7 py-6 thin-scrollbar">
          {activeSubTab === 'history' && (
            <div>
              {historyError && (
                <div
                  className="px-4 py-3 rounded-xl mb-5 text-sm"
                  style={{
                    backgroundColor: 'rgba(232, 124, 124, 0.08)',
                    borderLeft: '3px solid var(--status-error)',
                    color: 'var(--status-error)',
                  }}
                >
                  {historyError}
                </div>
              )}
              <OutfitGrid
                outfits={historyOutfits}
                showScore={false}
                loading={historyLoading}
                emptyMessage="No interaction history for this user"
              />
              {hasMore && (
                <div className="mt-5 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-5 py-2 rounded-xl text-xs font-semibold tactile-press"
                    style={{
                      backgroundColor: 'var(--surface)',
                      color: loadingMore ? 'var(--muted)' : 'var(--accent)',
                      border: '1px solid var(--border)',
                      transition: 'all 0.2s var(--ease-out-expo)',
                    }}
                  >
                    {loadingMore ? 'Loading…' : `Load more (${historyOutfits.length} / ${user.outfit_count})`}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'recommend' && (
            <div>
              {recommendError && (
                <div
                  className="px-4 py-3 rounded-xl mb-5 text-sm"
                  style={{
                    backgroundColor: 'rgba(232, 124, 124, 0.08)',
                    borderLeft: '3px solid var(--status-error)',
                    color: 'var(--status-error)',
                  }}
                >
                  {recommendError}
                </div>
              )}
              <OutfitGrid
                outfits={recommendOutfits}
                showScore={true}
                loading={recommendLoading}
                emptyMessage="No recommendations available for this user"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
