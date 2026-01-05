import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Spinner } from '../components/ui/Spinner'

/**
 * Auth Callback Page
 *
 * Handles OAuth and Magic Link redirects from Supabase Auth.
 * This page processes the auth tokens and redirects the user appropriately.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error in URL params
        const errorParam = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        if (errorParam) {
          setError(errorDescription || errorParam)
          return
        }

        // Check if we have tokens in the hash fragment (magic link or OAuth)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        if (accessToken && refreshToken) {
          // Set the session from the URL tokens
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (setSessionError) {
            setError(setSessionError.message)
            return
          }
        }

        // Now get the session (either just set or already existing)
        const { data, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          setError(sessionError.message)
          return
        }

        if (data.session) {
          // Check if user has a profile set up
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('display_name')
            .eq('id', data.session.user.id)
            .single()

          if (profileError && profileError.code !== 'PGRST116') {
            // PGRST116 = no rows returned (new user)
            console.error('Error checking profile:', profileError)
          }

          // If no profile or no display name, go to profile setup
          if (!profile || !profile.display_name) {
            navigate('/profile/setup', { replace: true })
          } else {
            // Existing user with profile - go to dashboard
            navigate('/dashboard', { replace: true })
          }
        } else {
          // No session found - redirect to login
          navigate('/login', { replace: true })
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('An unexpected error occurred during sign in')
      }
    }

    handleAuthCallback()
  }, [navigate, searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Sign In Failed
          </h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="bg-ocean-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-neutral-600">Completing sign in...</p>
      </div>
    </div>
  )
}
