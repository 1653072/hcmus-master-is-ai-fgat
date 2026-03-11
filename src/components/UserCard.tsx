'use client'

import { User } from '@/lib/types'

interface UserCardProps {
  user: User
  selected: boolean
  onClick: (userId: number) => void
}

export default function UserCard({ user, selected, onClick }: UserCardProps) {
  // Generate color from user_id using hue rotation
  const hue = (user.user_id * 137.5) % 360 // Golden angle for better distribution
  const baseColor = `hsl(${hue}, 60%, 45%)`

  return (
    <button
      onClick={() => onClick(user.user_id)}
      className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-200"
      style={{
        backgroundColor: selected ? 'var(--surface2)' : 'var(--surface)',
        border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent2)'
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
        }
      }}
    >
      {/* Avatar Circle */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{
          backgroundColor: baseColor,
        }}
      >
        {String(user.user_id).slice(0, 2)}
      </div>

      {/* User Info */}
      <div className="text-center">
        <div
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--accent)' }}
        >
          User {user.user_id}
        </div>
        <div
          className="text-xs mt-1"
          style={{ color: 'var(--muted)' }}
        >
          {user.n_outfits} outfit{user.n_outfits !== 1 ? 's' : ''}
        </div>
      </div>
    </button>
  )
}
