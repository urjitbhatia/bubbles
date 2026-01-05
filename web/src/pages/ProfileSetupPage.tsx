import { useNavigate } from 'react-router-dom'
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
    navigate('/inventory')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 via-white to-sage-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-ocean-100 rounded-full mb-4">
            <UserCircle className="w-8 h-8 text-ocean-600" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-700 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-neutral-600">
            Help your community recognize you
          </p>
        </div>

        {/* Setup Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 sm:p-8">
          <ProfileForm
            onSave={handleSaveProfile}
            isSetup={true}
          />
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <p className="text-sm text-neutral-600 text-center">
            You can always update your profile later from your account settings
          </p>
        </div>
      </div>
    </div>
  )
}
