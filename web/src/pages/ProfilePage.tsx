import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, LogOut, User as UserIcon, Calendar } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { Button } from '../components/ui/Button'
import { ProfileForm } from '../components/profile/ProfileForm'
import { Spinner } from '../components/ui/Spinner'
import { userApi, bubblesApi, itemsApi, type UserProfile } from '../lib/api'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({ items: 0, bubbles: 0 })
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    async function fetchProfile() {
      try {
        const [profileData, bubblesData, itemsData] = await Promise.all([
          userApi.getMe(),
          bubblesApi.list(),
          itemsApi.list(1, 1), // Just to get total count
        ])
        setProfile(profileData)
        setStats({
          items: itemsData.total,
          bubbles: bubblesData.total,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, navigate])

  const handleSaveProfile = async (data: { displayName: string; username?: string }) => {
    const updated = await userApi.updateMe({
      display_name: data.displayName,
      username: data.username || undefined,
    })
    setProfile(updated)
    setIsEditing(false)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-neutral-700">Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gradient-to-r from-ocean-500 to-ocean-600 h-32"></div>
          <div className="px-6 pb-6">
            <div className="relative -mt-16 mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-ocean-100 flex items-center justify-center">
                    <UserIcon className="w-16 h-16 text-ocean-600" />
                  </div>
                )}
              </div>
            </div>

            {isEditing ? (
              <div>
                <h2 className="text-xl font-semibold text-neutral-700 mb-6">
                  Edit Profile
                </h2>
                <ProfileForm
                  initialData={{
                    displayName: profile.display_name,
                    username: profile.username || undefined,
                    avatarUrl: profile.avatar_url || undefined
                  }}
                  onSave={handleSaveProfile}
                  onCancel={() => setIsEditing(false)}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Info */}
                <div>
                  <h2 className="text-2xl font-bold text-neutral-700 mb-1">
                    {profile.display_name}
                  </h2>
                  {profile.username && (
                    <p className="text-lg text-neutral-500">@{profile.username}</p>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {user?.email && (
                    <div className="flex items-center gap-3 text-neutral-600">
                      <span className="text-sm">{user.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-neutral-600">
                    <Calendar className="w-5 h-5 text-neutral-400" />
                    <span className="text-sm">Joined {formatDate(profile.created_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-neutral-200">
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                    className="flex-1"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        {!isEditing && (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-700 mb-4">
              Account Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Stats Card */}
        {!isEditing && (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-700 mb-4">
              Your Activity
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-neutral-50 rounded-lg">
                <div className="text-2xl font-bold text-ocean-600 mb-1">{stats.items}</div>
                <div className="text-xs text-neutral-500">Items</div>
              </div>
              <div className="text-center p-4 bg-neutral-50 rounded-lg">
                <div className="text-2xl font-bold text-sage-600 mb-1">{stats.bubbles}</div>
                <div className="text-xs text-neutral-500">Bubbles</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
