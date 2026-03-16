'use client'

import { useState } from 'react'
import type { CompatibilityResponse } from '@/lib/types'
import { suggestCompatibility } from '@/lib/api'

interface UseCompatibilityReturn {
  result: CompatibilityResponse | null
  loading: boolean
  error: string | null
  submit: (itemIds: string[], suggestTopK?: number) => Promise<void>
  reset: () => void
}

export function useCompatibility(): UseCompatibilityReturn {
  const [result, setResult] = useState<CompatibilityResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (itemIds: string[], suggestTopK = 5) => {
    try {
      setLoading(true)
      setError(null)
      setResult(null)
      const data = await suggestCompatibility({ item_ids: itemIds, suggest_top_k: suggestTopK })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze compatibility')
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
