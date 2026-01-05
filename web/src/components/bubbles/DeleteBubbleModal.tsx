import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

interface DeleteBubbleModalProps {
  isOpen: boolean
  bubbleName: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function DeleteBubbleModal({
  isOpen,
  bubbleName,
  onClose,
  onConfirm,
}: DeleteBubbleModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)

    try {
      await onConfirm()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete bubble')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
          {/* Icon */}
          <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-error-600" />
          </div>

          {/* Content */}
          <h2 className="text-lg font-semibold text-neutral-700 text-center mb-2">
            Delete Bubble?
          </h2>
          <p className="text-sm text-neutral-600 text-center mb-6">
            Are you sure you want to delete <strong>{bubbleName}</strong>? This will remove all
            members and cannot be undone.
          </p>

          {/* Error message */}
          {error && (
            <div className="bg-error-50 text-error-800 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full px-6 py-3 bg-error-600 text-white font-medium rounded-lg hover:bg-error-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
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
              Delete Bubble
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
