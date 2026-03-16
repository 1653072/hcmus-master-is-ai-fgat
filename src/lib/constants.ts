/**
 * Global constants for H-HFGAT Fashion Recommendation
 */

/**
 * Palette for category color coding.
 * Categories are integer IDs from the BE dataset.
 * Color is assigned by (categoryId % palette.length) for consistency.
 */
const CATEGORY_PALETTE = [
  '#e8a87c', // 0
  '#7ab3d4', // 1
  '#7ec8a0', // 2
  '#c98ddb', // 3
  '#e87c7c', // 4
  '#d4c87a', // 5
  '#8dd4c8', // 6
  '#d48da0', // 7
  '#a8d4a0', // 8
  '#d4a8a0', // 9
  '#a0b8d4', // 10
  '#d4cca0', // 11
  '#c4a0d4', // 12
  '#a0d4c4', // 13
  '#d4a0b8', // 14
  '#b8e0a0', // 15
  '#e0b8a0', // 16
  '#a0b0e0', // 17
  '#e0d8a0', // 18
  '#c0a8e0', // 19
]

export function getCategoryColor(categoryId: number): string {
  return CATEGORY_PALETTE[Math.abs(categoryId) % CATEGORY_PALETTE.length]
}

/**
 * Legacy string-key map kept for backward compat (unused in new code)
 */
export const CAT_COLORS: Record<string, string> = {}

/**
 * Backend API base URL prefix used in all fetch calls.
 * next.config.ts rewrites /api/* → BE_URL/*.
 */
export const API_BASE = '/api'

export const ITEMS_PER_PAGE = 20

/** Max items a user can select for compatibility analysis */
export const MAX_SELECTED_ITEMS = 8

/** Default timeout for API calls (ms). 30 s to handle Render cold-start */
export const API_TIMEOUT = 30_000
