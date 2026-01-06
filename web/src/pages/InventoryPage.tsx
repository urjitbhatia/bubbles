import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth'
import ItemCard from '../components/items/ItemCard'
import AddItemModal from '../components/items/AddItemModal'
import { itemsApi, bubblesApi, type ItemWithShares, type Bubble } from '../lib/api'
import { Spinner } from '../components/ui/Spinner'

// Transformed item type for UI components (camelCase)
interface ItemUI {
  id: string
  name: string
  description?: string | null
  quantity: number
  availableQuantity: number
  sharedBubbles: Array<{ id: string; name: string }>
}

// Transform API response to UI format
function transformItem(item: ItemWithShares): ItemUI {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    quantity: item.quantity,
    availableQuantity: item.available_quantity,
    sharedBubbles: item.shared_bubbles.map(b => ({ id: b.id, name: b.name })),
  }
}

export default function InventoryPage() {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<ItemUI[]>([])
  const [availableBubbles, setAvailableBubbles] = useState<Bubble[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [itemsData, bubblesData] = await Promise.all([
          itemsApi.list(1, 100),
          bubblesApi.list(),
        ])

        setItems(itemsData.items.map(transformItem))
        setAvailableBubbles(bubblesData.bubbles)
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleAddItem = async (newItem: {
    name: string
    description: string
    quantity: number
    bubbleIds: string[]
  }) => {
    // Create the item first
    let createdItem = await itemsApi.create({
      name: newItem.name,
      description: newItem.description || undefined,
      quantity: newItem.quantity,
    })

    // Share to bubbles if any selected
    if (newItem.bubbleIds.length > 0) {
      createdItem = await itemsApi.share(createdItem.id, newItem.bubbleIds)
    }

    // Add to local state
    setItems((prev) => [transformItem(createdItem), ...prev])
  }

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-neutral-900 mb-2">
            My Inventory
          </h1>
          <p className="text-lg text-neutral-600">
            Manage your items and share them with your bubbles
          </p>
        </div>

        {/* Add Item Button - Desktop */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="hidden sm:flex px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700 border border-violet-200'
                  : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
              }`}
              aria-label="Grid view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700 border border-violet-200'
                  : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
              }`}
              aria-label="List view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Add Item Button - Mobile */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="sm:hidden px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-16 h-16 text-violet-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="font-display text-2xl font-bold text-neutral-900 mb-2">
            No Items Yet
          </h3>
          <p className="text-neutral-500 mb-8 max-w-sm">
            Start building your lending library by adding items you're willing to
            share.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Add Your First Item
          </button>
        </div>
      )}

      {/* No Search Results */}
      {!loading && items.length > 0 && filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-1">
            No results for "{searchQuery}"
          </h3>
          <p className="text-sm text-neutral-500 mb-4">
            Try adjusting your search
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-violet-600 hover:text-violet-700 font-medium text-sm"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Items Grid/List */}
      {!loading && filteredItems.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} {...item} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
        availableBubbles={availableBubbles}
      />
    </div>
  )
}
