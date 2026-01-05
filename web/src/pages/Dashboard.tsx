import { useEffect, useState } from 'react'
import { useAuth } from '../lib/auth'
import { itemsApi, type ItemWithShares } from '../lib/api'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<ItemWithShares[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    async function fetchItems() {
      try {
        const result = await itemsApi.list(1, 10)
        setItems(result.items)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [user])

  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Profile</h2>
        <p className="text-gray-600">Email: {user?.email}</p>
        <p className="text-gray-600">User ID: {user?.id}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Your Items</h2>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded text-sm">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="text-gray-600 text-center py-8">
            No items yet. Create your first item to get started.
          </p>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className="py-3">
                <h3 className="font-medium">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
