/**
 * Authenticated Loans E2E Tests
 *
 * Tests for loan/borrowing functionality.
 *
 * These tests use authenticated test users from seed data to verify:
 * - Loan request creation
 * - Loan listing with filters (status, as_borrower, as_lender)
 * - Loan status transitions
 * - Cannot borrow own item
 * - Item availability checking
 */

import { test, expect, multiUserTest, API_BASE_URL, TEST_USERS } from '../fixtures/auth.fixture'
import {
  createTestItem,
  createTestBubble,
  shareItemToBubbles,
  createTestLoan,
  deleteTestItem,
  deleteTestBubble,
  uniqueItemName,
  uniqueBubbleName,
  TestLoan,
} from '../fixtures/data.helpers'

multiUserTest.describe('Loans - Request a Loan', () => {
  multiUserTest(
    'can request to borrow an item shared to a bubble',
    async ({ aliceRequest, bobRequest }) => {
      // Setup: Alice creates item and bubble, shares item to bubble
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName(), quantity: 2 })

      try {
        // Bob joins the bubble
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

        // Alice shares item to bubble
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Bob requests to borrow
        const response = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: {
            item_id: item.id,
            bubble_id: bubble.id,
            notes: 'I would like to borrow this for a week',
          },
        })

        expect(response.status()).toBe(201)
        const loan = await response.json()

        expect(loan.id).toBeDefined()
        expect(loan.item_id).toBe(item.id)
        expect(loan.borrower_id).toBe(TEST_USERS.bob.id)
        expect(loan.bubble_id).toBe(bubble.id)
        expect(loan.status).toBe('requested')
        expect(loan.notes).toBe('I would like to borrow this for a week')
        expect(loan.requested_at).toBeDefined()
        expect(loan.lent_at).toBeNull()
        expect(loan.returned_at).toBeNull()

        // Verify nested details
        expect(loan.item.name).toBe(item.name)
        expect(loan.borrower.id).toBe(TEST_USERS.bob.id)
        expect(loan.bubble.id).toBe(bubble.id)
        expect(loan.owner.id).toBe(TEST_USERS.alice.id)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'cannot borrow own item',
    async ({ aliceRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        const response = await aliceRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: {
            item_id: item.id,
            bubble_id: bubble.id,
          },
        })

        expect(response.status()).toBe(400)
        const body = await response.json()
        expect(body.detail).toBe('Cannot borrow your own item')
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'cannot borrow item not shared to bubble',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        // Bob joins bubble
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

        // Item is NOT shared to bubble
        const response = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: {
            item_id: item.id,
            bubble_id: bubble.id,
          },
        })

        expect(response.status()).toBe(400)
        const body = await response.json()
        expect(body.detail).toBe('Item is not shared to this bubble')
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'cannot borrow from bubble user is not member of',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Bob is NOT a member of the bubble
        const response = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: {
            item_id: item.id,
            bubble_id: bubble.id,
          },
        })

        expect(response.status()).toBe(400)
        const body = await response.json()
        expect(body.detail).toBe('Not a member of this bubble')
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'cannot create duplicate pending loan for same item',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // First loan request
        const first = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        expect(first.status()).toBe(201)

        // Second loan request for same item
        const second = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })

        expect(second.status()).toBe(400)
        const body = await second.json()
        expect(body.detail).toContain('already have an active or pending loan')
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Loans - List with Filters', () => {
  multiUserTest(
    'can list loans as borrower',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Bob creates a loan
        const loanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loan = await loanResponse.json()

        // Bob lists loans as borrower
        const response = await bobRequest.get(`${API_BASE_URL}/api/v1/loans?as_borrower=true`)
        expect(response.status()).toBe(200)

        const data = await response.json()
        expect(data.loans).toBeDefined()
        expect(Array.isArray(data.loans)).toBe(true)

        const foundLoan = data.loans.find((l: TestLoan) => l.id === loan.id)
        expect(foundLoan).toBeDefined()
        expect(foundLoan.borrower_id).toBe(TEST_USERS.bob.id)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'can list loans as lender (item owner)',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Bob creates a loan request
        const loanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loan = await loanResponse.json()

        // Alice lists loans as lender
        const response = await aliceRequest.get(`${API_BASE_URL}/api/v1/loans?as_lender=true`)
        expect(response.status()).toBe(200)

        const data = await response.json()
        const foundLoan = data.loans.find((l: any) => l.id === loan.id)
        expect(foundLoan).toBeDefined()
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'can filter loans by status',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Bob creates a loan (status: requested)
        await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })

        // Filter by requested status
        const response = await bobRequest.get(
          `${API_BASE_URL}/api/v1/loans?status=requested&as_borrower=true`
        )
        expect(response.status()).toBe(200)

        const data = await response.json()
        // All returned loans should have requested status
        for (const loan of data.loans) {
          expect(loan.status).toBe('requested')
        }

        // Filter by active status (should not include the new loan)
        const activeResponse = await bobRequest.get(
          `${API_BASE_URL}/api/v1/loans?status=active&as_borrower=true`
        )
        const activeData = await activeResponse.json()
        const newLoanInActive = activeData.loans.find(
          (l: any) => l.item_id === item.id && l.borrower_id === TEST_USERS.bob.id
        )
        expect(newLoanInActive).toBeUndefined()
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'empty lender list when user has no items',
    async ({ bobRequest }) => {
      // Bob has no items
      const response = await bobRequest.get(`${API_BASE_URL}/api/v1/loans?as_lender=true`)
      expect(response.status()).toBe(200)

      const data = await response.json()
      expect(data.loans).toEqual([])
      expect(data.total).toBe(0)
    }
  )
})

multiUserTest.describe('Loans - Get by ID', () => {
  multiUserTest(
    'borrower can get loan details',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        const createResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loan = await createResponse.json()

        const response = await bobRequest.get(`${API_BASE_URL}/api/v1/loans/${loan.id}`)
        expect(response.status()).toBe(200)

        const fetchedLoan = await response.json()
        expect(fetchedLoan.id).toBe(loan.id)
        expect(fetchedLoan.borrower.id).toBe(TEST_USERS.bob.id)
        expect(fetchedLoan.owner.id).toBe(TEST_USERS.alice.id)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'lender (item owner) can get loan details',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        const createResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loan = await createResponse.json()

        // Alice (item owner) can see the loan
        const response = await aliceRequest.get(`${API_BASE_URL}/api/v1/loans/${loan.id}`)
        expect(response.status()).toBe(200)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'unrelated user cannot get loan details',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        const createResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loan = await createResponse.json()

        // Carol (not involved) tries to access
        const response = await carolRequest.get(`${API_BASE_URL}/api/v1/loans/${loan.id}`)
        expect(response.status()).toBe(404)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Loans - Status Transitions', () => {
  multiUserTest(
    'owner can approve loan request (requested -> active)',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        const createResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loan = await createResponse.json()

        // Alice approves
        const response = await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'active' },
        })

        expect(response.status()).toBe(200)
        const updated = await response.json()
        expect(updated.status).toBe('active')
        expect(updated.lent_at).toBeDefined()
        expect(updated.lent_at).not.toBeNull()
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'borrower can cancel loan request (requested -> cancelled)',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        const createResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loan = await createResponse.json()

        // Bob cancels
        const response = await bobRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'cancelled' },
        })

        expect(response.status()).toBe(200)
        const updated = await response.json()
        expect(updated.status).toBe('cancelled')
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'owner can mark loan as returned (active -> returned)',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Create and approve loan
        const createResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loan = await createResponse.json()

        await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'active' },
        })

        // Alice marks as returned
        const response = await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'returned' },
        })

        expect(response.status()).toBe(200)
        const updated = await response.json()
        expect(updated.status).toBe('returned')
        expect(updated.returned_at).toBeDefined()
        expect(updated.returned_at).not.toBeNull()
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'borrower can mark loan as returned (active -> returned)',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Create and approve loan
        const createResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loan = await createResponse.json()

        await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'active' },
        })

        // Bob marks as returned
        const response = await bobRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'returned' },
        })

        expect(response.status()).toBe(200)
        const updated = await response.json()
        expect(updated.status).toBe('returned')
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'borrower cannot approve loan (only owner can)',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        const createResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loan = await createResponse.json()

        // Bob tries to approve his own request
        const response = await bobRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'active' },
        })

        expect(response.status()).toBe(403)
        const body = await response.json()
        expect(body.detail).toContain("don't have permission")
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'owner cannot cancel loan (only borrower can)',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        const createResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loan = await createResponse.json()

        // Alice tries to cancel Bob's request
        const response = await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'cancelled' },
        })

        expect(response.status()).toBe(403)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'invalid status transition is rejected',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName() })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        const createResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loan = await createResponse.json()

        // Try invalid transition: requested -> returned (should go through active first)
        const response = await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'returned' },
        })

        expect(response.status()).toBe(400)
        const body = await response.json()
        expect(body.detail).toContain('Invalid status transition')
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Loans - Item Availability', () => {
  multiUserTest(
    'cannot request loan when all items are borrowed',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName(), quantity: 1 })

      try {
        // Bob and Carol join
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await carolRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Bob requests and gets approved
        const bobLoan = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const loanData = await bobLoan.json()

        await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${loanData.id}`, {
          data: { status: 'active' },
        })

        // Carol tries to borrow the same item (only 1 available, now borrowed)
        const response = await carolRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })

        expect(response.status()).toBe(400)
        const body = await response.json()
        expect(body.detail).toBe('Item is not available')
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'item becomes available again after return',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      const bubble = await createTestBubble(aliceRequest, { name: uniqueBubbleName() })
      const item = await createTestItem(aliceRequest, { name: uniqueItemName(), quantity: 1 })

      try {
        await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await carolRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
        await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

        // Bob borrows and returns
        const bobLoanResp = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })
        const bobLoan = await bobLoanResp.json()

        await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${bobLoan.id}`, {
          data: { status: 'active' },
        })

        await bobRequest.patch(`${API_BASE_URL}/api/v1/loans/${bobLoan.id}`, {
          data: { status: 'returned' },
        })

        // Carol can now borrow
        const carolLoan = await carolRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: { item_id: item.id, bubble_id: bubble.id },
        })

        expect(carolLoan.status()).toBe(201)
      } finally {
        await deleteTestItem(aliceRequest, item.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})
