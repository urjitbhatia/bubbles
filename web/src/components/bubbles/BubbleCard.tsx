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
      <div className="relative bg-gradient-to-br from-ocean-50 via-white to-sage-50 rounded-xl p-6 shadow-sm hover:shadow-md border-2 border-ocean-200 hover:border-ocean-300 transition-all duration-200 cursor-pointer">
        {/* Decorative background bubbles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-ocean-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-sage-100 rounded-full opacity-20"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-neutral-700 mb-1">
                {name}
              </h3>
              <p className="text-sm text-neutral-500">
                {memberCount} {memberCount === 1 ? 'member' : 'members'} · {itemCount}{' '}
                {itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            {/* Bubble icon */}
            <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-ocean-600"
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
                  className="w-8 h-8 rounded-full border-2 border-white bg-ocean-100 flex items-center justify-center text-xs font-medium text-ocean-700"
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
                <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center text-xs font-medium text-neutral-600">
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
