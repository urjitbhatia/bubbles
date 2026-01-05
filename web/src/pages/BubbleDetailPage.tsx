import { useState, useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../lib/auth'
import {
  ArrowLeft,
  Settings,
  LogOut,
  Trash2,
  Users as UsersIcon,
  Package,
  Loader2,
} from 'lucide-react'
import InviteLinkCard from '../components/bubbles/InviteLinkCard'
import MemberList from '../components/bubbles/MemberList'
import ManageMembersModal from '../components/bubbles/ManageMembersModal'
import DeleteBubbleModal from '../components/bubbles/DeleteBubbleModal'
import { bubblesApi, type BubbleWithMembers } from '../lib/api'

// UI types
interface BubbleUI {
  id: string
  name: string
  description: string
  inviteCode: string
  members: Array<{ id: string; name: string; role: 'admin' | 'member' }>
  items: unknown[]
}

// Transform API bubble to UI format
function transformBubble(bubble: BubbleWithMembers): BubbleUI {
  return {
    id: bubble.id,
    name: bubble.name,
    description: bubble.description || '',
    inviteCode: bubble.invite_code,
    members: bubble.members?.map(m => ({
      id: m.id,
      name: m.display_name,
      role: m.role as 'admin' | 'member',
    })) || [],
    items: [], // Items shared to bubble - TODO: add API for this
  }
}

export default function BubbleDetailPage() {
  const { id } = useParams({ from: '/_protected/bubbles/$id' })
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [bubble, setBubble] = useState<BubbleUI | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showManageMembers, setShowManageMembers] = useState(false)
  const [showDeleteBubble, setShowDeleteBubble] = useState(false)
  const [activeTab, setActiveTab] = useState<'members' | 'items'>('members')

  const currentUserMember = bubble?.members.find((m) => m.id === user?.id)
  const isAdmin = currentUserMember?.role === 'admin'

  useEffect(() => {
    if (!user || !id) return

    async function fetchBubble() {
      setLoading(true)
      try {
        const data = await bubblesApi.get(id!)
        setBubble(transformBubble(data))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchBubble()
  }, [user, id])

  const handleLeaveBubble = async () => {
    if (!bubble || !id || !user) return
    if (!confirm(`Are you sure you want to leave ${bubble.name}?`)) return

    await bubblesApi.removeMember(id, user.id)
    navigate({ to: '/bubbles' })
  }

  const handleDeleteBubble = async () => {
    if (!id) return

    await bubblesApi.delete(id)
    navigate({ to: '/bubbles' })
  }

  const handlePromoteToAdmin = async (userId: string) => {
    if (!bubble || !id) return

    await bubblesApi.updateMemberRole(id, userId, 'admin')

    setBubble({
      ...bubble,
      members: bubble.members.map((m) => (m.id === userId ? { ...m, role: 'admin' as const } : m)),
    })
  }

  const handleRemoveMember = async (userId: string) => {
    if (!bubble || !id) return

    await bubblesApi.removeMember(id, userId)

    setBubble({
      ...bubble,
      members: bubble.members.filter((m) => m.id !== userId),
    })
  }

  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-ocean-600" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-ocean-600" />
      </div>
    )
  }

  if (!bubble) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-2xl font-semibold text-neutral-700 mb-2">Bubble Not Found</h2>
        <p className="text-neutral-600 mb-6">The bubble you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate({ to: '/bubbles' })}
          className="px-6 py-3 bg-ocean-600 hover:bg-ocean-700 text-white font-medium rounded-lg"
        >
          Back to Bubbles
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate({ to: '/bubbles' })}
          className="inline-flex items-center gap-2 text-ocean-600 hover:text-ocean-700 font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bubbles
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-error-50 text-error-800 p-4 rounded-lg mb-6">{error}</div>
      )}

      {/* Bubble header */}
      <div className="bg-gradient-to-br from-ocean-50 via-white to-sage-50 rounded-xl p-6 md:p-8 shadow-sm border-2 border-ocean-200 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-neutral-700 mb-2">{bubble.name}</h1>
            {bubble.description && (
              <p className="text-neutral-600 mb-4">{bubble.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <span className="inline-flex items-center gap-1">
                <UsersIcon className="w-4 h-4" />
                {bubble.members.length} {bubble.members.length === 1 ? 'member' : 'members'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Package className="w-4 h-4" />
                {bubble.items.length} {bubble.items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          {/* Bubble icon */}
          <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-8 h-8 text-ocean-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2" />
              <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Invite link */}
      <div className="mb-6">
        <InviteLinkCard inviteCode={bubble.inviteCode} />
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'members'
                ? 'border-ocean-600 text-ocean-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Members ({bubble.members.length})
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'items'
                ? 'border-ocean-600 text-ocean-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Items ({bubble.items.length})
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
        {activeTab === 'members' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-700">Members</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowManageMembers(true)}
                  className="text-sm text-ocean-600 hover:text-ocean-700 font-medium inline-flex items-center gap-1"
                >
                  <Settings className="w-4 h-4" />
                  Manage
                </button>
              )}
            </div>
            <MemberList members={bubble.members} currentUserId={user?.id} />
          </>
        )}

        {activeTab === 'items' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-1">No Items Yet</h3>
            <p className="text-sm text-neutral-500">
              Items shared to this bubble will appear here
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-700 mb-4">Actions</h3>
        <div className="space-y-3">
          <button
            onClick={handleLeaveBubble}
            className="w-full px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Leave Bubble
          </button>

          {isAdmin && (
            <button
              onClick={() => setShowDeleteBubble(true)}
              className="w-full px-6 py-3 bg-error-50 border-2 border-error-200 text-error-700 font-medium rounded-lg hover:bg-error-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete Bubble
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      <ManageMembersModal
        isOpen={showManageMembers}
        members={bubble.members}
        currentUserId={user?.id || ''}
        onClose={() => setShowManageMembers(false)}
        onPromoteToAdmin={handlePromoteToAdmin}
        onRemoveMember={handleRemoveMember}
      />

      <DeleteBubbleModal
        isOpen={showDeleteBubble}
        bubbleName={bubble.name}
        onClose={() => setShowDeleteBubble(false)}
        onConfirm={handleDeleteBubble}
      />
    </div>
  )
}
