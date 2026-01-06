import { Link } from '@tanstack/react-router'
import ItemAvailabilityBadge from './ItemAvailabilityBadge'
import BubbleSharePills from './BubbleSharePills'

interface ItemCardProps {
  id: string
  name: string
  description?: string | null
  quantity: number
  availableQuantity: number
  sharedBubbles: Array<{ id: string; name: string }>
}

export default function ItemCard({
  id,
  name,
  description,
  quantity,
  availableQuantity,
  sharedBubbles,
}: ItemCardProps) {
  return (
    <Link
      to="/items/$id"
      params={{ id }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-neutral-200 hover:border-violet-200 overflow-hidden transition-all duration-300 block"
    >
      {/* Placeholder for image - using gradient for now */}
      <div className="aspect-square bg-gradient-to-br from-violet-50 via-fuchsia-50 to-mint-50 relative flex items-center justify-center overflow-hidden">
        <div className="absolute top-3 right-3">
          <ItemAvailabilityBadge available={availableQuantity} total={quantity} />
        </div>
        {/* Decorative orbs */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-violet-200/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-fuchsia-200/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          <svg
            className="w-16 h-16 text-violet-300 group-hover:text-violet-400 group-hover:scale-110 transition-all duration-300"
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
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-neutral-900 mb-1 truncate group-hover:text-violet-700 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-neutral-500 mb-3">
          Quantity: {quantity}
        </p>
        {description && (
          <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Shared bubbles */}
        {sharedBubbles.length > 0 && (
          <div className="pt-3 border-t border-neutral-100">
            <p className="text-xs text-neutral-500 mb-1.5">Shared to:</p>
            <BubbleSharePills bubbles={sharedBubbles} />
          </div>
        )}
      </div>
    </Link>
  )
}
