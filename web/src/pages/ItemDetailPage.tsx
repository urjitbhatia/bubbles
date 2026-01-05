import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import ItemAvailabilityBadge from '../components/items/ItemAvailabilityBadge'
import BubbleSharePills from '../components/items/BubbleSharePills'
import EditItemForm from '../components/items/EditItemForm'
import DeleteItemModal from '../components/items/DeleteItemModal'
import ShareToBubblesModal from '../components/items/ShareToBubblesModal'
import { itemsApi, bubblesApi, loansApi, type ItemWithShares, type Bubble, type LoanWithDetails } from '../lib/api'

// UI types with camelCase
interface ItemUI {
  id: string
  name: string
  description?: string | null
  quantity: number
  availableQuantity: number
  sharedBubbles: Array<{ id: string; name: string }>
  createdAt: string
}

interface LoanHistoryUI {
  id: string
  borrowerName: string
  borrowedDate: string
  returnedDate?: string | null
  status: 'active' | 'returned'
}

// Transform API item to UI format
function transformItem(item: ItemWithShares): ItemUI {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    quantity: item.quantity,
    availableQuantity: item.available_quantity,
    sharedBubbles: item.shared_bubbles.map(b => ({ id: b.id, name: b.name })),
    createdAt: item.created_at,
  }
}

// Transform API loan to UI format
function transformLoan(loan: LoanWithDetails): LoanHistoryUI {
  const status = loan.status === 'active' ? 'active' : 'returned'
  return {
    id: loan.id,
    borrowerName: loan.borrower?.display_name || 'Unknown',
    borrowedDate: loan.lent_at || loan.requested_at,
    returnedDate: loan.returned_at,
    status,
  }
}

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [item, setItem] = useState<ItemUI | null>(null)
  const [loanHistory, setLoanHistory] = useState<LoanHistoryUI[]>([])
  const [availableBubbles, setAvailableBubbles] = useState<Bubble[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details')

  useEffect(() => {
    if (!user || !id) return

    const fetchData = async () => {
      try {
        const [itemData, bubblesData, loansData] = await Promise.all([
          itemsApi.get(id),
          bubblesApi.list(),
          loansApi.list({ asLender: true }),
        ])

        setItem(transformItem(itemData))
        setAvailableBubbles(bubblesData.bubbles)

        // Filter loans for this item and transform
        const itemLoans = loansData.loans
          .filter(loan => loan.item?.id === id)
          .map(transformLoan)
        setLoanHistory(itemLoans)
      } catch (err) {
        console.error('Failed to fetch item:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, id])

  const handleSaveEdit = async (updatedItem: {
    name: string
    description: string
    quantity: number
  }) => {
    if (!id) return

    const updated = await itemsApi.update(id, {
      name: updatedItem.name,
      description: updatedItem.description || undefined,
      quantity: updatedItem.quantity,
    })

    setItem(transformItem(updated))
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!id) return

    await itemsApi.delete(id)
    navigate('/inventory')
  }

  const handleShareToBubbles = async (bubbleIds: string[]) => {
    if (!id) return

    const updated = await itemsApi.share(id, bubbleIds)
    setItem(transformItem(updated))
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-600" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!item) {
    return (
      <div className="max-w-container-md mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-semibold text-neutral-700 mb-2">
          Item Not Found
        </h2>
        <p className="text-neutral-600 mb-6">
          The item you're looking for doesn't exist or has been deleted.
        </p>
        <Link
          to="/inventory"
          className="inline-block px-6 py-3 bg-ocean-600 hover:bg-ocean-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Back to Inventory
        </Link>
      </div>
    )
  }

  const activeLoans = loanHistory.filter((loan) => loan.status === 'active').length

  return (
    <div className="max-w-container-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/inventory"
        className="inline-flex items-center gap-2 text-ocean-600 hover:text-ocean-700 font-medium mb-6 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 rounded"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Inventory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Item Header */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            {!isEditing ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="font-display text-3xl font-bold text-neutral-700 mb-2">
                      {item.name}
                    </h1>
                    <div className="flex items-center gap-3">
                      <ItemAvailabilityBadge
                        available={item.availableQuantity}
                        total={item.quantity}
                      />
                      <span className="text-sm text-neutral-500">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 bg-transparent hover:bg-neutral-100 text-neutral-600 hover:text-neutral-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2"
                      aria-label="Edit item"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="p-2 bg-transparent hover:bg-error-50 text-error-600 hover:text-error-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2"
                      aria-label="Delete item"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-base text-neutral-600 mb-4">
                    {item.description}
                  </p>
                )}

                <div className="text-sm text-neutral-500">
                  Added {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </>
            ) : (
              <EditItemForm
                item={item}
                activeLoans={activeLoans}
                onSave={handleSaveEdit}
                onCancel={() => setIsEditing(false)}
              />
            )}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
            <div className="border-b border-neutral-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 border-b-2 ${
                    activeTab === 'details'
                      ? 'border-ocean-600 text-ocean-700'
                      : 'border-transparent text-neutral-600 hover:text-neutral-700'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 border-b-2 ${
                    activeTab === 'history'
                      ? 'border-ocean-600 text-ocean-700'
                      : 'border-transparent text-neutral-600 hover:text-neutral-700'
                  }`}
                >
                  History
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'details' ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                      Availability
                    </h3>
                    <p className="text-base text-neutral-600">
                      {item.availableQuantity} of {item.quantity} available
                    </p>
                    {activeLoans > 0 && (
                      <p className="text-sm text-neutral-500 mt-1">
                        Currently lent to {activeLoans}{' '}
                        {activeLoans === 1 ? 'person' : 'people'}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                      Shared With
                    </h3>
                    <BubbleSharePills
                      bubbles={item.sharedBubbles}
                      onAdd={() => setIsShareModalOpen(true)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {loanHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-neutral-500">
                        No lending history yet
                      </p>
                    </div>
                  ) : (
                    loanHistory.map((loan) => (
                      <div
                        key={loan.id}
                        className="bg-neutral-50 rounded-lg p-4 border border-neutral-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-700 mb-1">
                              {loan.borrowerName}
                            </h4>
                            <p className="text-sm text-neutral-600">
                              Borrowed:{' '}
                              {new Date(loan.borrowedDate).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </p>
                            {loan.returnedDate && (
                              <p className="text-sm text-neutral-600">
                                Returned:{' '}
                                {new Date(loan.returnedDate).toLocaleDateString(
                                  'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )}
                              </p>
                            )}
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              loan.status === 'active'
                                ? 'bg-warning-100 text-warning-800'
                                : 'bg-success-100 text-success-800'
                            }`}
                          >
                            {loan.status === 'active' ? 'Active' : 'Returned'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-neutral-700 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="w-full px-4 py-3 bg-ocean-50 hover:bg-ocean-100 text-ocean-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 text-left flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Manage Sharing
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 text-left flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Item
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full px-4 py-3 bg-error-50 hover:bg-error-100 text-error-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2 text-left flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteItemModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        itemName={item.name}
        activeLoans={activeLoans}
      />

      <ShareToBubblesModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSave={handleShareToBubbles}
        availableBubbles={availableBubbles}
        currentlySharedTo={item.sharedBubbles.map((b) => b.id)}
        itemName={item.name}
      />
    </div>
  )
}
