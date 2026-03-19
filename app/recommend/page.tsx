'use client'

import { useState } from 'react'
import UserGrid from '@/components/UserGrid'
import UserDetailModal from '@/components/UserDetailModal'
import Pagination from '@/components/Pagination'
import { useUsers } from '@/hooks/useUsers'

export default function RecommendPage() {
  const { users, loading: usersLoading, error: usersError, page, totalPages, total, setPage } =
    useUsers()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const selectedUser = users.find((u) => u.user_id === selectedUserId)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 page-enter">
      <section>
        {/* Left-aligned header (DESIGN_VARIANCE 7: offset) */}
        <div className="mb-5">
          <h2
            className="text-3xl font-bold uppercase tracking-tight leading-none section-label"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}
          >
            Select User
          </h2>
          <p style={{ color: 'var(--muted)' }} className="text-sm mt-1.5">
            Choose a user to view their interaction history and personalized outfit recommendations
            {total > 0 && (
              <span className="tabular-nums"> — {total.toLocaleString()} users total</span>
            )}
          </p>
        </div>

        {usersError && (
          <div className="error-banner mb-4">{usersError}</div>
        )}

        <UserGrid
          users={users}
          selectedId={selectedUserId}
          onSelect={setSelectedUserId}
          loading={usersLoading}
        />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-5" />
      </section>

      {/* Modal */}
      {selectedUserId && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  )
}
