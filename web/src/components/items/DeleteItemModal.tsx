import { useState } from 'react'

interface DeleteItemModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => Promise<void>
  itemName: string
  activeLoans: number
}

export default function DeleteItemModal({
  isOpen,
  onClose,
  onDelete,
  itemName,
  activeLoans,
}: DeleteItemModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete()
      onClose()
    } catch (err) {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        {/* Icon */}
        <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-error-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Content */}
        <h2 className="text-lg font-semibold text-neutral-700 text-center mb-2">
          Delete Item?
        </h2>
        <p className="text-sm text-neutral-600 text-center mb-2">
          Are you sure you want to delete <strong>{itemName}</strong>?
        </p>

        {activeLoans > 0 && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-warning-800 text-center">
              <strong>Warning:</strong> This item is currently lent to{' '}
              {activeLoans} {activeLoans === 1 ? 'person' : 'people'}. Deleting
              will remove the lending records.
            </p>
          </div>
        )}

        <p className="text-sm text-neutral-500 text-center mb-6">
          This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full px-6 py-3 bg-error-600 text-white font-medium rounded-lg hover:bg-error-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {isDeleting && (
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
            {isDeleting ? 'Deleting...' : 'Delete Item'}
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="w-full px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
