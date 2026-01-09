/**
 * RLS Security Tests - Loans
 *
 * TEST-018: Verifies Row Level Security policies for loans.
 * Tests that only borrowers and item owners can see their related loans,
 * and that third parties have no visibility.
 */

import { multiUserTest, expect, API_BASE_URL, TEST_USERS } from '../fixtures/auth.fixture'
import {
  createTestItem,
  createTestBubble,
  createTestLoan,
  shareItemToBubbles,
  joinTestBubble,
  deleteTestItem,
  deleteTestBubble,
  uniqueItemName,
  uniqueBubbleName,
  TestLoan,
} from '../fixtures/data.helpers'

multiUserTest.describe('Loans RLS - Borrower Visibility', () => {
  multiUserTest(
    'borrower CAN see their own loan requests',
    async ({ aliceRequest, bobRequest }) => {
      // Setup: Alice creates bubble, item, shares it
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Loan Test'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Borrowable'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      // Bob requests to borrow
      const loan = await createTestLoan(bobRequest, {
        item_id: aliceItem.id,
        bubble_id: bubble.id,
        notes: 'Please can I borrow this?',
      })

      try {
        // Bob can see his loan request
        const response = await bobRequest.get(`${API_BASE_URL}/api/v1/loans/${loan.id}`)
        expect(response.ok()).toBe(true)

        const loanData = await response.json()
        expect(loanData.id).toBe(loan.id)
        expect(loanData.borrower_id).toBe(TEST_USERS.bob.id)
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'borrower can see their loans in list with as_borrower filter',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('List Test'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('List Item'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      const loan = await createTestLoan(bobRequest, {
        item_id: aliceItem.id,
        bubble_id: bubble.id,
      })

      try {
        // Bob lists loans as borrower
        const response = await bobRequest.get(`${API_BASE_URL}/api/v1/loans?as_borrower=true`)
        expect(response.ok()).toBe(true)

        const body = await response.json()
        const found = body.loans.some((l: TestLoan) => l.id === loan.id)
        expect(found).toBe(true)
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Loans RLS - Lender Visibility', () => {
  multiUserTest(
    'lender (item owner) CAN see loans of their items',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Lender View'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Lender Item'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      const loan = await createTestLoan(bobRequest, {
        item_id: aliceItem.id,
        bubble_id: bubble.id,
      })

      try {
        // Alice (lender/owner) can see the loan
        const response = await aliceRequest.get(`${API_BASE_URL}/api/v1/loans/${loan.id}`)
        expect(response.ok()).toBe(true)

        const loanData = await response.json()
        expect(loanData.id).toBe(loan.id)
        expect(loanData.owner.id).toBe(TEST_USERS.alice.id)
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'lender can see loans in list with as_lender filter',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Lender List'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Lender List Item'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      const loan = await createTestLoan(bobRequest, {
        item_id: aliceItem.id,
        bubble_id: bubble.id,
      })

      try {
        // Alice lists loans as lender
        const response = await aliceRequest.get(`${API_BASE_URL}/api/v1/loans?as_lender=true`)
        expect(response.ok()).toBe(true)

        const body = await response.json()
        const found = body.loans.some((l: TestLoan) => l.id === loan.id)
        expect(found).toBe(true)
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Loans RLS - Third Party Isolation', () => {
  multiUserTest(
    'third party CANNOT see loan between others via GET /loans/:id',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Private Loan'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)
      // Carol does NOT join

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Private Item'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      const loan = await createTestLoan(bobRequest, {
        item_id: aliceItem.id,
        bubble_id: bubble.id,
      })

      try {
        // Carol (not borrower, not owner) tries to access the loan
        const response = await carolRequest.get(`${API_BASE_URL}/api/v1/loans/${loan.id}`)

        // Should fail - not involved in this loan
        expect([403, 404]).toContain(response.status())
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'third party does not see others\' loans in their list',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Isolated Loan'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)
      // Carol is NOT in the bubble

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Hidden Loan Item'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      const loan = await createTestLoan(bobRequest, {
        item_id: aliceItem.id,
        bubble_id: bubble.id,
      })

      try {
        // Carol lists all her loans
        const response = await carolRequest.get(`${API_BASE_URL}/api/v1/loans`)
        expect(response.ok()).toBe(true)

        const body = await response.json()
        // Carol should NOT see the loan between Alice and Bob
        const found = body.loans.some((l: TestLoan) => l.id === loan.id)
        expect(found).toBe(false)
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'bubble member who is not borrower or owner cannot see loan',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      // All three in the same bubble
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Three Way'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)
      await joinTestBubble(carolRequest, bubble.invite_code)

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Three Way Item'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      // Bob borrows from Alice
      const loan = await createTestLoan(bobRequest, {
        item_id: aliceItem.id,
        bubble_id: bubble.id,
      })

      try {
        // Carol is in the bubble but not part of this loan
        const response = await carolRequest.get(`${API_BASE_URL}/api/v1/loans/${loan.id}`)

        // Should fail - Carol is neither borrower nor owner
        expect([403, 404]).toContain(response.status())
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Loans RLS - Update Restrictions', () => {
  multiUserTest(
    'third party cannot update loan status',
    async ({ aliceRequest, bobRequest, carolRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Update Block'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Update Block Item'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      const loan = await createTestLoan(bobRequest, {
        item_id: aliceItem.id,
        bubble_id: bubble.id,
      })

      try {
        // Carol tries to approve the loan (she's not the owner)
        const response = await carolRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'active' },
        })

        expect([403, 404]).toContain(response.status())

        // Verify loan status unchanged
        const checkResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/loans/${loan.id}`)
        const loanData = await checkResponse.json()
        expect(loanData.status).toBe('requested')
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'borrower can cancel their own loan request',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Cancel Test'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Cancel Item'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      const loan = await createTestLoan(bobRequest, {
        item_id: aliceItem.id,
        bubble_id: bubble.id,
      })

      try {
        // Bob cancels his own loan request
        const response = await bobRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'cancelled' },
        })

        expect(response.ok()).toBe(true)

        const updated = await response.json()
        expect(updated.status).toBe('cancelled')
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'owner can approve loan request',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Approve Test'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Approve Item'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      const loan = await createTestLoan(bobRequest, {
        item_id: aliceItem.id,
        bubble_id: bubble.id,
      })

      try {
        // Alice (owner) approves the loan
        const response = await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'active' },
        })

        expect(response.ok()).toBe(true)

        const updated = await response.json()
        expect(updated.status).toBe('active')
        expect(updated.lent_at).not.toBeNull()
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'borrower cannot approve their own loan request',
    async ({ aliceRequest, bobRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Self Approve'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Self Approve Item'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      const loan = await createTestLoan(bobRequest, {
        item_id: aliceItem.id,
        bubble_id: bubble.id,
      })

      try {
        // Bob (borrower) tries to approve his own request
        const response = await bobRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
          data: { status: 'active' },
        })

        // Should fail - only owner can approve
        expect(response.status()).toBe(403)

        // Status unchanged
        const checkResponse = await aliceRequest.get(`${API_BASE_URL}/api/v1/loans/${loan.id}`)
        const loanData = await checkResponse.json()
        expect(loanData.status).toBe('requested')
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})

multiUserTest.describe('Loans RLS - Loan Request Restrictions', () => {
  multiUserTest(
    'user cannot request loan for item not shared to their bubble',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates bubble but does NOT share item to it
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('No Share'),
      })
      await joinTestBubble(bobRequest, bubble.invite_code)

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Not Shared'),
        quantity: 1,
      })
      // Note: NOT sharing the item

      try {
        // Bob tries to borrow an unshared item
        const response = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: {
            item_id: aliceItem.id,
            bubble_id: bubble.id,
          },
        })

        expect(response.status()).toBe(400)

        const body = await response.json()
        expect(body.detail).toContain('not shared')
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'user cannot request loan from bubble they are not a member of',
    async ({ aliceRequest, bobRequest }) => {
      // Alice creates bubble, Bob does NOT join
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('No Member'),
      })

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Member Only'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      try {
        // Bob (not a member) tries to borrow
        const response = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: {
            item_id: aliceItem.id,
            bubble_id: bubble.id,
          },
        })

        expect(response.status()).toBe(400)

        const body = await response.json()
        expect(body.detail).toContain('member')
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )

  multiUserTest(
    'user cannot borrow their own item',
    async ({ aliceRequest }) => {
      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Self Borrow'),
      })

      const aliceItem = await createTestItem(aliceRequest, {
        name: uniqueItemName('Own Item'),
        quantity: 1,
      })
      await shareItemToBubbles(aliceRequest, aliceItem.id, [bubble.id])

      try {
        // Alice tries to borrow her own item
        const response = await aliceRequest.post(`${API_BASE_URL}/api/v1/loans`, {
          data: {
            item_id: aliceItem.id,
            bubble_id: bubble.id,
          },
        })

        expect(response.status()).toBe(400)

        const body = await response.json()
        expect(body.detail).toContain('own item')
      } finally {
        await deleteTestItem(aliceRequest, aliceItem.id)
        await deleteTestBubble(aliceRequest, bubble.id)
      }
    }
  )
})
