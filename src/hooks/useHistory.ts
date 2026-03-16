'use client'

import { useState, useEffect } from 'react'
import type { UserHistoryEntry } from '@/lib/types'
import { getUserHistory } from '@/lib/api'

interface UseHistoryReturn {
  history: UserHistoryEntry[]
  loading: boolean
  error: string | null
}

export function useHistory(userId: string | null): UseHistoryReturn {
  const [history, setHistory] = useState<UserHistoryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setHistory([])
      return
    }

    const fetchHistory = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getUserHistory(userId)
        setHistory(data.histories)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [userId])

  return { history, loading, error }
}
