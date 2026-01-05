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
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sage-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ocean-500 to-ocean-600 rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
              <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
              <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-neutral-700 mb-2">
            Welcome to Bubbles
          </h1>
          <p className="text-lg text-neutral-600">
            Share what you own. Borrow what you need.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-700 mb-2">
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
        <p className="text-center text-sm text-neutral-500 mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="text-ocean-600 hover:text-ocean-700 underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-ocean-600 hover:text-ocean-700 underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
