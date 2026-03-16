'use client'

import type { User } from '@/lib/types'

interface UserCardProps {
  user: User
  selected: boolean
  onClick: (userId: string) => void
}

export default function UserCard({ user, selected, onClick }: UserCardProps) {
  const hue = (parseInt(user.user_id, 10) * 137.508) % 360

  return (
    <button
      onClick={() => onClick(user.user_id)}
      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 w-full"
      style={{
        backgroundColor: selected ? 'var(--surface2)' : 'var(--surface)',
        border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
        cursor: 'pointer',
        transform: selected ? 'translateY(-2px)' : 'none',
        boxShadow: selected ? '0 4px 16px rgba(200,169,110,0.2)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent2)'
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
        }
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{ backgroundColor: `hsl(${hue}, 55%, 45%)` }}
      >
        {user.user_id.slice(0, 2)}
      </div>

      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
          User {user.user_id}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
          {user.outfit_count} outfit{user.outfit_count !== 1 ? 's' : ''}
        </div>
      </div>
    </button>
  )
}
