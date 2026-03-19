'use client'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
  className?: string
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = [1]

  if (current > 3) pages.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) pages.push('ellipsis')

  pages.push(total)
  return pages
}

export default function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(page, totalPages)

  return (
    <div className={`flex items-center gap-2 justify-center ${className ?? ''}`}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-2.5 py-2 rounded-xl text-sm border tactile-press"
        style={{
          backgroundColor: page <= 1 ? 'transparent' : 'var(--surface)',
          color: page <= 1 ? 'var(--muted)' : 'var(--text)',
          cursor: page <= 1 ? 'not-allowed' : 'pointer',
          borderColor: 'var(--border)',
          opacity: page <= 1 ? 0.4 : 1,
          transition: 'all 0.3s var(--ease-out-expo)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {pages.map((p, idx) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-1 text-sm"
            style={{ color: 'var(--muted)' }}
          >
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="w-9 h-9 rounded-xl text-sm border tactile-press tabular-nums"
            style={{
              backgroundColor: p === page ? 'var(--accent)' : 'transparent',
              color: p === page ? '#fff' : 'var(--muted)',
              borderColor: p === page ? 'var(--accent)' : 'var(--border)',
              cursor: p === page ? 'default' : 'pointer',
              fontWeight: p === page ? 600 : 400,
              transition: 'all 0.3s var(--ease-out-expo)',
            }}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-2.5 py-2 rounded-xl text-sm border tactile-press"
        style={{
          backgroundColor: page >= totalPages ? 'transparent' : 'var(--surface)',
          color: page >= totalPages ? 'var(--muted)' : 'var(--text)',
          cursor: page >= totalPages ? 'not-allowed' : 'pointer',
          borderColor: 'var(--border)',
          opacity: page >= totalPages ? 0.4 : 1,
          transition: 'all 0.3s var(--ease-out-expo)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
