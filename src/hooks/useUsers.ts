'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/types'
import { getUsers } from '@/lib/api'

interface UseUsersReturn {
  users: User[]
  loading: boolean
  error: string | null
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getUsers()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return { users, loading, error }
}
