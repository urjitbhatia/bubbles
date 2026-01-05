import { Link } from '@tanstack/react-router'
import { useAuth } from '../lib/auth'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-ocean-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-6xl">🫧</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Share more. <span className="text-ocean-600">Own less.</span>
          </h1>
          <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
            Bubbles is a lending library for your trusted circles. Share tools, books,
            games, and more with friends, family, and neighbors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/inventory"
                className="bg-ocean-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-ocean-700 transition-colors"
              >
                View My Inventory
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-ocean-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-ocean-700 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-neutral-300 text-neutral-700 px-8 py-4 rounded-lg text-lg font-medium hover:border-neutral-400 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-4">
            How It Works
          </h2>
          <p className="text-center text-neutral-600 mb-12 max-w-2xl mx-auto">
            Built on trust, community, and thoughtful reuse.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Add Your Items</h3>
              <p className="text-neutral-600">
                List the things you're happy to lend—tools, books, camping gear, kitchen gadgets, anything!
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🫧</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Create Bubbles</h3>
              <p className="text-neutral-600">
                Form trusted circles with friends, family, or neighbors. Share your items with people you know.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Borrow & Lend</h3>
              <p className="text-neutral-600">
                Browse what's available in your bubbles and coordinate loans directly with the owner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">
            Why Bubbles?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900">Save Money</h3>
                  <p className="text-neutral-600">
                    Why buy a ladder you'll use twice a year? Borrow from your bubble instead.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900">Reduce Waste</h3>
                  <p className="text-neutral-600">
                    Less stuff in landfills. More things getting used. Better for everyone.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-ocean-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-ocean-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900">Build Community</h3>
                  <p className="text-neutral-600">
                    Strengthen connections with the people around you through sharing.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-coral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-coral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900">Trust First</h3>
                  <p className="text-neutral-600">
                    Only share with people you invite. Your bubbles, your rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Ready to start sharing?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Create your first bubble and invite the people you trust.
          </p>
          {!user && (
            <Link
              to="/login"
              className="inline-block bg-ocean-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-ocean-700 transition-colors"
            >
              Create Your Account
            </Link>
          )}
          {user && (
            <Link
              to="/bubbles"
              className="inline-block bg-ocean-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-ocean-700 transition-colors"
            >
              View My Bubbles
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto text-center text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Bubbles. Share more. Own less.</p>
        </div>
      </footer>
    </div>
  )
}
