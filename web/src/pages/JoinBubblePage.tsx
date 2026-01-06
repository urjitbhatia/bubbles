import { useState } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { useAuth } from '../lib/auth'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { bubblesApi } from '../lib/api'

// Bubble info from the invite response
interface BubblePreview {
  id: string
  name: string
  description?: string
  memberCount: number
  itemCount: number
}

export default function JoinBubblePage() {
  const { code } = useParams({ from: '/join/$code' })
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [bubble, setBubble] = useState<BubblePreview | null>(null)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleJoinBubble = async () => {
    if (!user) {
      navigate({ to: '/login', search: { redirect: `/join/${code}` } })
      return
    }

    if (!code) {
      setError('Invalid invite code')
      return
    }

    setJoining(true)
    setError(null)

    try {
      const result = await bubblesApi.join(code)

      // Set bubble info from the join response
      setBubble({
        id: result.bubble.id,
        name: result.bubble.name,
        description: result.bubble.description || undefined,
        memberCount: 0,
        itemCount: 0,
      })

      setJoined(true)

      // Redirect to bubble after a short delay
      setTimeout(() => {
        navigate({ to: '/bubbles/$id', params: { id: result.bubble.id } })
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join bubble')
    } finally {
      setJoining(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Vibrant gradient background */}
        <div className="absolute inset-0 bg-gradient-vibrant-soft" />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-fuchsia-400/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-mint-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-400/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />

        <div className="relative flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-fuchsia-600" />
        </div>
      </div>
    )
  }

  // Show error state if there's an error and we don't have bubble info (failed to join)
  if (error && !joined) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Vibrant gradient background */}
        <div className="absolute inset-0 bg-gradient-vibrant-soft" />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-fuchsia-400/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-mint-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-400/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />

        <div className="relative flex items-center justify-center min-h-screen px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-error-100 to-error-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-error-600" />
              </div>
              <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">
                Invalid Invite Link
              </h2>
              <p className="text-neutral-600 mb-8">
                This invite link is not valid or has expired. Please check the link and try again.
              </p>
              <Link
                to="/bubbles"
                className="inline-block px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-mint-600 hover:from-fuchsia-700 hover:to-mint-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Go to My Bubbles
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Vibrant gradient background */}
      <div className="absolute inset-0 bg-gradient-vibrant-soft" />

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-fuchsia-400/30 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-mint-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-400/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />

      <div className="relative flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-mint-500 rounded-2xl mb-4 shadow-xl">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
                <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
              </svg>
            </div>
          </div>

          {/* Main card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            {/* Gradient header decoration */}
            <div className="relative h-24 bg-gradient-to-br from-fuchsia-500 via-violet-500 to-mint-500">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2" />
                  <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                  <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {joined && bubble ? (
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-mint-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">
                    You're In!
                  </h2>
                  <p className="text-neutral-600 mb-4">
                    Welcome to <span className="font-semibold text-fuchsia-600">{bubble.name}</span>
                  </p>
                  <p className="text-sm text-neutral-500">
                    Redirecting you now...
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h1 className="font-display text-2xl font-bold text-neutral-900 mb-3">
                      You've been invited to join a Bubble
                    </h1>
                    <p className="text-neutral-600">
                      Click the button below to accept this invitation and join the group.
                    </p>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="bg-gradient-to-r from-error-50 to-error-100 text-error-800 p-4 rounded-xl mb-6 text-sm border border-error-200">
                      {error}
                    </div>
                  )}

                  {/* Join button */}
                  {user ? (
                    <button
                      onClick={handleJoinBubble}
                      disabled={joining}
                      className="w-full px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-mint-600 hover:from-fuchsia-700 hover:to-mint-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                      {joining && (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      )}
                      {joining ? 'Joining...' : 'Accept Invitation'}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-neutral-600 text-center">
                        Sign in to join this bubble
                      </p>
                      <Link
                        to="/login"
                        search={{ redirect: `/join/${code}` }}
                        className="block w-full px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-mint-600 hover:from-fuchsia-700 hover:to-mint-700 text-white font-semibold text-lg rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Sign In to Join
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          {!joined && (
            <p className="text-center text-sm text-neutral-600 mt-8">
              By joining, you can browse and request items shared within this bubble
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
