'use client'

import { useState } from 'react'
import { Item } from '@/lib/types'
import { fitb } from '@/lib/api'

interface UseFitbReturn {
  results: Item[]
  loading: boolean
  error: string | null
  submit: (itemIds: number[], targetCategory: string) => Promise<void>
}

export function useFitb(): UseFitbReturn {
  const [results, setResults] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (itemIds: number[], targetCategory: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await fitb(itemIds, targetCategory)
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return { results, loading, error, submit }
}
