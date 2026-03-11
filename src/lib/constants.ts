/**
 * Global constants for H-HFGAT Fashion Recommendation
 */

/**
 * Category color mapping - maintain consistency across UI
 * Used in OutfitCard, CategorySelect, FitbResultItem components
 */
export const CAT_COLORS: Record<string, string> = {
  tops: '#e8a87c',
  bottoms: '#7ab3d4',
  shoes: '#7ec8a0',
  bags: '#c98ddb',
  accessories: '#e87c7c',
  outerwear: '#d4c87a',
  dresses: '#8dd4c8',
  knitwear: '#d48da0',
}

/**
 * List of all clothing categories - order matters for UI consistency
 */
export const CATEGORIES = [
  'tops',
  'bottoms',
  'shoes',
  'bags',
  'accessories',
  'outerwear',
  'dresses',
  'knitwear',
] as const

/**
 * Backend API base URL
 * Proxied through next.config.ts rewrites to http://localhost:5000
 */
export const API_BASE = '/api'

/**
 * Pagination and UI constants
 */
export const ITEMS_PER_PAGE = 20
export const MAX_OUTFIT_ITEMS = 6

/**
 * Default timeout for API calls (ms)
 */
export const API_TIMEOUT = 10000
