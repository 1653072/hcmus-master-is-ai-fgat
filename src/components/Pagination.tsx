'use client'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
  className?: string
}

export default function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center gap-2 justify-center ${className ?? ''}`}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg text-sm transition-all border"
        style={{
          backgroundColor: page <= 1 ? 'var(--surface)' : 'var(--surface2)',
          color: page <= 1 ? 'var(--muted)' : 'var(--text)',
          cursor: page <= 1 ? 'not-allowed' : 'pointer',
          borderColor: 'var(--border)',
          opacity: page <= 1 ? 0.5 : 1,
        }}
      >
        ← Prev
      </button>

      <span className="text-sm tabular-nums" style={{ color: 'var(--muted)' }}>
        {page} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 rounded-lg text-sm transition-all border"
        style={{
          backgroundColor: page >= totalPages ? 'var(--surface)' : 'var(--surface2)',
          color: page >= totalPages ? 'var(--muted)' : 'var(--text)',
          cursor: page >= totalPages ? 'not-allowed' : 'pointer',
          borderColor: 'var(--border)',
          opacity: page >= totalPages ? 0.5 : 1,
        }}
      >
        Next →
      </button>
    </div>
  )
}
