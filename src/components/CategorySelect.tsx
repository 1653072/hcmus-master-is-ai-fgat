'use client'

import { CATEGORIES } from '@/lib/constants'

interface CategorySelectProps {
  value: string
  onChange: (category: string) => void
}

export default function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none"
      style={{
        // backgroundColor: 'var(--surface2)',
        // borderColor: 'var(--border)',
        // color: 'var(--text)',
        // border: '1px solid var(--border)',
        backgroundColor: '#ddd5c8',  /* ← hardcode, không dùng variable */
        color: '#1a1510',
        border: '1px solid #c9bfb0',
      }}
    >
      <option value="">Select a category...</option>
      {CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </option>
      ))}
    </select>
  )
}
