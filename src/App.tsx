/**
 * Main App component
 * Sets up routing and initializes the application
 */
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState, Suspense, lazy } from 'react'
import { useAppStore } from './store'
import { initializeDatabase } from './db/init'
import { getUserById } from './db/repo'
import { BubbleBackground } from './components/BubbleBackground'
import { LoadingSpinner } from './components/LoadingSpinner'
import './styles/index.css'

// Lazy load routes for code splitting and faster initial load
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })))
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const SignUp = lazy(() => import('./pages/SignUp').then(m => ({ default: m.SignUp })))
const LocationConsent = lazy(() => import('./pages/LocationConsent').then(m => ({ default: m.LocationConsent })))
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Explore = lazy(() => import('./pages/Explore').then(m => ({ default: m.Explore })))
const Business = lazy(() => import('./pages/Business').then(m => ({ default: m.Business })))
const Deals = lazy(() => import('./pages/Deals').then(m => ({ default: m.Deals })))
const Bookmarks = lazy(() => import('./pages/Bookmarks').then(m => ({ default: m.Bookmarks })))
const Report = lazy(() => import('./pages/Report').then(m => ({ default: m.Report })))
const AddBusiness = lazy(() => import('./pages/AddBusiness').then(m => ({ default: m.AddBusiness })))

function App() {
  const { theme, setTheme, currentUserId } = useAppStore()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdminStatus()
  }, [currentUserId])

  const checkAdminStatus = async () => {
    if (currentUserId && currentUserId !== 'user-1') {
      try {
        const user = await getUserById(currentUserId)
        setIsAdmin(user?.role === 'admin')
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      }
    } else {
      setIsAdmin(false)
    }
  }

  // Pre-initialize database immediately (critical for fast page loads)
  useEffect(() => {
    // Start initialization immediately but don't block rendering
    initializeDatabase().catch((error) => {
      console.error('Failed to initialize database:', error)
    })
  }, [])

  // Redirect to login if not logged in (handled by individual pages)

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white relative overflow-hidden">
        <BubbleBackground />
        {currentUserId && currentUserId !== 'user-1' && (
          <nav className="glass border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <Link to="/home" className="text-2xl font-bold text-black hover:text-gray-700 transition-all">
                  LocaLink
                </Link>
                <div className="flex items-center gap-4">
                <Link
                  to="/home"
                  className="text-gray-700 hover:text-black transition-colors font-medium px-3 py-2 rounded-lg glass-hover"
                >
                  Home
                </Link>
                <Link
                  to="/explore"
                  className="text-gray-700 hover:text-black transition-colors font-medium px-3 py-2 rounded-lg glass-hover"
                >
                  Explore
                </Link>
                <Link
                  to="/deals"
                  className="text-gray-700 hover:text-black transition-colors font-medium px-3 py-2 rounded-lg glass-hover"
                >
                  Deals
                </Link>
                <Link
                  to="/bookmarks"
                  className="text-gray-700 hover:text-black transition-colors font-medium px-3 py-2 rounded-lg glass-hover"
                >
                  Bookmarks
                </Link>
                <Link
                  to="/report"
                  className="text-gray-700 hover:text-black transition-colors font-medium px-3 py-2 rounded-lg glass-hover"
                >
                  Reports
                </Link>
                {isAdmin && (
                  <Link
                    to="/add-business"
                    className="text-gray-700 hover:text-black transition-colors font-medium px-3 py-2 rounded-lg glass-hover"
                  >
                    Add Business
                  </Link>
                )}
                  <button
                    onClick={() =>
                      setTheme(
                        theme === 'light'
                          ? 'dark'
                          : theme === 'dark'
                          ? 'high-contrast'
                          : 'light'
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded text-sm"
                    aria-label="Toggle theme"
                  >
                    {theme === 'light' ? '🌙' : theme === 'dark' ? '🔆' : '⚡'}
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/location-consent" element={<LocationConsent />} />
              <Route path="/home" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/business/:id" element={<Business />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/report" element={<Report />} />
              <Route path="/add-business" element={<AddBusiness />} />
            </Routes>
          </Suspense>
        </main>

        {currentUserId && currentUserId !== 'user-1' && (
          <footer className="bg-gray-800 text-white mt-16 py-8">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-400">
                © 2025 LocaLink - Toronto Small Business Directory
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Discover and support local businesses in Toronto
              </p>
            </div>
          </footer>
        )}
      </div>
    </BrowserRouter>
  )
}

export default App

