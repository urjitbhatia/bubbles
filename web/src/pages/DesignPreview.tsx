import { Link } from '@tanstack/react-router'

export default function DesignPreview() {
  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar - TipTap style */}
      <div className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-fuchsia-500 text-white py-2.5 px-4 text-center text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          🎉 Now with group lending! Create your first bubble today
          <span className="inline-flex items-center gap-1 hover:underline cursor-pointer">
            Learn more
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </span>
      </div>

      {/* Navigation - Clean, minimal */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                  <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-neutral-900">
                Bubbles
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <button className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-200">
                Features
              </button>
              <button className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-200">
                Pricing
              </button>
              <button className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-200">
                Docs
              </button>
              <div className="w-px h-6 bg-neutral-200 mx-2" />
              <button className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-all duration-200">
                Log in
              </button>
              <button className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-lg transition-all duration-200">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - TipTap-inspired vibrant gradient */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        {/* Vibrant gradient background */}
        <div className="absolute inset-0 bg-gradient-vibrant-soft" />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-violet-300 rounded-full opacity-30 blur-[100px] animate-pulse-soft" />
        <div className="absolute bottom-20 right-[10%] w-[500px] h-[500px] bg-mint-300 rounded-full opacity-30 blur-[100px] animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-200 rounded-full opacity-20 blur-[120px]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-neutral-900 mb-8 leading-[1.1] tracking-tight">
            Build{' '}
            <span className="inline-block bg-neutral-900 text-white px-4 py-1 rounded-xl italic">
              trusted
            </span>{' '}
            circles{' '}
            <em className="not-italic font-medium text-neutral-600">faster</em>{' '}
            🫧 with{' '}
            <span className="underline decoration-4 underline-offset-8 decoration-violet-500 italic">
              community
            </span>{' '}
            lending
          </h1>

          <p className="text-xl md:text-2xl text-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Bubbles is a lending library for your trusted circles. Share tools, books, games, and more with friends, family, and neighbors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="group px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center gap-3">
              Get started free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="px-8 py-4 bg-white/80 hover:bg-white text-neutral-700 text-lg font-semibold rounded-xl border border-neutral-200 hover:border-neutral-300 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm">
              View demo
            </button>
          </div>

          {/* Social proof stats - TipTap style */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 pt-8 border-t border-neutral-200/50">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">2.5k+</p>
              <p className="text-sm text-neutral-500 mt-1">Active users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-mint-600">10k+</p>
              <p className="text-sm text-neutral-500 mt-1">Items shared</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-mint-600 to-violet-600">500+</p>
              <p className="text-sm text-neutral-500 mt-1">Bubbles created</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards - Modern vibrant style */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-4">How It Works</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
              Share with the features{' '}
              <span className="relative inline-block">
                <span className="relative z-10">you want</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-fuchsia-200/60 -z-0" />
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 bg-gradient-to-br from-violet-50 to-white rounded-2xl border border-violet-100 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-violet-200 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">
                Add Your Items
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                List the things you're happy to lend—tools, books, camping gear, kitchen gadgets, anything!
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-fuchsia-50 to-white rounded-2xl border border-fuchsia-100 hover:border-fuchsia-200 hover:shadow-xl hover:shadow-fuchsia-100/50 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-fuchsia-200 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🫧</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">
                Create Bubbles
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Form trusted circles with friends, family, or neighbors. Share your items with people you know.
              </p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-mint-50 to-white rounded-2xl border border-mint-100 hover:border-mint-200 hover:shadow-xl hover:shadow-mint-100/50 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-mint-500 to-mint-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-mint-200 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900">
                Borrow & Lend
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Browse what's available in your bubbles and coordinate loans directly with the owner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Bubble Cards */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl font-bold text-neutral-900 tracking-tight">Your Bubbles</h2>
            <button className="text-sm font-medium text-violet-600 hover:text-violet-700 inline-flex items-center gap-1">
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bubble Card - Violet */}
            <div className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-neutral-200 hover:border-violet-300 transition-all duration-300 cursor-pointer">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-100 rounded-full opacity-40 blur-2xl group-hover:opacity-60 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 mb-1 group-hover:text-violet-700 transition-colors duration-200">
                      Neighborhood Tools
                    </h3>
                    <p className="text-sm text-neutral-500">
                      8 members · 24 items
                    </p>
                  </div>
                  <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-200 group-hover:scale-110 transition-all duration-300">
                    <span className="text-lg">🔧</span>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 mb-5 line-clamp-2 leading-relaxed">
                  Power tools, hand tools, and garden equipment shared among Oak Street neighbors.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {['J', 'M', 'S'].map((initial) => (
                      <div key={initial} className="w-7 h-7 rounded-full border-2 border-white bg-violet-100 flex items-center justify-center text-xs font-semibold text-violet-700">
                        {initial}
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-500">
                      +5
                    </div>
                  </div>
                  <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">Active</span>
                </div>
              </div>
            </div>

            {/* Bubble Card - Fuchsia */}
            <div className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-neutral-200 hover:border-fuchsia-300 transition-all duration-300 cursor-pointer">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-fuchsia-100 rounded-full opacity-40 blur-2xl group-hover:opacity-60 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 mb-1 group-hover:text-fuchsia-700 transition-colors duration-200">
                      Book Club Reads
                    </h3>
                    <p className="text-sm text-neutral-500">
                      12 members · 47 items
                    </p>
                  </div>
                  <div className="w-11 h-11 bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-fuchsia-200 group-hover:scale-110 transition-all duration-300">
                    <span className="text-lg">📚</span>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 mb-5 line-clamp-2 leading-relaxed">
                  Fiction, non-fiction, and everything in between. Our monthly picks and personal favorites.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {['A', 'B', 'C'].map((initial) => (
                      <div key={initial} className="w-7 h-7 rounded-full border-2 border-white bg-fuchsia-100 flex items-center justify-center text-xs font-semibold text-fuchsia-700">
                        {initial}
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-500">
                      +9
                    </div>
                  </div>
                  <span className="text-xs font-medium text-fuchsia-600 bg-fuchsia-50 px-2.5 py-1 rounded-full">Active</span>
                </div>
              </div>
            </div>

            {/* Bubble Card - Mint */}
            <div className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-neutral-200 hover:border-mint-300 transition-all duration-300 cursor-pointer">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-mint-100 rounded-full opacity-40 blur-2xl group-hover:opacity-60 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 mb-1 group-hover:text-mint-700 transition-colors duration-200">
                      Camping Crew
                    </h3>
                    <p className="text-sm text-neutral-500">
                      5 members · 18 items
                    </p>
                  </div>
                  <div className="w-11 h-11 bg-gradient-to-br from-mint-500 to-mint-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-mint-200 group-hover:scale-110 transition-all duration-300">
                    <span className="text-lg">🏕️</span>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 mb-5 line-clamp-2 leading-relaxed">
                  Tents, sleeping bags, coolers, and outdoor gear for weekend adventures.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {['D', 'E'].map((initial) => (
                      <div key={initial} className="w-7 h-7 rounded-full border-2 border-white bg-mint-100 flex items-center justify-center text-xs font-semibold text-mint-700">
                        {initial}
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-500">
                      +3
                    </div>
                  </div>
                  <span className="text-xs font-medium text-mint-600 bg-mint-50 px-2.5 py-1 rounded-full">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Item Cards */}
      <section className="py-16 px-4 bg-warm-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-neutral-900 mb-8 tracking-tight">Enhanced Item Cards</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Power Drill', quantity: 1, available: 1, bubbles: ['Tools'] },
              { name: 'Camping Tent', quantity: 1, available: 0, bubbles: ['Camping', 'Outdoors'] },
              { name: 'Board Games Collection', quantity: 5, available: 3, bubbles: ['Game Night'] },
              { name: 'Pressure Washer', quantity: 1, available: 1, bubbles: ['Tools', 'Garden'] },
            ].map((item) => (
              <div key={item.name} className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-neutral-200 hover:border-ocean-300 overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-ocean-100 via-sage-50 to-sage-100 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-3 right-3 z-10">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.available === item.quantity
                        ? 'bg-success-100 text-success-700'
                        : item.available === 0
                          ? 'bg-neutral-100 text-neutral-600'
                          : 'bg-warning-100 text-warning-700'
                    }`}>
                      {item.available}/{item.quantity} available
                    </span>
                  </div>

                  <svg
                    className="w-20 h-20 text-neutral-300 group-hover:text-ocean-400 group-hover:scale-110 transition-all duration-300 relative z-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>

                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-ocean-200 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1 truncate group-hover:text-ocean-700 transition-colors duration-200">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-neutral-500">Quantity:</span>
                    <span className="text-sm font-medium text-neutral-700">{item.quantity}</span>
                  </div>

                  {item.bubbles.length > 0 && (
                    <div className="pt-3 border-t border-neutral-100">
                      <p className="text-xs font-medium text-neutral-500 mb-2">Shared to:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.bubbles.map((bubble) => (
                          <span key={bubble} className="px-2 py-0.5 bg-ocean-50 text-ocean-700 text-xs rounded-full">
                            {bubble}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Buttons Section */}
      <section className="py-16 px-4 bg-warm-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-neutral-900 mb-8 tracking-tight">Enhanced Buttons</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-neutral-700 mb-4">Primary Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800 text-white font-medium rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2">
                  Primary Button
                </button>
                <button className="px-8 py-4 bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 inline-flex items-center gap-2 group">
                  Large with Icon
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-700 mb-4">Secondary & Ghost</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-ocean-700 font-medium border-2 border-ocean-600 hover:border-ocean-700 rounded-lg hover:shadow-sm transition-all duration-200">
                  Secondary
                </button>
                <button className="px-4 py-2 bg-transparent hover:bg-ocean-50 active:bg-ocean-100 text-ocean-700 font-medium rounded-lg transition-all duration-200">
                  Ghost Button
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-700 mb-4">Destructive</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-error-600 hover:bg-error-700 active:bg-error-800 text-white font-medium rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Inputs Section */}
      <section className="py-16 px-4 bg-warm-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-neutral-900 mb-8 tracking-tight">Enhanced Inputs</h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3.5 bg-white border-2 border-neutral-200 rounded-xl text-base text-neutral-900 placeholder:text-neutral-400 transition-all duration-200 focus:outline-none focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100 hover:border-neutral-300 min-h-[48px]"
                placeholder="you@example.com"
              />
              <p className="text-sm text-neutral-500 mt-2">
                We'll send you a magic link to sign in
              </p>
            </div>

            <div className="relative">
              <input
                type="search"
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border-2 border-transparent rounded-xl text-base text-neutral-900 placeholder:text-neutral-500 transition-all duration-200 focus:outline-none focus:bg-white focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100 hover:bg-white min-h-[48px]"
                placeholder="Search items, bubbles, or members..."
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Empty State */}
      <section className="py-16 px-4 bg-warm-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-neutral-900 mb-8 tracking-tight">Enhanced Empty State</h2>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 mb-3">
                No items yet
              </h3>
              <p className="text-base text-neutral-600 mb-8 max-w-md mx-auto leading-relaxed">
                Start by adding your first item to share with your bubbles. It only takes a minute!
              </p>
              <button className="px-8 py-4 bg-ocean-600 hover:bg-ocean-700 active:bg-ocean-800 text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your First Item
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - TipTap style with vibrant gradient */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-vibrant opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Ready to get{' '}
            <span className="relative inline-block">
              <span className="relative z-10">started?</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-white/30 -z-0" />
            </span>
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of neighbors already sharing. Create your first bubble in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-4 bg-white hover:bg-neutral-50 text-neutral-900 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 inline-flex items-center gap-3">
              Start for free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200">
              Contact sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                    <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
                  </svg>
                </div>
                <span className="text-xl font-bold">Bubbles</span>
              </div>
              <p className="text-neutral-400 max-w-xs">
                A lending library for your trusted circles. Share more. Own less.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-neutral-400 mb-4">Product</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Docs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-neutral-400 mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-neutral-400 mb-4">Legal</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-sm">© 2025 Bubbles. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
