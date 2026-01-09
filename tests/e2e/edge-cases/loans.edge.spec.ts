/**
 * Loans Edge Case Tests
 *
 * Tests for business logic validation and edge cases in loan management.
 * Verifies ownership rules, status transitions, and borrowing constraints.
 */

import {
  test,
  expect,
  API_BASE_URL,
  multiUserTest,
  TEST_USERS,
} from '../fixtures/auth.fixture'
import {
  createTestItem,
  createTestBubble,
  shareItemToBubbles,
  uniqueItemName,
  uniqueBubbleName,
} from '../fixtures/data.helpers'

test.describe('Loans Validation Edge Cases', () => {
  test('loan request requires item_id', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, {
      name: uniqueBubbleName('Loan Validation'),
    })

    const response = await authRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {
        bubble_id: bubble.id,
      },
    })

    expect(response.status()).toBe(422)
    const body = await response.json()
    expect(JSON.stringify(body.detail)).toContain('item_id')
  })

  test('loan request requires bubble_id', async ({ authRequest }) => {
    const item = await createTestItem(authRequest, {
      name: uniqueItemName('Loan Item'),
    })

    const response = await authRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {
        item_id: item.id,
      },
    })

    expect(response.status()).toBe(422)
    const body = await response.json()
    expect(JSON.stringify(body.detail)).toContain('bubble_id')
  })

  test('loan request with non-existent item returns 404', async ({ authRequest }) => {
    const bubble = await createTestBubble(authRequest, {
      name: uniqueBubbleName('No Item'),
    })

    const response = await authRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {
        item_id: '00000000-0000-0000-0000-000000000000',
        bubble_id: bubble.id,
      },
    })

    expect(response.status()).toBe(404)
    const body = await response.json()
    expect(body.detail).toContain('not found')
  })
})

test.describe('Loans Business Logic - Own Item', () => {
  test('cannot borrow your own item', async ({ authRequest }) => {
    // Create item and bubble
    const item = await createTestItem(authRequest, {
      name: uniqueItemName('My Own Item'),
    })

    const bubble = await createTestBubble(authRequest, {
      name: uniqueBubbleName('Self Borrow Bubble'),
    })

    // Share item to bubble
    await shareItemToBubbles(authRequest, item.id, [bubble.id])

    // Try to borrow own item
    const response = await authRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {
        item_id: item.id,
        bubble_id: bubble.id,
      },
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.detail).toContain('Cannot borrow your own item')
  })
})

multiUserTest.describe('Loans Business Logic - Multi-User', () => {
  multiUserTest('cannot borrow item not shared to bubble', async ({
    aliceRequest,
    bobRequest,
  }) => {
    // Alice creates an item
    const item = await createTestItem(aliceRequest, {
      name: uniqueItemName('Not Shared Item'),
    })

    // Alice creates a bubble
    const bubble = await createTestBubble(aliceRequest, {
      name: uniqueBubbleName('No Share Bubble'),
    })

    // Bob joins the bubble
    await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    // Item is NOT shared to the bubble

    // Bob tries to borrow the item
    const response = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {
        item_id: item.id,
        bubble_id: bubble.id,
      },
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.detail).toContain('not shared to this bubble')
  })

  multiUserTest('cannot borrow if not member of bubble', async ({
    aliceRequest,
    bobRequest,
  }) => {
    // Alice creates an item and a bubble
    const item = await createTestItem(aliceRequest, {
      name: uniqueItemName('Member Only Item'),
    })

    const bubble = await createTestBubble(aliceRequest, {
      name: uniqueBubbleName('Member Only Bubble'),
    })

    // Share item to bubble
    await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

    // Bob does NOT join the bubble

    // Bob tries to borrow
    const response = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {
        item_id: item.id,
        bubble_id: bubble.id,
      },
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.detail).toContain('Not a member of this bubble')
  })

  multiUserTest('cannot borrow unavailable item (all quantity loaned)', async ({
    aliceRequest,
    bobRequest,
    carolRequest,
  }) => {
    // Alice creates an item with quantity 1
    const item = await createTestItem(aliceRequest, {
      name: uniqueItemName('Single Item'),
      quantity: 1,
    })

    // Alice creates a bubble
    const bubble = await createTestBubble(aliceRequest, {
      name: uniqueBubbleName('Limited Stock Bubble'),
    })

    // Bob and Carol join
    await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
    await carolRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)

    // Share item
    await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

    // Bob requests to borrow
    const bobLoanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {
        item_id: item.id,
        bubble_id: bubble.id,
      },
    })
    expect(bobLoanResponse.status()).toBe(201)
    const bobLoan = await bobLoanResponse.json()

    // Alice approves Bob's loan
    await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${bobLoan.id}`, {
      data: { status: 'active' },
    })

    // Carol tries to borrow the same item (should fail - no availability)
    const carolResponse = await carolRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {
        item_id: item.id,
        bubble_id: bubble.id,
      },
    })

    expect(carolResponse.status()).toBe(400)
    const carolBody = await carolResponse.json()
    expect(carolBody.detail).toContain('not available')
  })

  multiUserTest('cannot request duplicate loan for same item', async ({
    aliceRequest,
    bobRequest,
  }) => {
    const item = await createTestItem(aliceRequest, {
      name: uniqueItemName('Duplicate Loan Item'),
      quantity: 2,
    })

    const bubble = await createTestBubble(aliceRequest, {
      name: uniqueBubbleName('Duplicate Loan Bubble'),
    })

    await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
    await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

    // Bob requests loan
    const firstLoanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {
        item_id: item.id,
        bubble_id: bubble.id,
      },
    })
    expect(firstLoanResponse.status()).toBe(201)

    // Bob tries to request again (should fail - already has pending loan)
    const duplicateResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {
        item_id: item.id,
        bubble_id: bubble.id,
      },
    })

    expect(duplicateResponse.status()).toBe(400)
    const body = await duplicateResponse.json()
    expect(body.detail).toContain('already have an active or pending loan')
  })
})

multiUserTest.describe('Loans Status Transitions', () => {
  multiUserTest(
    'valid transition: requested -> active (owner approves)',
    async ({ aliceRequest, bobRequest }) => {
      const item = await createTestItem(aliceRequest, {
        name: uniqueItemName('Approve Flow Item'),
      })

      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Approve Flow Bubble'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
      await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

      const loanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
        data: {
          item_id: item.id,
          bubble_id: bubble.id,
        },
      })
      const loan = await loanResponse.json()
      expect(loan.status).toBe('requested')

      // Owner approves
      const approveResponse = await aliceRequest.patch(
        `${API_BASE_URL}/api/v1/loans/${loan.id}`,
        {
          data: { status: 'active' },
        }
      )

      expect(approveResponse.status()).toBe(200)
      const approved = await approveResponse.json()
      expect(approved.status).toBe('active')
      expect(approved.lent_at).toBeTruthy()
    }
  )

  multiUserTest(
    'valid transition: requested -> cancelled (borrower cancels)',
    async ({ aliceRequest, bobRequest }) => {
      const item = await createTestItem(aliceRequest, {
        name: uniqueItemName('Cancel Flow Item'),
      })

      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Cancel Flow Bubble'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
      await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

      const loanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
        data: {
          item_id: item.id,
          bubble_id: bubble.id,
        },
      })
      const loan = await loanResponse.json()

      // Borrower cancels
      const cancelResponse = await bobRequest.patch(
        `${API_BASE_URL}/api/v1/loans/${loan.id}`,
        {
          data: { status: 'cancelled' },
        }
      )

      expect(cancelResponse.status()).toBe(200)
      const cancelled = await cancelResponse.json()
      expect(cancelled.status).toBe('cancelled')
    }
  )

  multiUserTest(
    'valid transition: active -> returned (either party)',
    async ({ aliceRequest, bobRequest }) => {
      const item = await createTestItem(aliceRequest, {
        name: uniqueItemName('Return Flow Item'),
      })

      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Return Flow Bubble'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
      await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

      const loanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
        data: {
          item_id: item.id,
          bubble_id: bubble.id,
        },
      })
      const loan = await loanResponse.json()

      // Owner approves
      await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
        data: { status: 'active' },
      })

      // Borrower marks as returned
      const returnResponse = await bobRequest.patch(
        `${API_BASE_URL}/api/v1/loans/${loan.id}`,
        {
          data: { status: 'returned' },
        }
      )

      expect(returnResponse.status()).toBe(200)
      const returned = await returnResponse.json()
      expect(returned.status).toBe('returned')
      expect(returned.returned_at).toBeTruthy()
    }
  )

  multiUserTest(
    'invalid transition: requested -> returned (skipping active)',
    async ({ aliceRequest, bobRequest }) => {
      const item = await createTestItem(aliceRequest, {
        name: uniqueItemName('Skip Active Item'),
      })

      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Skip Active Bubble'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
      await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

      const loanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
        data: {
          item_id: item.id,
          bubble_id: bubble.id,
        },
      })
      const loan = await loanResponse.json()
      expect(loan.status).toBe('requested')

      // Try to go directly to returned (invalid)
      const invalidResponse = await aliceRequest.patch(
        `${API_BASE_URL}/api/v1/loans/${loan.id}`,
        {
          data: { status: 'returned' },
        }
      )

      expect(invalidResponse.status()).toBe(400)
      const body = await invalidResponse.json()
      expect(body.detail).toContain('Invalid status transition')
    }
  )

  multiUserTest(
    'cannot update completed loan (returned or cancelled)',
    async ({ aliceRequest, bobRequest }) => {
      const item = await createTestItem(aliceRequest, {
        name: uniqueItemName('Completed Loan Item'),
      })

      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Completed Loan Bubble'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
      await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

      const loanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
        data: {
          item_id: item.id,
          bubble_id: bubble.id,
        },
      })
      const loan = await loanResponse.json()

      // Approve then return
      await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
        data: { status: 'active' },
      })

      await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${loan.id}`, {
        data: { status: 'returned' },
      })

      // Try to change status of returned loan
      const invalidResponse = await aliceRequest.patch(
        `${API_BASE_URL}/api/v1/loans/${loan.id}`,
        {
          data: { status: 'active' },
        }
      )

      expect(invalidResponse.status()).toBe(400)
      const body = await invalidResponse.json()
      expect(body.detail).toContain("Cannot update loan with status 'returned'")
    }
  )

  multiUserTest(
    'borrower cannot approve loan (only owner can)',
    async ({ aliceRequest, bobRequest }) => {
      const item = await createTestItem(aliceRequest, {
        name: uniqueItemName('Owner Only Approve'),
      })

      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Owner Only Approve Bubble'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
      await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

      const loanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
        data: {
          item_id: item.id,
          bubble_id: bubble.id,
        },
      })
      const loan = await loanResponse.json()

      // Bob (borrower) tries to approve
      const invalidResponse = await bobRequest.patch(
        `${API_BASE_URL}/api/v1/loans/${loan.id}`,
        {
          data: { status: 'active' },
        }
      )

      expect(invalidResponse.status()).toBe(403)
      const body = await invalidResponse.json()
      expect(body.detail).toContain("don't have permission")
    }
  )

  multiUserTest(
    'owner cannot cancel loan (only borrower can)',
    async ({ aliceRequest, bobRequest }) => {
      const item = await createTestItem(aliceRequest, {
        name: uniqueItemName('Borrower Only Cancel'),
      })

      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Borrower Only Cancel Bubble'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
      await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

      const loanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
        data: {
          item_id: item.id,
          bubble_id: bubble.id,
        },
      })
      const loan = await loanResponse.json()

      // Alice (owner) tries to cancel
      const invalidResponse = await aliceRequest.patch(
        `${API_BASE_URL}/api/v1/loans/${loan.id}`,
        {
          data: { status: 'cancelled' },
        }
      )

      expect(invalidResponse.status()).toBe(400)
      const body = await invalidResponse.json()
      expect(body.detail).toContain('Invalid status transition')
    }
  )

  multiUserTest('uninvolved user cannot access loan', async ({
    aliceRequest,
    bobRequest,
    carolRequest,
  }) => {
    const item = await createTestItem(aliceRequest, {
      name: uniqueItemName('Private Loan Item'),
    })

    const bubble = await createTestBubble(aliceRequest, {
      name: uniqueBubbleName('Private Loan Bubble'),
    })

    await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
    // Carol does NOT join
    await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

    const loanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
      data: {
        item_id: item.id,
        bubble_id: bubble.id,
      },
    })
    const loan = await loanResponse.json()

    // Carol tries to view the loan
    const carolGetResponse = await carolRequest.get(
      `${API_BASE_URL}/api/v1/loans/${loan.id}`
    )

    expect(carolGetResponse.status()).toBe(404)

    // Carol tries to update the loan
    const carolPatchResponse = await carolRequest.patch(
      `${API_BASE_URL}/api/v1/loans/${loan.id}`,
      {
        data: { status: 'active' },
      }
    )

    expect(carolPatchResponse.status()).toBe(404)
  })
})

multiUserTest.describe('Loans After Return - Can Borrow Again', () => {
  multiUserTest(
    'can request new loan after previous loan is returned',
    async ({ aliceRequest, bobRequest }) => {
      const item = await createTestItem(aliceRequest, {
        name: uniqueItemName('Re-borrow Item'),
      })

      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Re-borrow Bubble'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
      await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

      // First loan cycle
      const firstLoanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
        data: {
          item_id: item.id,
          bubble_id: bubble.id,
        },
      })
      const firstLoan = await firstLoanResponse.json()

      await aliceRequest.patch(`${API_BASE_URL}/api/v1/loans/${firstLoan.id}`, {
        data: { status: 'active' },
      })

      await bobRequest.patch(`${API_BASE_URL}/api/v1/loans/${firstLoan.id}`, {
        data: { status: 'returned' },
      })

      // Second loan cycle - should work now
      const secondLoanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
        data: {
          item_id: item.id,
          bubble_id: bubble.id,
        },
      })

      expect(secondLoanResponse.status()).toBe(201)
      const secondLoan = await secondLoanResponse.json()
      expect(secondLoan.status).toBe('requested')
    }
  )

  multiUserTest(
    'can request new loan after previous loan is cancelled',
    async ({ aliceRequest, bobRequest }) => {
      const item = await createTestItem(aliceRequest, {
        name: uniqueItemName('Cancel Re-borrow Item'),
      })

      const bubble = await createTestBubble(aliceRequest, {
        name: uniqueBubbleName('Cancel Re-borrow Bubble'),
      })

      await bobRequest.post(`${API_BASE_URL}/api/v1/bubbles/join/${bubble.invite_code}`)
      await shareItemToBubbles(aliceRequest, item.id, [bubble.id])

      // First loan - cancelled
      const firstLoanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
        data: {
          item_id: item.id,
          bubble_id: bubble.id,
        },
      })
      const firstLoan = await firstLoanResponse.json()

      await bobRequest.patch(`${API_BASE_URL}/api/v1/loans/${firstLoan.id}`, {
        data: { status: 'cancelled' },
      })

      // Second loan - should work now
      const secondLoanResponse = await bobRequest.post(`${API_BASE_URL}/api/v1/loans`, {
        data: {
          item_id: item.id,
          bubble_id: bubble.id,
        },
      })

      expect(secondLoanResponse.status()).toBe(201)
    }
  )
})
