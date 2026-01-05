import { useState, FormEvent } from 'react'
import { Mail } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { supabase } from '../../lib/supabase'

interface MagicLinkFormProps {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

const isDev = import.meta.env.DEV

export function MagicLinkForm({ onSuccess, onError }: MagicLinkFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [usePassword, setUsePassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      if (usePassword && password) {
        // Password login (for dev/seed users)
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        onSuccess?.()
      } else {
        // Magic link login
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        if (error) throw error
        setSent(true)
        // Don't call onSuccess here - user isn't authenticated yet
        // They need to click the magic link in their email first
      }
    } catch (err) {
      console.error('Auth error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Mail className="w-5 h-5 text-success-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-success-800 mb-1">
                Check your email
              </h3>
              <p className="text-sm text-success-700">
                We sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            setSent(false)
            setEmail('')
          }}
          type="button"
        >
          Send to a different email
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        label="Email address"
        placeholder="your.email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        required
        disabled={loading}
      />

      {/* Dev mode password login */}
      {isDev && (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={usePassword}
              onChange={(e) => setUsePassword(e.target.checked)}
              className="rounded border-neutral-300 text-ocean-600 focus:ring-ocean-500"
            />
            Use password (dev mode)
          </label>
          {usePassword && (
            <Input
              type="password"
              label="Password"
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          )}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={loading}
        disabled={!email || loading || (usePassword && !password)}
      >
        <Mail className="w-5 h-5" />
        {usePassword ? 'Sign in' : 'Send magic link'}
      </Button>

      {/* Dev mode hint */}
      {isDev && !usePassword && (
        <p className="text-xs text-neutral-500 text-center">
          Check <a href="http://127.0.0.1:64324" target="_blank" rel="noopener noreferrer" className="text-ocean-600 hover:underline">Mailpit</a> for magic link emails
        </p>
      )}
    </form>
  )
}
