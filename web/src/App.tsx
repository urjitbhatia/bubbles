import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useAuth } from './lib/auth'
import { Spinner } from './components/ui/Spinner'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import Dashboard from './pages/Dashboard'
import ProfileSetupPage from './pages/ProfileSetupPage'
import ProfilePage from './pages/ProfilePage'
import InventoryPage from './pages/InventoryPage'
import ItemDetailPage from './pages/ItemDetailPage'
import BubblesListPage from './pages/BubblesListPage'
import BubbleDetailPage from './pages/BubbleDetailPage'
import JoinBubblePage from './pages/JoinBubblePage'

function App() {
  const { user, signOut, loading } = useAuth()
  const location = useLocation()

  // Hide navbar on auth-related pages and join page
  const hideNavbar = ['/login', '/profile/setup', '/auth/callback'].includes(location.pathname) ||
                     location.pathname.startsWith('/join/')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {!hideNavbar && (
        <nav className="bg-white shadow-sm border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-xl font-bold text-ocean-600">
                  Bubbles
                </Link>
                <div className="hidden sm:flex space-x-4">
                  <Link to="/" className="text-neutral-600 hover:text-neutral-900 font-medium">
                    Home
                  </Link>
                  {user && (
                    <>
                      <Link to="/dashboard" className="text-neutral-600 hover:text-neutral-900 font-medium">
                        Dashboard
                      </Link>
                      <Link to="/inventory" className="text-neutral-600 hover:text-neutral-900 font-medium">
                        Inventory
                      </Link>
                      <Link to="/profile" className="text-neutral-600 hover:text-neutral-900 font-medium">
                        Profile
                      </Link>
                      <Link to="/bubbles" className="text-neutral-600 hover:text-neutral-900 font-medium">
                        Bubbles
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-neutral-600">{user.email}</span>
                    <button
                      onClick={signOut}
                      className="text-sm text-neutral-600 hover:text-neutral-900 font-medium"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="bg-ocean-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-ocean-700 transition-colors"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className={hideNavbar ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/profile/setup" element={<ProfileSetupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/bubbles" element={<BubblesListPage />} />
          <Route path="/bubbles/:id" element={<BubbleDetailPage />} />
          <Route path="/join/:code" element={<JoinBubblePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
