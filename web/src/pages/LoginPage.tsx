import { useNavigate } from '@tanstack/react-router'
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton'
import { MagicLinkForm } from '../components/auth/MagicLinkForm'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleAuthSuccess = () => {
    // Navigate to profile setup for new users, or dashboard for existing users
    // TODO: Check if user profile exists, if not go to setup
    navigate({ to: '/profile/setup' })
  }

  const handleAuthError = (error: Error) => {
    console.error('Authentication error:', error)
    // Error handling is done in individual components
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Vibrant gradient background */}
      <div className="absolute inset-0 bg-gradient-vibrant-soft" />

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400/30 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-mint-400/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />

      <div className="relative flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl mb-6 shadow-xl">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
                <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
              </svg>
            </div>
            <h1 className="font-display text-4xl font-bold text-neutral-900 mb-3">
              Welcome to Bubbles
            </h1>
            <p className="text-lg text-neutral-600">
              Share what you own. Borrow what you need.
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">
                Sign in to continue
              </h2>
              <p className="text-sm text-neutral-500">
                Join trusted circles and start sharing with your community
              </p>
            </div>

            {/* Google OAuth */}
            <GoogleAuthButton
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500">Or continue with email</span>
              </div>
            </div>

            {/* Magic Link */}
            <MagicLinkForm
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-neutral-500 mt-8">
            By signing in, you agree to our{' '}
            <a href="#" className="text-violet-600 hover:text-violet-700 font-medium underline underline-offset-2">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-violet-600 hover:text-violet-700 font-medium underline underline-offset-2">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
