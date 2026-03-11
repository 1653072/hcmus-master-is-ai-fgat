'use client'

import { useState, useEffect } from 'react'
import { Outfit } from '@/lib/types'
import { getRecommendations } from '@/lib/api'

interface UseRecommendReturn {
  recommendations: Outfit[]
  loading: boolean
  error: string | null
}

export function useRecommend(userId: number | null): UseRecommendReturn {
  const [recommendations, setRecommendations] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setRecommendations([])
      return
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getRecommendations(userId)
        setRecommendations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recommendations')
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [userId])

  return { recommendations, loading, error }
}
