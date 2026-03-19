'use client'

import type { User } from '@/lib/types'

interface UserCardProps {
  user: User
  selected: boolean
  onClick: (userId: string) => void
}

export default function UserCard({ user, selected, onClick }: UserCardProps) {
  return (
    <button
      onClick={() => onClick(user.user_id)}
      className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl w-full text-left tactile-press"
      style={{
        backgroundColor: selected ? 'rgba(212,165,70,0.12)' : 'transparent',
        borderLeft: selected ? '2px solid var(--accent)' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.3s var(--ease-out-expo)',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--surface)'
          ;(e.currentTarget as HTMLButtonElement).style.borderLeftColor = 'var(--accent2)'
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateX(3px)'
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
          ;(e.currentTarget as HTMLButtonElement).style.borderLeftColor = 'transparent'
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'none'
        }
      }}
    >
      <img
        src={`https://api.dicebear.com/9.x/notionists/svg?seed=${user.user_id}`}
        alt={`Avatar of user ${user.user_id}`}
        className="w-12 h-12 rounded-full shrink-0"
        style={{
          backgroundColor: 'var(--surface2)',
          boxShadow: selected
            ? '0 0 0 2px var(--accent), 0 0 0 4px rgba(212,165,70,0.2)'
            : '0 0 0 1.5px var(--border)',
          transition: 'box-shadow 0.3s var(--ease-out-expo)',
        }}
      />

      <div className="min-w-0 flex-1">
        <div
          className="text-[11px] font-semibold uppercase tracking-widest truncate"
          style={{ color: selected ? 'var(--accent)' : 'var(--text)' }}
        >
          User {user.user_id}
        </div>
        <div className="text-[10px] mt-0.5 tabular-nums" style={{ color: 'var(--muted)' }}>
          {user.outfit_count} outfits
        </div>
      </div>
    </button>
  )
}
