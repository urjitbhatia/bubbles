interface BubbleSharePillsProps {
  bubbles: Array<{ id: string; name: string }>
  onAdd?: () => void
}

export default function BubbleSharePills({ bubbles, onAdd }: BubbleSharePillsProps) {
  if (bubbles.length === 0 && !onAdd) {
    return (
      <p className="text-sm text-neutral-500">
        Not shared to any bubbles
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-ocean-100 text-ocean-800"
        >
          {bubble.name}
        </span>
      ))}
      {onAdd && (
        <button
          onClick={onAdd}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors duration-200"
        >
          + Add Bubble
        </button>
      )}
    </div>
  )
}
