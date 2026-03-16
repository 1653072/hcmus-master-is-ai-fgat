/**
 * All HTTP fetch functions for H-HFGAT Fashion Recommendation.
 * IMPORTANT: All API calls MUST go through this module — never call fetch() in components.
 *
 * Routing:
 *   FE calls /api/*  →  next.config.ts rewrites to  BE_URL/*
 *   e.g. /api/list-users  →  http://localhost:5000/list-users  (dev)
 *        /api/recommend   →  https://app.onrender.com/recommend (prod)
 */

import { API_BASE, API_TIMEOUT } from './constants'
import type {
  UsersResponse,
  UserHistoryResponse,
  ItemsResponse,
  OutfitsResponse,
  RecommendRequest,
  RecommendResponse,
  CompatibilityRequest,
  CompatibilityResponse,
  SimilarOutfitsRequest,
  SimilarOutfitsResponse,
  HealthResponse,
} from './types'

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(url, { ...options, signal: controller.signal })

    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as { error?: string }
      throw new Error(body.error ?? `API error: ${response.status} ${response.statusText}`)
    }

    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

// ---------------------------------------------------------------------------
// GET /health
// ---------------------------------------------------------------------------

export async function getHealth(): Promise<HealthResponse> {
  const r = await fetchWithTimeout(`${API_BASE}/health`)
  return r.json() as Promise<HealthResponse>
}

// ---------------------------------------------------------------------------
// GET /list-users?page=X&limit=Y
// ---------------------------------------------------------------------------

export async function getUsers(page = 1, limit = 50): Promise<UsersResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  const r = await fetchWithTimeout(`${API_BASE}/list-users?${params}`)
  return r.json() as Promise<UsersResponse>
}

// ---------------------------------------------------------------------------
// GET /list-user-histories?user_id=X&page=Y&limit=Z
// ---------------------------------------------------------------------------

export async function getUserHistory(
  userId: string,
  page = 1,
  limit = 20,
): Promise<UserHistoryResponse> {
  const params = new URLSearchParams({ user_id: userId, page: String(page), limit: String(limit) })
  const r = await fetchWithTimeout(`${API_BASE}/list-user-histories?${params}`)
  return r.json() as Promise<UserHistoryResponse>
}

// ---------------------------------------------------------------------------
// POST /recommend
// ---------------------------------------------------------------------------

export async function getRecommendations(req: RecommendRequest): Promise<RecommendResponse> {
  const r = await fetchWithTimeout(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  return r.json() as Promise<RecommendResponse>
}

// ---------------------------------------------------------------------------
// POST /suggest-outfit-compatibility
// ---------------------------------------------------------------------------

export async function suggestCompatibility(
  req: CompatibilityRequest,
): Promise<CompatibilityResponse> {
  const r = await fetchWithTimeout(`${API_BASE}/suggest-outfit-compatibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  return r.json() as Promise<CompatibilityResponse>
}

// ---------------------------------------------------------------------------
// POST /similar-outfits
// ---------------------------------------------------------------------------

export async function findSimilarOutfits(
  req: SimilarOutfitsRequest,
): Promise<SimilarOutfitsResponse> {
  const r = await fetchWithTimeout(`${API_BASE}/similar-outfits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  return r.json() as Promise<SimilarOutfitsResponse>
}

// ---------------------------------------------------------------------------
// GET /list-items?page=X&limit=Y&search=Z&category=N
// ---------------------------------------------------------------------------

export interface ListItemsParams {
  page?: number
  limit?: number
  search?: string
  category?: number
}

export async function listItems(params: ListItemsParams = {}): Promise<ItemsResponse> {
  const q = new URLSearchParams()
  if (params.page !== undefined) q.set('page', String(params.page))
  if (params.limit !== undefined) q.set('limit', String(params.limit))
  if (params.search) q.set('search', params.search)
  if (params.category !== undefined) q.set('category', String(params.category))
  const r = await fetchWithTimeout(`${API_BASE}/list-items?${q}`)
  return r.json() as Promise<ItemsResponse>
}

// ---------------------------------------------------------------------------
// GET /list-outfits?page=X&limit=Y
// ---------------------------------------------------------------------------

export async function listOutfits(page = 1, limit = 20): Promise<OutfitsResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  const r = await fetchWithTimeout(`${API_BASE}/list-outfits?${params}`)
  return r.json() as Promise<OutfitsResponse>
}
