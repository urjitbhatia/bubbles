import { useState } from 'react'

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (item: {
    name: string
    description: string
    quantity: number
    bubbleIds: string[]
  }) => Promise<void>
  availableBubbles: Array<{ id: string; name: string }>
}

export default function AddItemModal({
  isOpen,
  onClose,
  onAdd,
  availableBubbles,
}: AddItemModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedBubbles, setSelectedBubbles] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Item name is required')
      return
    }

    if (quantity < 1) {
      setError('Quantity must be at least 1')
      return
    }

    setIsSubmitting(true)
    try {
      await onAdd({
        name: name.trim(),
        description: description.trim(),
        quantity,
        bubbleIds: selectedBubbles,
      })
      // Reset form
      setName('')
      setDescription('')
      setQuantity(1)
      setSelectedBubbles([])
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleBubble = (bubbleId: string) => {
    setSelectedBubbles((prev) =>
      prev.includes(bubbleId)
        ? prev.filter((id) => id !== bubbleId)
        : [...prev, bubbleId]
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end sm:items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-all">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-semibold text-neutral-700">
                  Add New Item
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Add an item to your inventory
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-error-50 text-error-800 p-3 rounded text-sm flex items-start gap-2">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="item-name"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Item Name <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  id="item-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-colors duration-200"
                  placeholder="e.g., Mountain Bike"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent resize-none"
                  placeholder="Describe your item..."
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  min="1"
                  className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-colors duration-200"
                />
                <p className="text-xs text-neutral-500">
                  How many of this item do you have?
                </p>
              </div>

              {/* Share to Bubbles */}
              {availableBubbles.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Share to Bubbles (optional)
                  </label>
                  <div className="space-y-2">
                    {availableBubbles.map((bubble) => (
                      <div key={bubble.id} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={`bubble-${bubble.id}`}
                          checked={selectedBubbles.includes(bubble.id)}
                          onChange={() => toggleBubble(bubble.id)}
                          className="w-5 h-5 mt-0.5 text-ocean-600 border-neutral-300 rounded focus:ring-2 focus:ring-ocean-500 focus:ring-offset-0 transition-colors duration-200"
                        />
                        <label
                          htmlFor={`bubble-${bubble.id}`}
                          className="text-sm text-neutral-600 cursor-pointer"
                        >
                          {bubble.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-ocean-600 text-white font-medium rounded-lg hover:bg-ocean-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {isSubmitting ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
