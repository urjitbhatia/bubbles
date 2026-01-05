import { useState } from 'react'
import { X, Crown, UserMinus, AlertTriangle } from 'lucide-react'

interface Member {
  id: string
  name: string
  avatar?: string
  role: 'admin' | 'member'
}

interface ManageMembersModalProps {
  isOpen: boolean
  members: Member[]
  currentUserId: string
  onClose: () => void
  onPromoteToAdmin: (userId: string) => Promise<void>
  onRemoveMember: (userId: string) => Promise<void>
}

export default function ManageMembersModal({
  isOpen,
  members,
  currentUserId,
  onClose,
  onPromoteToAdmin,
  onRemoveMember,
}: ManageMembersModalProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)

  if (!isOpen) return null

  const handlePromote = async (userId: string) => {
    setLoading(userId)
    setError(null)

    try {
      await onPromoteToAdmin(userId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to promote member')
    } finally {
      setLoading(null)
    }
  }

  const handleRemove = async (userId: string) => {
    setLoading(userId)
    setError(null)

    try {
      await onRemoveMember(userId)
      setConfirmRemove(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member')
    } finally {
      setLoading(null)
    }
  }

  // Sort admins first
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === 'admin' && b.role !== 'admin') return -1
    if (a.role !== 'admin' && b.role === 'admin') return 1
    return 0
  })

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end sm:items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-all">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-semibold text-neutral-700">Manage Members</h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {members.length} {members.length === 1 ? 'member' : 'members'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {error && (
                <div className="bg-error-50 text-error-800 p-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {sortedMembers.map((member) => {
                  const isCurrentUser = member.id === currentUserId

                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-ocean-100 flex items-center justify-center text-sm font-medium text-ocean-700 flex-shrink-0">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          member.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      {/* Name and role */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-700 truncate">
                          {member.name}
                          {isCurrentUser && (
                            <span className="text-neutral-500 text-sm ml-1">(you)</span>
                          )}
                        </p>
                        {member.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 text-xs text-coral-700">
                            <Crown className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      {!isCurrentUser && (
                        <div className="flex gap-2">
                          {member.role === 'member' && (
                            <button
                              onClick={() => handlePromote(member.id)}
                              disabled={loading === member.id}
                              className="px-3 py-1.5 text-xs font-medium bg-ocean-100 hover:bg-ocean-200 text-ocean-700 rounded-md transition-colors disabled:opacity-50"
                              title="Promote to admin"
                            >
                              <Crown className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmRemove(member.id)}
                            disabled={loading === member.id}
                            className="px-3 py-1.5 text-xs font-medium bg-error-100 hover:bg-error-200 text-error-700 rounded-md transition-colors disabled:opacity-50"
                            title="Remove member"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation dialog for remove */}
      {confirmRemove && (
        <>
          <div
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-[60]"
            onClick={() => setConfirmRemove(null)}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
              <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-error-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-700 text-center mb-2">
                Remove Member?
              </h3>
              <p className="text-sm text-neutral-600 text-center mb-6">
                Are you sure you want to remove{' '}
                <strong>{members.find((m) => m.id === confirmRemove)?.name}</strong> from this
                bubble?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleRemove(confirmRemove)}
                  disabled={loading === confirmRemove}
                  className="w-full px-6 py-3 bg-error-600 text-white font-medium rounded-lg hover:bg-error-700 disabled:opacity-50 transition-colors"
                >
                  Remove Member
                </button>
                <button
                  onClick={() => setConfirmRemove(null)}
                  disabled={loading === confirmRemove}
                  className="w-full px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
