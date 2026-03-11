'use client'

import { User } from '@/lib/types'
import UserCard from './UserCard'

interface UserGridProps {
  users: User[]
  selectedId: number | null
  onSelect: (userId: number) => void
}

export default function UserGrid({ users, selectedId, onSelect }: UserGridProps) {
  const isLoading = users.length === 0

  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      }}
    >
      {isLoading ? (
        // Skeleton loading: 20 placeholder cards
        Array.from({ length: 20 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="flex flex-col items-center gap-3 p-4 rounded-xl animate-pulse"
            style={{
              backgroundColor: 'var(--surface2)',
              border: '2px solid var(--border)',
              height: '140px',
            }}
          >
            <div
              className="w-12 h-12 rounded-full"
              style={{ backgroundColor: 'var(--border)' }}
            />
            <div className="w-full space-y-2">
              <div
                className="h-2 rounded"
                style={{ backgroundColor: 'var(--border)' }}
              />
              <div
                className="h-2 rounded w-3/4 mx-auto"
                style={{ backgroundColor: 'var(--border)' }}
              />
            </div>
          </div>
        ))
      ) : (
        // Actual user cards
        users.map((user) => (
          <UserCard
            key={user.user_id}
            user={user}
            selected={selectedId === user.user_id}
            onClick={onSelect}
          />
        ))
      )}
    </div>
  )
}
