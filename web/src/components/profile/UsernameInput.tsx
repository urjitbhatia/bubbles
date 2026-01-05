import { useState, useEffect, InputHTMLAttributes, forwardRef } from 'react'
import { Check, X, Loader2 } from 'lucide-react'

interface UsernameInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onAvailabilityChange?: (available: boolean) => void
}

export const UsernameInput = forwardRef<HTMLInputElement, UsernameInputProps>(
  ({ value, onChange, onAvailabilityChange, ...props }, ref) => {
    const [checking, setChecking] = useState(false)
    const [available, setAvailable] = useState<boolean | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
      const username = value as string
      if (!username || username.length < 3) {
        setAvailable(null)
        setError('')
        onAvailabilityChange?.(false)
        return
      }

      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9_-]+$/
      if (!usernameRegex.test(username)) {
        setAvailable(false)
        setError('Username can only contain letters, numbers, hyphens, and underscores')
        onAvailabilityChange?.(false)
        return
      }

      // Debounce the availability check
      const timeoutId = setTimeout(async () => {
        setChecking(true)
        setError('')
        try {
          // TODO: Wire up to actual API endpoint
          // const response = await fetch(`/api/users/check-username?username=${username}`)
          // const data = await response.json()
          // const isAvailable = data.available

          // Mock for now - simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500))
          // Mock: username is available if it doesn't contain 'admin' or 'test'
          const isAvailable = !username.toLowerCase().includes('admin') &&
                             !username.toLowerCase().includes('test')

          setAvailable(isAvailable)
          if (!isAvailable) {
            setError('This username is already taken')
          }
          onAvailabilityChange?.(isAvailable)
        } catch (err) {
          console.error('Error checking username availability:', err)
          setError('Could not check username availability')
          setAvailable(null)
          onAvailabilityChange?.(false)
        } finally {
          setChecking(false)
        }
      }, 500)

      return () => clearTimeout(timeoutId)
    }, [value, onAvailabilityChange])

    const getStatusIcon = () => {
      if (!value || (value as string).length < 3) return null
      if (checking) return <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
      if (error || available === false) return <X className="w-5 h-5 text-error-500" />
      if (available) return <Check className="w-5 h-5 text-success-500" />
      return null
    }

    const getBorderColor = () => {
      if (!value || (value as string).length < 3) return 'border-neutral-300'
      if (error || available === false) return 'border-error-500'
      if (available) return 'border-success-500'
      return 'border-neutral-300'
    }

    return (
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-neutral-700">
          Username (optional)
        </label>
        <div className="relative">
          <input
            ref={ref}
            id="username"
            type="text"
            value={value}
            onChange={onChange}
            className={`
              w-full px-4 py-3 pr-12
              bg-white
              border ${getBorderColor()}
              rounded-lg
              text-neutral-700 placeholder:text-neutral-400
              focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent
              disabled:bg-neutral-100 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
            placeholder="john_doe"
            minLength={3}
            maxLength={30}
            {...props}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getStatusIcon()}
          </div>
        </div>
        {error && (
          <p className="text-sm text-error-600 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {!error && value && (value as string).length >= 3 && available && (
          <p className="text-sm text-success-600 flex items-center gap-1">
            <Check className="w-4 h-4" />
            Username is available
          </p>
        )}
        <p className="text-xs text-neutral-500">
          Choose a unique username that others can use to find you
        </p>
      </div>
    )
  }
)

UsernameInput.displayName = 'UsernameInput'
