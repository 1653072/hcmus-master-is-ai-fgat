'use client'

import { useState, useEffect } from 'react'
import { Item } from '@/lib/types'
import { getItemsByCategory } from '@/lib/api'

interface UseItemsReturn {
  items: Item[]
  loading: boolean
  error: string | null
}

export function useItems(category: string): UseItemsReturn {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!category) {
      setItems([])
      return
    }

    const fetchItems = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getItemsByCategory(category)
        setItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load items')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [category])

  return { items, loading, error }
}
