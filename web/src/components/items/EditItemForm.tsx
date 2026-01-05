import { useState } from 'react'

interface EditItemFormProps {
  item: {
    id: string
    name: string
    description?: string | null
    quantity: number
  }
  activeLoans: number
  onSave: (item: {
    name: string
    description: string
    quantity: number
  }) => Promise<void>
  onCancel: () => void
}

export default function EditItemForm({
  item,
  activeLoans,
  onSave,
  onCancel,
}: EditItemFormProps) {
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description || '')
  const [quantity, setQuantity] = useState(item.quantity)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

    if (quantity < activeLoans) {
      setError(
        `Cannot reduce quantity below ${activeLoans} (currently lent out)`
      )
      return
    }

    setIsSubmitting(true)
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        quantity,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item')
      setIsSubmitting(false)
    }
  }

  const showQuantityWarning = quantity < item.quantity && activeLoans > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          htmlFor="edit-item-name"
          className="block text-sm font-medium text-neutral-700"
        >
          Item Name <span className="text-error-600">*</span>
        </label>
        <input
          type="text"
          id="edit-item-name"
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
          htmlFor="edit-description"
          className="block text-sm font-medium text-neutral-700"
        >
          Description
        </label>
        <textarea
          id="edit-description"
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
          htmlFor="edit-quantity"
          className="block text-sm font-medium text-neutral-700"
        >
          Quantity
        </label>
        <input
          type="number"
          id="edit-quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          min={activeLoans}
          className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-700 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-colors duration-200"
        />
        {showQuantityWarning && (
          <div className="bg-warning-50 text-warning-800 p-3 rounded text-sm flex items-start gap-2">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              {activeLoans} {activeLoans === 1 ? 'copy is' : 'copies are'}{' '}
              currently lent out
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-white border-2 border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
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
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
