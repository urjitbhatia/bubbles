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
import DesignPreview from './pages/DesignPreview'

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
      <div className="min-h-screen flex items-center justify-center bg-white">
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
// Navbar Component - TipTap-inspired vibrant design
// ============================================================================
function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="10" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="15" cy="10" r="6" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                  <circle cx="12" cy="15" r="6" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-neutral-900">Bubbles</span>
            </Link>
            {user && (
              <div className="hidden sm:flex items-center space-x-1">
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/inventory"
                  className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-200"
                >
                  Inventory
                </Link>
                <Link
                  to="/bubbles"
                  className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-200"
                >
                  Bubbles
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-200"
                >
                  Profile
                </Link>
                <div className="w-px h-6 bg-neutral-200 mx-1" />
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-all duration-200"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-lg transition-all duration-200"
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

const designPreviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/design-preview',
  component: DesignPreview,
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
  designPreviewRoute,
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
