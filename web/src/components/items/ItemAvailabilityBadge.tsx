interface ItemAvailabilityBadgeProps {
  available: number
  total: number
}

export default function ItemAvailabilityBadge({ available, total }: ItemAvailabilityBadgeProps) {
  // All available
  if (available === total && total > 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
        Available
      </span>
    )
  }

  // None available
  if (available === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
        All Lent Out
      </span>
    )
  }

  // Partially available
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
      {available} of {total} Available
    </span>
  )
}
