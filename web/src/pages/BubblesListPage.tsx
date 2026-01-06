import { useState, useEffect } from 'react'
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
        <Loader2 className="w-8 h-8 animate-spin text-fuchsia-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-neutral-900 mb-2">My Bubbles</h1>
          <p className="text-lg text-neutral-600">
            Trusted groups for sharing items with friends and family
          </p>
        </div>

        {/* Create bubble button - desktop */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-mint-600 hover:from-fuchsia-700 hover:to-mint-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Create Bubble
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-error-50 text-error-800 p-4 rounded-xl border border-error-200">{error}</div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-fuchsia-600" />
        </div>
      )}

      {/* Empty state */}
      {!loading && bubbles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-fuchsia-100 to-mint-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-16 h-16 text-fuchsia-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2" />
              <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            </svg>
          </div>
          <h3 className="font-display text-2xl font-bold text-neutral-900 mb-2">No Bubbles Yet</h3>
          <p className="text-neutral-500 mb-8 max-w-sm">
            Create your first bubble to start sharing items with your trusted circle
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-mint-600 hover:from-fuchsia-700 hover:to-mint-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
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
        className="sm:hidden fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-mint-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 flex items-center justify-center z-30"
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
