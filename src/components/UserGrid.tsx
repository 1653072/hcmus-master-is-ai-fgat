'use client'

import type { User } from '@/lib/types'
import UserCard from './UserCard'

interface UserGridProps {
  users: User[]
  selectedId: string | null
  onSelect: (userId: string) => void
  loading?: boolean
}

export default function UserGrid({ users, selectedId, onSelect, loading }: UserGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 border animate-pulse"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              minHeight: '100px',
            }}
          />
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div
        className="py-12 text-center rounded-xl"
        style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }}
      >
        No users found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {users.map((user) => (
        <UserCard
          key={user.user_id}
          user={user}
          selected={selectedId === user.user_id}
          onClick={onSelect}
        />
      ))}
    </div>
  )
}
