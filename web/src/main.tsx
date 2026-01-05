import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  Link,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import './index.css'
import { AuthProvider, useAuth } from './lib/auth'
import { Spinner } from './components/ui/Spinner'

// Pages
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

// ============================================================================
// Root Layout - Wraps everything with AuthProvider
// ============================================================================
function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

// ============================================================================
// Protected Layout - Handles auth checks and navbar
// ============================================================================
function ProtectedLayout() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/login' })
    }
  }, [loading, user, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) return null

  // Hide navbar on profile setup
  const hideNavbar = pathname === '/profile/setup'

  return (
    <div className="min-h-screen bg-neutral-50">
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
        <Outlet />
      </main>
    </div>
  )
}

// ============================================================================
// Navbar Component
// ============================================================================
function Navbar() {
  const { user, signOut } = useAuth()

  return (
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
  )
}

// ============================================================================
// Route Definitions
// ============================================================================

// Root route
const rootRoute = createRootRoute({
  component: RootLayout,
})

// Public routes (no auth required)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: AuthCallbackPage,
})

const joinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join/$code',
  component: JoinBubblePage,
})

// Protected layout route (pathless layout - children have normal paths)
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_protected',
  component: ProtectedLayout,
})

// Protected child routes
const homeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  component: Home,
})

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/dashboard',
  component: Dashboard,
})

const profileSetupRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/profile/setup',
  component: ProfileSetupPage,
})

const profileRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/profile',
  component: ProfilePage,
})

const inventoryRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/inventory',
  component: InventoryPage,
})

const itemDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/items/$id',
  component: ItemDetailPage,
})

const bubblesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/bubbles',
  component: BubblesListPage,
})

const bubbleDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/bubbles/$id',
  component: BubbleDetailPage,
})

// ============================================================================
// Route Tree
// ============================================================================
const routeTree = rootRoute.addChildren([
  loginRoute,
  authCallbackRoute,
  joinRoute,
  protectedRoute.addChildren([
    homeRoute,
    dashboardRoute,
    profileSetupRoute,
    profileRoute,
    inventoryRoute,
    itemDetailRoute,
    bubblesRoute,
    bubbleDetailRoute,
  ]),
])

// ============================================================================
// Router
// ============================================================================
const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// ============================================================================
// Render
// ============================================================================
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
