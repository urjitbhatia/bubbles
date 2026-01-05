import { useState } from 'react'
import { X } from 'lucide-react'
import InviteLinkCard from './InviteLinkCard'

interface CreateBubbleModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateBubble: (data: { name: string; description?: string }) => Promise<{
    id: string
    inviteCode: string
  } | null>
}

export default function CreateBubbleModal({
  isOpen,
  onClose,
  onCreateBubble,
}: CreateBubbleModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdBubble, setCreatedBubble] = useState<{
    id: string
    inviteCode: string
  } | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError(null)

    try {
      const bubble = await onCreateBubble({
        name: name.trim(),
        description: description.trim() || undefined,
      })

      if (bubble) {
        setCreatedBubble(bubble)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bubble')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setCreatedBubble(null)
    setError(null)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end sm:items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-all">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-semibold text-neutral-700">
                  {createdBubble ? 'Bubble Created!' : 'Create a Bubble'}
                </h2>
                {!createdBubble && (
                  <p className="text-sm text-neutral-500 mt-1">
                    Create a trusted group for sharing items
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {createdBubble ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-success-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-700 mb-1">
                      Your bubble is ready!
                    </h3>
                    <p className="text-sm text-neutral-500 text-center mb-6">
                      Share the invite link below to add members
                    </p>
                  </div>

                  <InviteLinkCard inviteCode={createdBubble.inviteCode} />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name input */}
                  <div className="space-y-2">
                    <label htmlFor="bubble-name" className="block text-sm font-medium text-neutral-700">
                      Bubble Name <span className="text-error-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="bubble-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-colors duration-200"
                      placeholder="e.g., Family Circle, Book Club"
                      required
                      maxLength={100}
                    />
                  </div>

                  {/* Description textarea */}
                  <div className="space-y-2">
                    <label htmlFor="bubble-description" className="block text-sm font-medium text-neutral-700">
                      Description (optional)
                    </label>
                    <textarea
                      id="bubble-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent resize-none"
                      placeholder="Describe what this bubble is for..."
                      maxLength={500}
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="bg-error-50 text-error-800 p-3 rounded-lg text-sm">{error}</div>
                  )}
                </form>
              )}
            </div>

            {/* Footer */}
            {!createdBubble && (
              <div className="flex gap-3 p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-ocean-600 text-white font-medium rounded-lg hover:bg-ocean-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
                  disabled={loading || !name.trim()}
                >
                  {loading && (
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
                  Create Bubble
                </button>
              </div>
            )}

            {createdBubble && (
              <div className="p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl">
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-3 bg-ocean-600 text-white font-medium rounded-lg hover:bg-ocean-700 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
