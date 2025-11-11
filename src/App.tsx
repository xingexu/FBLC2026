/**
 * Main App component
 * Sets up routing and initializes the application
 */
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { LocationConsent } from './pages/LocationConsent'
import { Home } from './pages/Home'
import { Explore } from './pages/Explore'
import { Business } from './pages/Business'
import { Deals } from './pages/Deals'
import { Bookmarks } from './pages/Bookmarks'
import { Report } from './pages/Report'
import { AddBusiness } from './pages/AddBusiness'
import { useAppStore } from './store'
import { initializeDatabase } from './db/init'
import { BubbleBackground } from './components/BubbleBackground'
import './styles/index.css'

function App() {
  const { theme, setTheme, currentUserId } = useAppStore()

  useEffect(() => {
    // Initialize database with seed data
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
                <Link
                  to="/add-business"
                  className="text-gray-700 hover:text-black transition-colors font-medium px-3 py-2 rounded-lg glass-hover"
                >
                  Add Business
                </Link>
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

