'use client'

import { useState, useEffect, useCallback } from 'react'
import type { OutfitEntry } from '@/lib/types'
import { listOutfits } from '@/lib/api'

interface UseOutfitsReturn {
  outfits: OutfitEntry[]
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  total: number
  setPage: (p: number) => void
}

export function useOutfits(limit = 12): UseOutfitsReturn {
  const [outfits, setOutfits] = useState<OutfitEntry[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPage = useCallback(
    async (p: number) => {
      try {
        setLoading(true)
        setError(null)
        const data = await listOutfits(p, limit)
        setOutfits(data.outfits)
        setTotalPages(data.total_pages)
        setTotal(data.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load outfits')
      } finally {
        setLoading(false)
      }
    },
    [limit],
  )

  useEffect(() => {
    fetchPage(page)
  }, [fetchPage, page])

  return { outfits, loading, error, page, totalPages, total, setPage }
}
