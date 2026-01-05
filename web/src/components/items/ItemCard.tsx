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
      className="bg-white rounded-lg shadow-sm hover:shadow-md border border-neutral-200 overflow-hidden transition-shadow duration-200 block"
    >
      {/* Placeholder for image - using gradient for now */}
      <div className="aspect-square bg-gradient-to-br from-ocean-100 to-sage-100 relative flex items-center justify-center">
        <div className="absolute top-3 right-3">
          <ItemAvailabilityBadge available={availableQuantity} total={quantity} />
        </div>
        <svg
          className="w-16 h-16 text-neutral-300"
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

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-700 mb-1 truncate">
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
          <div className="pt-2 border-t border-neutral-100">
            <p className="text-xs text-neutral-500 mb-1">Shared to:</p>
            <BubbleSharePills bubbles={sharedBubbles} />
          </div>
        )}
      </div>
    </Link>
  )
}
