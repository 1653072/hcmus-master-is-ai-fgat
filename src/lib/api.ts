/**
 * All API fetch functions for H-HFGAT Fashion Recommendation
 * IMPORTANT: All HTTP calls ONLY here, never in components
 * Uses native fetch(), no axios
 */

import { API_BASE, API_TIMEOUT } from './constants'
import {
  User,
  Outfit,
  Item,
  RecommendResponse,
  HistoryResponse,
  ItemsByCategoryResponse,
  FitbRequest,
  FitbResponse,
} from './types'

/**
 * Wrapper for fetch with timeout
 */
async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * GET /api/users
 * Fetch list of all users with outfit count
 */
export async function getUsers(): Promise<User[]> {
  const response = await fetchWithTimeout(`${API_BASE}/users`)
  const data = (await response.json()) as User[]
  return data
}

/**
 * GET /api/user/:uid/history
 * Fetch user's outfit history
 */
export async function getUserHistory(userId: number): Promise<Outfit[]> {
  const response = await fetchWithTimeout(`${API_BASE}/user/${userId}/history`)
  const data = (await response.json()) as HistoryResponse
  return data.history
}

/**
 * GET /api/recommend/:uid
 * Fetch recommendation for specific user
 */
export async function getRecommendations(userId: number): Promise<Outfit[]> {
  const response = await fetchWithTimeout(`${API_BASE}/recommend/${userId}`)
  const data = (await response.json()) as RecommendResponse
  return data.recommendations
}

/**
 * GET /api/categories
 * Fetch all available clothing categories
 */
export async function getCategories(): Promise<string[]> {
  const response = await fetchWithTimeout(`${API_BASE}/categories`)
  const data = (await response.json()) as string[]
  return data
}

/**
 * GET /api/items/:category
 * Fetch all items in a specific category
 */
export async function getItemsByCategory(category: string): Promise<Item[]> {
  const response = await fetchWithTimeout(`${API_BASE}/items/${category}`)
  const data = (await response.json()) as ItemsByCategoryResponse
  return data.items
}

/**
 * POST /api/fitb
 * Fill-in-the-Blank: recommend items to complete an outfit
 *
 * @param itemIds - IDs of items already in outfit
 * @param targetCategory - category to fill (e.g., 'shoes')
 * @returns Recommended items in target category
 */
export async function fitb(itemIds: number[], targetCategory: string): Promise<Item[]> {
  const payload: FitbRequest = {
    item_ids: itemIds,
    target_category: targetCategory,
  }

  const response = await fetchWithTimeout(`${API_BASE}/fitb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = (await response.json()) as FitbResponse
  return data.results
}
