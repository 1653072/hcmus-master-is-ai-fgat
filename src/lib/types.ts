/**
 * Global TypeScript interfaces for H-HFGAT Fashion Recommendation
 * IMPORTANT: All types exported here, no 'any' allowed
 */

/**
 * Individual fashion item
 */
export interface Item {
  item_id: number
  category: string
  title: string
  image_url?: string
  score?: number
}

/**
 * Complete outfit containing multiple items
 */
export interface Outfit {
  outfit_id: number
  score?: number
  items: Item[]
}

/**
 * User profile with outfit count
 */
export interface User {
  user_id: number
  n_outfits: number
}

/**
 * Recommend API response
 */
export interface RecommendResponse {
  user_id: number
  recommendations: Outfit[]
}

/**
 * History API response
 */
export interface HistoryResponse {
  user_id: number
  history: Outfit[]
}

/**
 * Items by category API response
 */
export interface ItemsByCategoryResponse {
  items: Item[]
}

/**
 * Fill-in-the-Blank API request body
 */
export interface FitbRequest {
  item_ids: number[]
  target_category: string
}

/**
 * Fill-in-the-Blank API response
 */
export interface FitbResponse {
  results: Item[]
}
