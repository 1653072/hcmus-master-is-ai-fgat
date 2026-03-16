'use client'

import { useState } from 'react'
import type { SimilarOutfitsResponse } from '@/lib/types'
import { findSimilarOutfits } from '@/lib/api'

interface UseSimilarOutfitsReturn {
  result: SimilarOutfitsResponse | null
  loading: boolean
  error: string | null
  submit: (outfitId: string, topK?: number) => Promise<void>
  reset: () => void
}

export function useSimilarOutfits(): UseSimilarOutfitsReturn {
  const [result, setResult] = useState<SimilarOutfitsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (outfitId: string, topK = 10) => {
    try {
      setLoading(true)
      setError(null)
      setResult(null)
      const data = await findSimilarOutfits({ outfit_id: outfitId, top_k: topK })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find similar outfits')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
  }

  return { result, loading, error, submit, reset }
}
