'use client'

import { useState, useEffect, useCallback } from 'react'
import type { UserHistoryEntry } from '@/lib/types'
import { getUserHistory } from '@/lib/api'

interface UseHistoryReturn {
  history: UserHistoryEntry[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
}

const PAGE_SIZE = 20

export function useHistory(userId: string | null): UseHistoryReturn {
  const [history, setHistory] = useState<UserHistoryEntry[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset when userId changes
  useEffect(() => {
    setHistory([])
    setPage(1)
    setTotalPages(1)
    setError(null)
  }, [userId])

  // Fetch current page
  useEffect(() => {
    if (!userId) return

    const fetchPage = async () => {
      try {
        if (page === 1) {
          setLoading(true)
        } else {
          setLoadingMore(true)
        }
        setError(null)
        const data = await getUserHistory(userId, page, PAGE_SIZE)
        setTotalPages(data.total_pages)
        setHistory((prev) => (page === 1 ? data.histories : [...prev, ...data.histories]))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    }

    fetchPage()
  }, [userId, page])

  const loadMore = useCallback(() => {
    setPage((p) => p + 1)
  }, [])

  return {
    history,
    loading,
    loadingMore,
    error,
    hasMore: page < totalPages,
    loadMore,
  }
}
