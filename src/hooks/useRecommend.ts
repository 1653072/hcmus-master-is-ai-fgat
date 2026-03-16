'use client'

import { useState, useEffect } from 'react'
import type { RecommendedOutfit } from '@/lib/types'
import { getRecommendations } from '@/lib/api'

interface UseRecommendReturn {
  recommendations: RecommendedOutfit[]
  loading: boolean
  error: string | null
}

export function useRecommend(userId: string | null): UseRecommendReturn {
  const [recommendations, setRecommendations] = useState<RecommendedOutfit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setRecommendations([])
      return
    }

    const fetchRecs = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getRecommendations({ user_id: userId, top_k: 10 })
        setRecommendations(data.recommendations)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recommendations')
      } finally {
        setLoading(false)
      }
    }

    fetchRecs()
  }, [userId])

  return { recommendations, loading, error }
}
