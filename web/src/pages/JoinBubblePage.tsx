import { useState } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { useAuth } from '../lib/auth'
import { Loader2, CheckCircle } from 'lucide-react'
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ocean-600" />
      </div>
    )
  }

  // Show error state if there's an error and we don't have bubble info (failed to join)
  if (error && !joined) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-error-600"
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
          </div>
          <h2 className="text-2xl font-bold text-neutral-700 mb-2">Invalid Invite Link</h2>
          <p className="text-neutral-600 mb-6">
            This invite link is not valid or has expired. Please check the link and try again.
          </p>
          <Link
            to="/bubbles"
            className="inline-block px-6 py-3 bg-ocean-600 hover:bg-ocean-700 text-white font-medium rounded-lg"
          >
            Go to My Bubbles
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Bubble preview card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-ocean-200 overflow-hidden">
          {/* Header decoration */}
          <div className="h-32 bg-gradient-to-br from-ocean-100 to-sage-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-20 h-20 text-ocean-300 opacity-50"
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
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-700 mb-2">You're In!</h2>
                <p className="text-neutral-600 mb-6">
                  Welcome to <strong>{bubble.name}</strong>. Redirecting...
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-neutral-700 mb-4">
                    You've been invited to join a Bubble
                  </h1>
                  <p className="text-neutral-600 mb-6">
                    Click the button below to accept this invitation and join the group.
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-error-50 text-error-800 p-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                {/* Join button */}
                {user ? (
                  <button
                    onClick={handleJoinBubble}
                    disabled={joining}
                    className="w-full px-6 py-4 bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800 text-white font-semibold text-lg rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {joining && (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    {joining ? 'Joining...' : 'Accept Invitation'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-neutral-600 text-center mb-4">
                      Sign in to join this bubble
                    </p>
                    <Link
                      to="/login"
                      search={{ redirect: `/join/${code}` }}
                      className="block w-full px-6 py-4 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold text-lg rounded-lg text-center shadow-sm hover:shadow-md transition-all duration-200"
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
          <p className="text-center text-sm text-neutral-500 mt-6">
            By joining, you can browse and request items shared within this bubble
          </p>
        )}
      </div>
    </div>
  )
}
