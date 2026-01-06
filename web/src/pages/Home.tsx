import { Link } from '@tanstack/react-router'
import { useAuth } from '../lib/auth'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section - TipTap inspired vibrant design */}
      <section className="relative overflow-hidden">
        {/* Vibrant gradient background */}
        <div className="absolute inset-0 bg-gradient-vibrant-soft" />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-violet-400/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-mint-400/25 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />

        <div className="relative py-24 md:py-32 px-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo mark */}
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                  <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
                </svg>
              </div>
            </div>

            {/* TipTap-style headline with mixed typography */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-8 leading-tight">
              Share with your{' '}
              <span className="text-framed">trusted</span>{' '}
              circles.{' '}
              <span className="text-italic-emphasis text-violet-600">Borrow</span>{' '}
              from your{' '}
              <span className="text-underline-emphasis decoration-fuchsia-400">community</span>.
            </h1>

            <p className="text-xl md:text-2xl text-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Bubbles is a lending library for the things you love. Share tools, books, games,
              and more with friends, family, and neighbors you trust.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {user ? (
                <Link
                  to="/inventory"
                  className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View My Inventory
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-neutral-200 text-neutral-700 text-lg font-semibold rounded-xl hover:bg-white hover:border-violet-300 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Social proof stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient-vibrant">500+</div>
                <div className="text-sm text-neutral-500 mt-1">Items Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient-vibrant">150+</div>
                <div className="text-sm text-neutral-500 mt-1">Active Bubbles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient-vibrant">98%</div>
                <div className="text-sm text-neutral-500 mt-1">Happy Lenders</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Feature cards */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Built on trust, community, and thoughtful reuse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Violet */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-white border border-violet-100 hover:border-violet-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">Add Your Items</h3>
              <p className="text-neutral-600 leading-relaxed">
                List the things you're happy to lend—tools, books, camping gear, kitchen gadgets, anything!
              </p>
            </div>

            {/* Card 2 - Fuchsia */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-fuchsia-50 to-white border border-fuchsia-100 hover:border-fuchsia-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                  <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">Create Bubbles</h3>
              <p className="text-neutral-600 leading-relaxed">
                Form trusted circles with friends, family, or neighbors. Share your items with people you know.
              </p>
            </div>

            {/* Card 3 - Mint */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-mint-50 to-white border border-mint-100 hover:border-mint-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-mint-500 to-mint-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">Borrow & Lend</h3>
              <p className="text-neutral-600 leading-relaxed">
                Browse what's available in your bubbles and coordinate loans directly with the owner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Why Bubbles?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Benefit 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 hover:border-violet-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-neutral-900">Save Money</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Why buy a ladder you'll use twice a year? Borrow from your bubble instead.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 hover:border-fuchsia-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-mint-400 to-mint-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-neutral-900">Reduce Waste</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Less stuff in landfills. More things getting used. Better for everyone.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 hover:border-violet-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-neutral-900">Build Community</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Strengthen connections with the people around you through sharing.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 hover:border-mint-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-400 to-fuchsia-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-neutral-900">Trust First</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Only share with people you invite. Your bubbles, your rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Vibrant gradient */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-vibrant" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to start sharing?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Create your first bubble and invite the people you trust.
          </p>
          {!user && (
            <Link
              to="/login"
              className="inline-block px-10 py-4 bg-white text-violet-600 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Create Your Account
            </Link>
          )}
          {user && (
            <Link
              to="/bubbles"
              className="inline-block px-10 py-4 bg-white text-violet-600 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              View My Bubbles
            </Link>
          )}
        </div>
      </section>

      {/* Footer - Dark */}
      <footer className="bg-neutral-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                  <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
                </svg>
              </div>
              <span className="text-lg font-bold">Bubbles</span>
            </div>
            <p className="text-neutral-400 text-sm">
              &copy; {new Date().getFullYear()} Bubbles. Share more. Own less.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
