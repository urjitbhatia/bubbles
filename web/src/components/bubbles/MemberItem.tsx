import { Crown, MoreVertical } from 'lucide-react'

interface MemberItemProps {
  id: string
  name: string
  avatar?: string
  role: 'admin' | 'member'
  isCurrentUser?: boolean
  onPromoteToAdmin?: (userId: string) => void
  onRemoveMember?: (userId: string) => void
  canManage?: boolean
}

export default function MemberItem({
  id: _id,
  name,
  avatar,
  role,
  isCurrentUser = false,
  onPromoteToAdmin: _onPromoteToAdmin,
  onRemoveMember: _onRemoveMember,
  canManage = false,
}: MemberItemProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-ocean-100 flex items-center justify-center text-sm font-medium text-ocean-700 flex-shrink-0">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>

      {/* Name and role */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-neutral-700 truncate">
            {name}
            {isCurrentUser && <span className="text-neutral-500 text-sm ml-1">(you)</span>}
          </p>
          {role === 'admin' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-coral-100 text-coral-800">
              <Crown className="w-3 h-3" />
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      {canManage && !isCurrentUser && (
        <div className="relative">
          <button
            className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="Member options"
          >
            <MoreVertical className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      )}
    </div>
  )
}
