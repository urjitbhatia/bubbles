import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { useAuth } from '../lib/auth'
import { ArrowLeft, Pencil, Trash2, Share2, Loader2, Package } from 'lucide-react'
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
  const { id } = useParams({ from: '/_protected/items/$id' })
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
    navigate({ to: '/inventory' })
  }

  const handleShareToBubbles = async (bubbleIds: string[]) => {
    if (!id) return

    const updated = await itemsApi.share(id, bubbleIds)
    setItem(transformItem(updated))
  }

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    )
  }

  // Auth is handled by ProtectedLayout, so no need to check here

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-violet-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">
          Item Not Found
        </h2>
        <p className="text-neutral-600 mb-6">
          The item you're looking for doesn't exist or has been deleted.
        </p>
        <Link
          to="/inventory"
          className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
        >
          Back to Inventory
        </Link>
      </div>
    )
  }

  const activeLoans = loanHistory.filter((loan) => loan.status === 'active').length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with back button */}
      <div>
        <button
          onClick={() => navigate({ to: '/inventory' })}
          className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Item Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            {/* Gradient header - violet theme for items */}
            <div className="relative h-24 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-violet-600">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
            </div>

            <div className="px-6 pb-6 -mt-6 relative">
              {!isEditing ? (
                <>
                  <div className="flex items-start gap-4">
                    {/* Item icon */}
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0 border-4 border-white">
                      <Package className="w-8 h-8 text-violet-500" />
                    </div>

                    <div className="flex-1 pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h1 className="font-display text-2xl font-bold text-neutral-900 mb-2">
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
                            className="p-2 bg-violet-50 hover:bg-violet-100 text-violet-600 hover:text-violet-700 rounded-xl transition-colors duration-200"
                            aria-label="Edit item"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="p-2 bg-error-50 hover:bg-error-100 text-error-600 hover:text-error-700 rounded-xl transition-colors duration-200"
                            aria-label="Delete item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-base text-neutral-600 mt-4 ml-20">
                      {item.description}
                    </p>
                  )}

                  <div className="text-sm text-neutral-500 mt-4 ml-20">
                    Added {new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </>
              ) : (
                <div className="pt-8">
                  <EditItemForm
                    item={item}
                    activeLoans={activeLoans}
                    onSave={handleSaveEdit}
                    onCancel={() => setIsEditing(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="border-b border-neutral-200 px-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === 'details'
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === 'history'
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  History ({loanHistory.length})
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
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-neutral-400" />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-1">No Lending History</h3>
                      <p className="text-sm text-neutral-500">
                        Loans for this item will appear here
                      </p>
                    </div>
                  ) : (
                    loanHistory.map((loan) => (
                      <div
                        key={loan.id}
                        className="bg-gradient-to-br from-neutral-50 to-white rounded-xl p-4 border border-neutral-200 hover:border-violet-200 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-900 mb-1">
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
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              loan.status === 'active'
                                ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700'
                                : 'bg-gradient-to-r from-emerald-100 to-mint-100 text-emerald-700'
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
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sticky top-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-violet-50 to-fuchsia-50 hover:from-violet-100 hover:to-fuchsia-100 text-violet-700 font-medium rounded-xl transition-colors duration-200 text-left flex items-center gap-3 border border-violet-100 hover:border-violet-200"
              >
                <Share2 className="w-5 h-5" />
                Manage Sharing
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-medium rounded-xl transition-colors duration-200 text-left flex items-center gap-3 border border-neutral-200 hover:border-neutral-300"
              >
                <Pencil className="w-5 h-5" />
                Edit Item
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full px-4 py-3 bg-error-50 hover:bg-error-100 text-error-700 font-medium rounded-xl transition-colors duration-200 text-left flex items-center gap-3 border border-error-200 hover:border-error-300"
              >
                <Trash2 className="w-5 h-5" />
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
