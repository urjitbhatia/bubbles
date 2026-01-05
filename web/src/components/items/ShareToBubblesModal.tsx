import { useState } from 'react'

interface ShareToBubblesModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (bubbleIds: string[]) => Promise<void>
  availableBubbles: Array<{ id: string; name: string }>
  currentlySharedTo: string[]
  itemName: string
}

export default function ShareToBubblesModal({
  isOpen,
  onClose,
  onSave,
  availableBubbles,
  currentlySharedTo,
  itemName,
}: ShareToBubblesModalProps) {
  const [selectedBubbles, setSelectedBubbles] = useState<string[]>(currentlySharedTo)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const toggleBubble = (bubbleId: string) => {
    setSelectedBubbles((prev) =>
      prev.includes(bubbleId)
        ? prev.filter((id) => id !== bubbleId)
        : [...prev, bubbleId]
    )
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await onSave(selectedBubbles)
      onClose()
    } catch (err) {
      setIsSubmitting(false)
    }
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
                  Share to Bubbles
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {itemName}
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
            <div className="p-6">
              {availableBubbles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-neutral-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-700 mb-1">
                    No Bubbles Yet
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Create or join a bubble to share this item
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-neutral-700">
                    Select bubbles to share this item with:
                  </p>
                  {availableBubbles.map((bubble) => (
                    <div
                      key={bubble.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                      onClick={() => toggleBubble(bubble.id)}
                    >
                      <input
                        type="checkbox"
                        id={`share-bubble-${bubble.id}`}
                        checked={selectedBubbles.includes(bubble.id)}
                        onChange={() => toggleBubble(bubble.id)}
                        className="w-5 h-5 mt-0.5 text-ocean-600 border-neutral-300 rounded focus:ring-2 focus:ring-ocean-500 focus:ring-offset-0 transition-colors duration-200"
                      />
                      <label
                        htmlFor={`share-bubble-${bubble.id}`}
                        className="text-sm text-neutral-700 font-medium cursor-pointer flex-1"
                      >
                        {bubble.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                type="button"
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-ocean-600 text-white font-medium rounded-lg hover:bg-ocean-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                disabled={isSubmitting || availableBubbles.length === 0}
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
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
