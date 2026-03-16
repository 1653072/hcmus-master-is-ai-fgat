'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@/lib/types'
import { getUsers } from '@/lib/api'

interface UseUsersReturn {
  users: User[]
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  total: number
  setPage: (p: number) => void
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPage = useCallback(async (p: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getUsers(p, 50)
      setUsers(data.users)
      setTotalPages(data.total_pages)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPage(page)
  }, [fetchPage, page])

  return { users, loading, error, page, totalPages, total, setPage }
}
