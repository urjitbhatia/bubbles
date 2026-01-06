import { Link } from '@tanstack/react-router'

interface BubbleCardProps {
  id: string
  name: string
  description?: string
  memberCount: number
  itemCount: number
  members?: Array<{
    id: string
    name: string
    avatar?: string
  }>
}

export default function BubbleCard({
  id,
  name,
  description,
  memberCount,
  itemCount,
  members = [],
}: BubbleCardProps) {
  const displayMembers = members.slice(0, 3)
  const extraCount = Math.max(0, memberCount - 3)

  return (
    <Link to="/bubbles/$id" params={{ id }}>
      <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-neutral-200 hover:border-fuchsia-200 transition-all duration-300 cursor-pointer overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-fuchsia-200 to-violet-200 rounded-full opacity-0 group-hover:opacity-50 blur-2xl transition-opacity duration-300" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-mint-200 to-fuchsia-200 rounded-full opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-300" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-fuchsia-700 transition-colors">
                {name}
              </h3>
              <p className="text-sm text-neutral-500">
                {memberCount} {memberCount === 1 ? 'member' : 'members'} · {itemCount}{' '}
                {itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            {/* Bubble icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-100 to-mint-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-fuchsia-600"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2" />
                <circle
                  cx="15"
                  cy="10"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <circle
                  cx="12"
                  cy="15"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.4"
                />
              </svg>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{description}</p>
          )}

          {/* Member avatars */}
          {displayMembers.length > 0 && (
            <div className="flex -space-x-2">
              {displayMembers.map((member) => (
                <div
                  key={member.id}
                  className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-fuchsia-100 to-violet-100 flex items-center justify-center text-xs font-semibold text-fuchsia-700"
                  title={member.name}
                >
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
              ))}
              {extraCount > 0 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-600">
                  +{extraCount}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
