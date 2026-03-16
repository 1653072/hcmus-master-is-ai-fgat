/**
 * TypeScript interfaces for H-HFGAT Fashion Recommendation.
 * All types mirror the actual BE (Python/Flask) response shapes exactly.
 * IMPORTANT: All IDs are strings. Categories are integers.
 */

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface Item {
  item_id: string
  category: number
  title: string
  image_url?: string
  score?: number
  compatibility_prob?: number
}

export interface Outfit {
  outfit_id: string
  rank?: number
  score?: number
  similarity?: number
  items: Item[]
}

export interface User {
  user_id: string
  outfit_count: number
}

// ---------------------------------------------------------------------------
// Pagination meta (shared by all list endpoints)
// ---------------------------------------------------------------------------

export interface PaginatedMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

// ---------------------------------------------------------------------------
// GET /list-users
// ---------------------------------------------------------------------------

export interface UsersResponse extends PaginatedMeta {
  users: User[]
}

// ---------------------------------------------------------------------------
// GET /list-user-histories
// ---------------------------------------------------------------------------

export interface UserHistoryEntry {
  outfit_id: string
  items: Item[]
}

export interface UserHistoryResponse extends PaginatedMeta {
  user_id: string
  histories: UserHistoryEntry[]
}

// ---------------------------------------------------------------------------
// GET /list-items
// ---------------------------------------------------------------------------

export interface ItemsResponse extends PaginatedMeta {
  items: Item[]
}

// ---------------------------------------------------------------------------
// GET /list-outfits
// ---------------------------------------------------------------------------

export interface OutfitEntry {
  outfit_id: string
  items: Item[]
}

export interface OutfitsResponse extends PaginatedMeta {
  outfits: OutfitEntry[]
}

// ---------------------------------------------------------------------------
// POST /recommend
// ---------------------------------------------------------------------------

export interface RecommendRequest {
  user_id: string
  top_k?: number
  exclude_seen?: boolean
}

export interface RecommendedOutfit {
  rank: number
  outfit_id: string
  score: number
  items: Item[]
}

export interface RecommendResponse {
  user_id: string
  total: number
  recommendations: RecommendedOutfit[]
}

// ---------------------------------------------------------------------------
// POST /suggest-outfit-compatibility
// ---------------------------------------------------------------------------

export interface CompatibilityRequest {
  item_ids: string[]
  suggest_top_k?: number
}

export interface CompatibilityResult {
  raw_score: number
  compatibility_prob: number
  label: string
  valid_items: Item[]
}

export interface CompatibilityResponse {
  compatibility: CompatibilityResult
  suggested_items: Item[]
}

// ---------------------------------------------------------------------------
// POST /similar-outfits
// ---------------------------------------------------------------------------

export interface SimilarOutfitsRequest {
  outfit_id: string
  top_k?: number
}

export interface SimilarOutfitEntry {
  rank: number
  outfit_id: string
  similarity: number
  items: Item[]
}

export interface SimilarOutfitsResponse {
  outfit_id: string
  outfit_items: Item[]
  similar_outfits: SimilarOutfitEntry[]
}

// ---------------------------------------------------------------------------
// GET /health
// ---------------------------------------------------------------------------

export interface HealthResponse {
  status: string
  model: string
  artifacts_loaded: boolean
}
