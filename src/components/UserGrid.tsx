'use client'

import type { User } from '@/lib/types'
import UserCard from './UserCard'

interface UserGridProps {
  users: User[]
  selectedId: string | null
  onSelect: (userId: string) => void
  loading?: boolean
  emptyMessage?: string
}

export default function UserGrid({ users, selectedId, onSelect, loading, emptyMessage = 'No users found' }: UserGridProps) {
  // Initial load: shimmer skeletons
  if (loading && users.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg skeleton-shimmer"
            style={{ minHeight: '80px' }}
          />
        ))}
      </div>
    )
  }

  if (!loading && users.length === 0) {
    return (
      <div
        className="py-16 text-center text-xs rounded-lg"
        style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
      >
        {emptyMessage}
      </div>
    )
  }

  // Page transition: show existing users with loading overlay
  return (
    <div className="relative">
      {loading && (
        <div
          className="absolute inset-0 z-10 rounded-lg"
          style={{ backgroundColor: 'var(--glass-overlay)', backdropFilter: 'blur(1px)' }}
        />
      )}
      <div
        className="stagger-in grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3"
        style={{
          opacity: loading ? 0.4 : 1,
          transition: 'opacity 0.3s var(--ease-out-expo)',
        }}
      >
        {users.map((user, i) => (
          <div key={user.user_id} style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
            <UserCard
              user={user}
              selected={selectedId === user.user_id}
              onClick={onSelect}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
