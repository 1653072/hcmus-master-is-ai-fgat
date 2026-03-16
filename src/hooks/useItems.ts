'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Item } from '@/lib/types'
import { listItems, type ListItemsParams } from '@/lib/api'

interface UseItemsParams extends Omit<ListItemsParams, 'page'> {
  limit?: number
}

interface UseItemsReturn {
  items: Item[]
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  total: number
  setPage: (p: number) => void
}

export function useItems(params: UseItemsParams = {}): UseItemsReturn {
  const [items, setItems] = useState<Item[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { search, category, limit = 12 } = params

  // Reset to page 1 when search / category filter changes
  useEffect(() => {
    setPage(1)
  }, [search, category])

  const fetchPage = useCallback(
    async (p: number) => {
      try {
        setLoading(true)
        setError(null)
        const data = await listItems({ page: p, limit, search, category })
        setItems(data.items)
        setTotalPages(data.total_pages)
        setTotal(data.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load items')
      } finally {
        setLoading(false)
      }
    },
    [search, category, limit],
  )

  useEffect(() => {
    fetchPage(page)
  }, [fetchPage, page])

  return { items, loading, error, page, totalPages, total, setPage }
}
