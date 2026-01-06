import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '../lib/auth'
import { itemsApi, bubblesApi, type ItemWithShares, type Bubble } from '../lib/api'
import { Spinner } from '../components/ui/Spinner'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<ItemWithShares[]>([])
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    async function fetchData() {
      try {
        const [itemsResult, bubblesResult] = await Promise.all([
          itemsApi.list(1, 5),
          bubblesApi.list(),
        ])
        setItems(itemsResult.items)
        setBubbles(bubblesResult.bubbles)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-mint-500 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back!
          </h1>
          <p className="text-white/80 text-lg">
            Here's what's happening in your bubbles today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">{items.length}</div>
          <div className="text-sm text-neutral-500">Items in Inventory</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md hover:border-fuchsia-200 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-fuchsia-600" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
              <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
              <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
            </svg>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">{bubbles.length}</div>
          <div className="text-sm text-neutral-500">Active Bubbles</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md hover:border-mint-200 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-mint-100 to-mint-200 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-mint-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mb-1">0</div>
          <div className="text-sm text-neutral-500">Active Loans</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Items */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Recent Items</h2>
            <Link
              to="/inventory"
              className="text-sm font-medium text-violet-600 hover:text-violet-700"
            >
              View all
            </Link>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            )}

            {error && (
              <div className="bg-error-50 text-error-700 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-neutral-500 mb-4">No items yet</p>
                <Link
                  to="/inventory"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-medium rounded-lg hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add First Item
                </Link>
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <ul className="divide-y divide-neutral-100">
                {items.slice(0, 5).map((item) => (
                  <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <Link
                      to="/items/$id"
                      params={{ id: item.id }}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-neutral-900 group-hover:text-violet-600 transition-colors truncate">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-neutral-500 truncate">{item.description}</p>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-neutral-300 group-hover:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Your Bubbles */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">Your Bubbles</h2>
            <Link
              to="/bubbles"
              className="text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700"
            >
              View all
            </Link>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex justify-center py-8">
                <Spinner size="md" />
              </div>
            )}

            {!loading && bubbles.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-100 to-mint-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-fuchsia-400" viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                    <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
                  </svg>
                </div>
                <p className="text-neutral-500 mb-4">No bubbles yet</p>
                <Link
                  to="/bubbles"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-mint-600 text-white text-sm font-medium rounded-lg hover:from-fuchsia-700 hover:to-mint-700 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create First Bubble
                </Link>
              </div>
            )}

            {!loading && bubbles.length > 0 && (
              <ul className="divide-y divide-neutral-100">
                {bubbles.slice(0, 5).map((bubble) => (
                  <li key={bubble.id} className="py-3 first:pt-0 last:pb-0">
                    <Link
                      to="/bubbles/$id"
                      params={{ id: bubble.id }}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-100 to-mint-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-fuchsia-500" viewBox="0 0 24 24" fill="none">
                          <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                          <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-neutral-900 group-hover:text-fuchsia-600 transition-colors truncate">
                          {bubble.name}
                        </h3>
                        {bubble.description && (
                          <p className="text-sm text-neutral-500 truncate">{bubble.description}</p>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-neutral-300 group-hover:text-fuchsia-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
