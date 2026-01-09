/**
 * Data helper utilities for E2E tests
 *
 * Functions to create, retrieve, and clean up test data.
 * Uses the authenticated API to create real data that respects RLS.
 */

import { AuthenticatedRequest, API_BASE_URL } from './auth.fixture'

// ============================================================================
// TYPES
// ============================================================================

export interface BubbleRef {
  id: string
  name: string
}

export interface TestItem {
  id: string
  owner_id: string
  name: string
  description: string | null
  quantity: number
  created_at: string
  shared_bubbles?: BubbleRef[]
  available_quantity?: number
}

export interface TestBubble {
  id: string
  name: string
  description: string | null
  invite_code: string
  created_by: string
  created_at: string
  members?: TestBubbleMember[]
  member_count?: number
  is_admin?: boolean
}

export interface TestBubbleMember {
  user_id: string
  role: 'admin' | 'member'
  joined_at: string
  display_name?: string
  username?: string
}

export interface TestLoan {
  id: string
  item_id: string
  borrower_id: string
  bubble_id: string
  status: 'requested' | 'active' | 'returned' | 'cancelled'
  requested_at: string
  lent_at: string | null
  returned_at: string | null
  notes: string | null
}

export interface TestUserProfile {
  id: string
  display_name: string
  username: string | null
  avatar_url: string | null
  created_at: string
}

// ============================================================================
// ITEMS
// ============================================================================

export async function createTestItem(
  authRequest: AuthenticatedRequest,
  data: {
    name: string
    description?: string
    quantity?: number
  }
): Promise<TestItem> {
  const response = await authRequest.post(`${API_BASE_URL}/api/v1/items`, {
    data: {
      name: data.name,
      description: data.description ?? null,
      quantity: data.quantity ?? 1,
    },
  })

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to create item: ${response.status()} - ${error}`)
  }

  return response.json()
}

export async function getTestItem(
  authRequest: AuthenticatedRequest,
  itemId: string
): Promise<TestItem | null> {
  const response = await authRequest.get(`${API_BASE_URL}/api/v1/items/${itemId}`)

  if (response.status() === 404) {
    return null
  }

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to get item: ${response.status()} - ${error}`)
  }

  return response.json()
}

export async function deleteTestItem(
  authRequest: AuthenticatedRequest,
  itemId: string
): Promise<void> {
  const response = await authRequest.delete(`${API_BASE_URL}/api/v1/items/${itemId}`)

  if (!response.ok() && response.status() !== 404) {
    const error = await response.text()
    throw new Error(`Failed to delete item: ${response.status()} - ${error}`)
  }
}

// ============================================================================
// BUBBLES
// ============================================================================

export async function createTestBubble(
  authRequest: AuthenticatedRequest,
  data: {
    name: string
    description?: string
  }
): Promise<TestBubble> {
  const response = await authRequest.post(`${API_BASE_URL}/api/v1/bubbles`, {
    data: {
      name: data.name,
      description: data.description ?? null,
    },
  })

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to create bubble: ${response.status()} - ${error}`)
  }

  return response.json()
}

export async function getTestBubble(
  authRequest: AuthenticatedRequest,
  bubbleId: string
): Promise<TestBubble | null> {
  const response = await authRequest.get(`${API_BASE_URL}/api/v1/bubbles/${bubbleId}`)

  if (response.status() === 404) {
    return null
  }

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to get bubble: ${response.status()} - ${error}`)
  }

  return response.json()
}

export async function joinTestBubble(
  authRequest: AuthenticatedRequest,
  inviteCode: string
): Promise<TestBubble> {
  const response = await authRequest.post(
    `${API_BASE_URL}/api/v1/bubbles/join/${inviteCode}`
  )

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to join bubble: ${response.status()} - ${error}`)
  }

  return response.json()
}

export async function deleteTestBubble(
  authRequest: AuthenticatedRequest,
  bubbleId: string
): Promise<void> {
  const response = await authRequest.delete(`${API_BASE_URL}/api/v1/bubbles/${bubbleId}`)

  if (!response.ok() && response.status() !== 404) {
    const error = await response.text()
    throw new Error(`Failed to delete bubble: ${response.status()} - ${error}`)
  }
}

// ============================================================================
// ITEM SHARING
// ============================================================================

export async function shareItemToBubbles(
  authRequest: AuthenticatedRequest,
  itemId: string,
  bubbleIds: string[]
): Promise<void> {
  const response = await authRequest.post(
    `${API_BASE_URL}/api/v1/items/${itemId}/share`,
    {
      data: { bubble_ids: bubbleIds },
    }
  )

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to share item: ${response.status()} - ${error}`)
  }
}

// ============================================================================
// LOANS
// ============================================================================

export async function createTestLoan(
  authRequest: AuthenticatedRequest,
  data: {
    item_id: string
    bubble_id: string
    notes?: string
  }
): Promise<TestLoan> {
  const response = await authRequest.post(`${API_BASE_URL}/api/v1/loans`, {
    data: {
      item_id: data.item_id,
      bubble_id: data.bubble_id,
      notes: data.notes ?? null,
    },
  })

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to create loan: ${response.status()} - ${error}`)
  }

  return response.json()
}

export async function updateTestLoan(
  authRequest: AuthenticatedRequest,
  loanId: string,
  data: {
    status?: TestLoan['status']
    notes?: string
  }
): Promise<TestLoan> {
  const response = await authRequest.patch(`${API_BASE_URL}/api/v1/loans/${loanId}`, {
    data,
  })

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to update loan: ${response.status()} - ${error}`)
  }

  return response.json()
}

// ============================================================================
// USER PROFILE
// ============================================================================

export async function getTestUserProfile(
  authRequest: AuthenticatedRequest
): Promise<TestUserProfile> {
  const response = await authRequest.get(`${API_BASE_URL}/api/v1/user/me`)

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to get user profile: ${response.status()} - ${error}`)
  }

  return response.json()
}

export async function updateTestUserProfile(
  authRequest: AuthenticatedRequest,
  data: {
    display_name?: string
    username?: string
  }
): Promise<TestUserProfile> {
  const response = await authRequest.patch(`${API_BASE_URL}/api/v1/user/me`, {
    data,
  })

  if (!response.ok()) {
    const error = await response.text()
    throw new Error(`Failed to update user profile: ${response.status()} - ${error}`)
  }

  return response.json()
}

// ============================================================================
// UNIQUE ID GENERATION
// ============================================================================

/**
 * Generate a unique suffix for test data names
 * Helps avoid collisions when running tests in parallel
 */
export function uniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
}

/**
 * Generate a unique test item name
 */
export function uniqueItemName(prefix = 'Test Item'): string {
  return `${prefix} ${uniqueId()}`
}

/**
 * Generate a unique test bubble name
 */
export function uniqueBubbleName(prefix = 'Test Bubble'): string {
  return `${prefix} ${uniqueId()}`
}
