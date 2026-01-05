/**
 * API Client for Bubbles backend
 *
 * Uses openapi-fetch with auto-generated types from the backend OpenAPI spec.
 * All API functions require authentication via Supabase session.
 */

import createClient from 'openapi-fetch'
import type { paths, components } from '../types/api'
import { supabase } from './supabase'

// Re-export types for convenience
export type Bubble = components['schemas']['Bubble']
export type BubbleWithMembers = components['schemas']['BubbleWithMembers']
export type BubbleList = components['schemas']['BubbleList']
export type BubbleCreate = components['schemas']['BubbleCreate']
export type BubbleUpdate = components['schemas']['BubbleUpdate']
export type BubbleInvite = components['schemas']['BubbleInvite']
export type MemberRef = components['schemas']['MemberRef']
export type UpdateMemberRole = components['schemas']['UpdateMemberRole']

export type ItemWithShares = components['schemas']['ItemWithShares']
export type ItemList = components['schemas']['ItemList']
export type ItemCreate = components['schemas']['ItemCreate']
export type ItemUpdate = components['schemas']['ItemUpdate']
export type ItemShare = components['schemas']['ItemShare']
export type BubbleRef = components['schemas']['BubbleRef']
export type ItemRef = components['schemas']['ItemRef']

export type LoanWithDetails = components['schemas']['LoanWithDetails']
export type LoanList = components['schemas']['LoanList']
export type LoanRequest = components['schemas']['LoanRequest']
export type LoanUpdate = components['schemas']['LoanUpdate']
export type UserRef = components['schemas']['UserRef']

export type UserProfile = components['schemas']['UserProfile']
export type UserProfileUpdate = components['schemas']['UserProfileUpdate']
export type UsernameCheck = components['schemas']['UsernameCheck']

// API base URL - uses service binding in production
const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:9990'
  : '' // Empty for service binding

// Create the API client
const client = createClient<paths>({ baseUrl: API_BASE_URL })

/**
 * Get auth headers for API requests
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error('Not authenticated')
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  }
}

/**
 * Helper to handle API errors
 */
function handleError(error: unknown, response?: { status: number }): never {
  if (response?.status === 401) {
    throw new Error('Not authenticated')
  }
  if (response?.status === 403) {
    throw new Error('Not authorized')
  }
  if (response?.status === 404) {
    throw new Error('Not found')
  }
  throw error instanceof Error ? error : new Error('API request failed')
}

// ============================================================================
// User API
// ============================================================================

export const userApi = {
  async getMe(): Promise<UserProfile> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.GET('/api/v1/user/me', { headers })
    if (error) handleError(error, response)
    return data!
  },

  async updateMe(profile: UserProfileUpdate): Promise<UserProfile> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.PATCH('/api/v1/user/me', {
      headers,
      body: profile,
    })
    if (error) handleError(error, response)
    return data!
  },

  async checkUsername(username: string): Promise<UsernameCheck> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.GET('/api/v1/user/check-username/{username}', {
      headers,
      params: { path: { username } },
    })
    if (error) handleError(error, response)
    return data!
  },

  async setupProfile(profile: UserProfileUpdate): Promise<UserProfile> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.POST('/api/v1/user/setup', {
      headers,
      body: profile,
    })
    if (error) handleError(error, response)
    return data!
  },
}

// ============================================================================
// Items API
// ============================================================================

export const itemsApi = {
  async list(page = 1, limit = 20): Promise<ItemList> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.GET('/api/v1/items', {
      headers,
      params: { query: { page, limit } },
    })
    if (error) handleError(error, response)
    return data!
  },

  async get(itemId: string): Promise<ItemWithShares> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.GET('/api/v1/items/{item_id}', {
      headers,
      params: { path: { item_id: itemId } },
    })
    if (error) handleError(error, response)
    return data!
  },

  async create(item: ItemCreate): Promise<ItemWithShares> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.POST('/api/v1/items', {
      headers,
      body: item,
    })
    if (error) handleError(error, response)
    return data!
  },

  async update(itemId: string, item: ItemUpdate): Promise<ItemWithShares> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.PATCH('/api/v1/items/{item_id}', {
      headers,
      params: { path: { item_id: itemId } },
      body: item,
    })
    if (error) handleError(error, response)
    return data!
  },

  async delete(itemId: string): Promise<void> {
    const headers = await getAuthHeaders()
    const { error, response } = await client.DELETE('/api/v1/items/{item_id}', {
      headers,
      params: { path: { item_id: itemId } },
    })
    if (error) handleError(error, response)
  },

  async share(itemId: string, bubbleIds: string[]): Promise<ItemWithShares> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.POST('/api/v1/items/{item_id}/share', {
      headers,
      params: { path: { item_id: itemId } },
      body: { bubble_ids: bubbleIds },
    })
    if (error) handleError(error, response)
    return data!
  },
}

// ============================================================================
// Bubbles API
// ============================================================================

export const bubblesApi = {
  async list(): Promise<BubbleList> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.GET('/api/v1/bubbles', { headers })
    if (error) handleError(error, response)
    return data!
  },

  async get(bubbleId: string): Promise<BubbleWithMembers> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.GET('/api/v1/bubbles/{bubble_id}', {
      headers,
      params: { path: { bubble_id: bubbleId } },
    })
    if (error) handleError(error, response)
    return data!
  },

  async create(bubble: BubbleCreate): Promise<BubbleWithMembers> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.POST('/api/v1/bubbles', {
      headers,
      body: bubble,
    })
    if (error) handleError(error, response)
    return data!
  },

  async update(bubbleId: string, bubble: BubbleUpdate): Promise<Bubble> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.PATCH('/api/v1/bubbles/{bubble_id}', {
      headers,
      params: { path: { bubble_id: bubbleId } },
      body: bubble,
    })
    if (error) handleError(error, response)
    return data!
  },

  async delete(bubbleId: string): Promise<void> {
    const headers = await getAuthHeaders()
    const { error, response } = await client.DELETE('/api/v1/bubbles/{bubble_id}', {
      headers,
      params: { path: { bubble_id: bubbleId } },
    })
    if (error) handleError(error, response)
  },

  async join(inviteCode: string): Promise<BubbleInvite> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.POST('/api/v1/bubbles/join/{invite_code}', {
      headers,
      params: { path: { invite_code: inviteCode } },
    })
    if (error) handleError(error, response)
    return data!
  },

  async regenerateInviteCode(bubbleId: string): Promise<Bubble> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.POST('/api/v1/bubbles/{bubble_id}/regenerate-code', {
      headers,
      params: { path: { bubble_id: bubbleId } },
    })
    if (error) handleError(error, response)
    return data!
  },

  async updateMemberRole(bubbleId: string, memberId: string, role: 'admin' | 'member'): Promise<MemberRef> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.PATCH('/api/v1/bubbles/{bubble_id}/members/{member_id}', {
      headers,
      params: { path: { bubble_id: bubbleId, member_id: memberId } },
      body: { role },
    })
    if (error) handleError(error, response)
    return data!
  },

  async removeMember(bubbleId: string, memberId: string): Promise<void> {
    const headers = await getAuthHeaders()
    const { error, response } = await client.DELETE('/api/v1/bubbles/{bubble_id}/members/{member_id}', {
      headers,
      params: { path: { bubble_id: bubbleId, member_id: memberId } },
    })
    if (error) handleError(error, response)
  },
}

// ============================================================================
// Loans API
// ============================================================================

export const loansApi = {
  async list(options?: {
    status?: string
    asBorrower?: boolean
    asLender?: boolean
  }): Promise<LoanList> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.GET('/api/v1/loans', {
      headers,
      params: {
        query: {
          status: options?.status,
          as_borrower: options?.asBorrower,
          as_lender: options?.asLender,
        },
      },
    })
    if (error) handleError(error, response)
    return data!
  },

  async get(loanId: string): Promise<LoanWithDetails> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.GET('/api/v1/loans/{loan_id}', {
      headers,
      params: { path: { loan_id: loanId } },
    })
    if (error) handleError(error, response)
    return data!
  },

  async request(request: LoanRequest): Promise<LoanWithDetails> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.POST('/api/v1/loans', {
      headers,
      body: request,
    })
    if (error) handleError(error, response)
    return data!
  },

  async update(loanId: string, update: LoanUpdate): Promise<LoanWithDetails> {
    const headers = await getAuthHeaders()
    const { data, error, response } = await client.PATCH('/api/v1/loans/{loan_id}', {
      headers,
      params: { path: { loan_id: loanId } },
      body: update,
    })
    if (error) handleError(error, response)
    return data!
  },

  // Convenience methods for common actions
  async approve(loanId: string): Promise<LoanWithDetails> {
    return this.update(loanId, { status: 'active' })
  },

  async cancel(loanId: string): Promise<LoanWithDetails> {
    return this.update(loanId, { status: 'cancelled' })
  },

  async markReturned(loanId: string): Promise<LoanWithDetails> {
    return this.update(loanId, { status: 'returned' })
  },
}
