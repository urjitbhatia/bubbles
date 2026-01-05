import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Plus, Loader2 } from 'lucide-react'
import BubbleCard from '../components/bubbles/BubbleCard'
import CreateBubbleModal from '../components/bubbles/CreateBubbleModal'
import { bubblesApi, type Bubble } from '../lib/api'

// UI type for bubbles
interface BubbleUI {
  id: string
  name: string
  description: string
  memberCount: number
  itemCount: number
  members: Array<{ id: string; name: string; avatar?: string }>
}

// Transform API bubble to UI format
function transformBubble(bubble: Bubble): BubbleUI {
  return {
    id: bubble.id,
    name: bubble.name,
    description: bubble.description || '',
    memberCount: 0, // Will be fetched from detail endpoint if needed
    itemCount: 0,   // Will be fetched from detail endpoint if needed
    members: [],    // Will be populated from BubbleWithMembers if needed
  }
}

export default function BubblesListPage() {
  const { user, loading: authLoading } = useAuth()
  const [bubbles, setBubbles] = useState<BubbleUI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (!user) return

    async function fetchBubbles() {
      setLoading(true)
      try {
        const data = await bubblesApi.list()
        setBubbles(data.bubbles.map(transformBubble))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchBubbles()
  }, [user])

  const handleCreateBubble = async (data: { name: string; description?: string }) => {
    const created = await bubblesApi.create({
      name: data.name,
      description: data.description,
    })

    // Transform and add to list
    const newBubble: BubbleUI = {
      id: created.id,
      name: created.name,
      description: created.description || '',
      memberCount: created.members?.length || 1,
      itemCount: 0,
      members: created.members?.map(m => ({
        id: m.id,
        name: m.display_name,
        avatar: m.avatar_url || undefined,
      })) || [],
    }

    setBubbles([...bubbles, newBubble])

    return {
      id: created.id,
      inviteCode: created.invite_code,
    }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-ocean-600" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-700">My Bubbles</h1>
          <p className="text-neutral-500 mt-2">
            Trusted groups for sharing items with friends and family
          </p>
        </div>

        {/* Create bubble button - desktop */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="hidden sm:flex items-center gap-2 px-6 py-3 bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2"
        >
          <Plus className="w-5 h-5" />
          Create Bubble
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-error-50 text-error-800 p-4 rounded-lg mb-6">{error}</div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-ocean-600" />
        </div>
      )}

      {/* Empty state */}
      {!loading && bubbles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-ocean-100 to-sage-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-16 h-16 text-ocean-300"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2" />
              <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">No Bubbles Yet</h3>
          <p className="text-neutral-500 mb-6 max-w-sm">
            Create your first bubble to start sharing items with your trusted circle
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-ocean-600 hover:bg-ocean-700 text-white font-medium rounded-lg inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Your First Bubble
          </button>
        </div>
      )}

      {/* Bubbles grid */}
      {!loading && bubbles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bubbles.map((bubble) => (
            <BubbleCard
              key={bubble.id}
              id={bubble.id}
              name={bubble.name}
              description={bubble.description}
              memberCount={bubble.memberCount}
              itemCount={bubble.itemCount}
              members={bubble.members}
            />
          ))}
        </div>
      )}

      {/* Floating action button - mobile */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="sm:hidden fixed bottom-20 right-6 w-14 h-14 bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 flex items-center justify-center z-30"
        aria-label="Create bubble"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create bubble modal */}
      <CreateBubbleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateBubble={handleCreateBubble}
      />
    </div>
  )
}
