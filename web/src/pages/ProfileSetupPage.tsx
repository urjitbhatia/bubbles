import { useNavigate } from '@tanstack/react-router'
import { UserCircle } from 'lucide-react'
import { ProfileForm } from '../components/profile/ProfileForm'
import { userApi } from '../lib/api'

export default function ProfileSetupPage() {
  const navigate = useNavigate()

  const handleSaveProfile = async (data: { displayName: string; username?: string }) => {
    await userApi.setupProfile({
      display_name: data.displayName,
      username: data.username || undefined,
    })

    // Navigate to inventory after successful setup
    navigate({ to: '/inventory' })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Vibrant gradient background */}
      <div className="absolute inset-0 bg-gradient-vibrant-soft" />

      {/* Animated gradient orbs */}
      <div className="absolute top-10 right-20 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-10 left-20 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 left-10 w-64 h-64 bg-mint-400/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />

      <div className="relative flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl mb-6 shadow-xl">
              <UserCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-neutral-900 mb-3">
              Complete Your Profile
            </h1>
            <p className="text-lg text-neutral-600">
              Help your community recognize you
            </p>
          </div>

          {/* Setup Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8">
            <ProfileForm
              onSave={handleSaveProfile}
              isSetup={true}
            />
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl">
            <p className="text-sm text-neutral-600 text-center">
              You can always update your profile later from your account settings
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
