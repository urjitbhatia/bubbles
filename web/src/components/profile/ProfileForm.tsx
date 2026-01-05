import { useState, FormEvent } from 'react'
import { Save, X } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { UsernameInput } from './UsernameInput'

interface ProfileData {
  displayName: string
  username?: string
  avatarUrl?: string
}

interface ProfileFormProps {
  initialData?: ProfileData
  onSave: (data: ProfileData) => Promise<void>
  onCancel?: () => void
  isSetup?: boolean
}

export function ProfileForm({
  initialData = { displayName: '', username: '' },
  onSave,
  onCancel,
  isSetup = false
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialData.displayName)
  const [username, setUsername] = useState(initialData.username || '')
  const [usernameAvailable, setUsernameAvailable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!displayName.trim()) {
      setError('Display name is required')
      return
    }

    if (username && username.length > 0 && username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (username && !usernameAvailable) {
      setError('Please choose an available username or leave it empty')
      return
    }

    setLoading(true)
    try {
      await onSave({
        displayName: displayName.trim(),
        username: username.trim() || undefined,
        avatarUrl: initialData.avatarUrl
      })
    } catch (err) {
      console.error('Error saving profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-800">{error}</p>
        </div>
      )}

      <Input
        label="Display Name"
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="John Doe"
        required
        disabled={loading}
        helperText="This is how your name will appear to others"
      />

      <UsernameInput
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onAvailabilityChange={setUsernameAvailable}
        disabled={loading}
      />

      {isSetup && !username && (
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <p className="text-sm text-neutral-600">
            You can skip setting a username for now and add it later from your profile settings.
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        {onCancel && !isSetup && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            <X className="w-5 h-5" />
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={!displayName.trim() || loading}
          className={onCancel && !isSetup ? 'flex-1' : 'w-full'}
        >
          <Save className="w-5 h-5" />
          {isSetup ? 'Continue' : 'Save Changes'}
        </Button>
      </div>

      {isSetup && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => onSave({ displayName: displayName.trim() })}
            className="text-sm text-neutral-500 hover:text-neutral-700 underline"
            disabled={loading || !displayName.trim()}
          >
            Skip username for now
          </button>
        </div>
      )}
    </form>
  )
}
