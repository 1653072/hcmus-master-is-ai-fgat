'use client'

import { useState, useEffect, useCallback } from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
  // Always start with 'dark' to match SSR — sync with actual DOM theme after mount
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    setThemeState((document.documentElement.dataset.theme as Theme) || 'dark')
  }, [])

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.dataset.theme = t
    localStorage.setItem('theme', t)
    setThemeState(t)
  }, [])

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }, [theme, setTheme])

  return { theme, setTheme, toggleTheme }
}
