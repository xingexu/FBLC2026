/**
 * Home page
 * Hero section with category chips, Near Me button, and quick search
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CategoryChips } from '../components/CategoryChips'
import { FloatingCard } from '../components/FloatingCard'
import { useAppStore } from '../store'

export function Home() {
  const navigate = useNavigate()
  const { userLocation, setUserLocation, setSearchText } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Check if user is logged in
    const { currentUserId, hasCompletedLocationConsent } = useAppStore.getState()
    if (!currentUserId || currentUserId === 'user-1') {
      navigate('/login')
      return
    }
    if (!hasCompletedLocationConsent) {
      navigate('/location-consent')
    }
  }, [navigate])

  const handleNearMe = () => {
    if (userLocation) {
      navigate('/explore')
      return
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          navigate('/explore')
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert('Unable to get your location. Please enable location services.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchText(searchQuery)
    navigate('/explore')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
            Discover Toronto's Small Businesses
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with local shops, restaurants, and services in your neighborhood
          </p>

          <FloatingCard>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-3 glass rounded-2xl overflow-hidden p-2 border border-gray-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses..."
                className="flex-1 px-6 py-4 focus:outline-none text-lg text-black placeholder-gray-500 bg-transparent"
                aria-label="Search businesses"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all font-semibold glass-hover transform hover:scale-110 active:scale-95 btn-bubble"
              >
                Search
              </button>
              </div>
            </form>
          </FloatingCard>

          <FloatingCard delay={0.3}>
            <button
            onClick={handleNearMe}
            className="px-8 py-4 glass text-black rounded-xl hover:glass-light transition-all font-semibold glass-hover mb-8 border border-gray-300 hover:border-gray-400 transform hover:scale-110 active:scale-95 btn-bubble flex items-center gap-2 mx-auto"
            aria-label="Find businesses near me"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Find Businesses Near Me
            </button>
          </FloatingCard>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <FloatingCard delay={0.5}>
            <h2 className="text-3xl font-bold text-black mb-8 text-center animate-bounce-gentle">
              Browse by Category
            </h2>
          </FloatingCard>
          <FloatingCard delay={0.6}>
            <div className="glass rounded-3xl p-6 border border-gray-200 glass-hover">
              <CategoryChips />
            </div>
          </FloatingCard>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-black mb-8">
            Why LocaLink?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FloatingCard delay={0}>
              <div className="glass rounded-3xl p-8 border border-gray-200 glass-hover">
                <div className="w-16 h-16 glass-light rounded-2xl flex items-center justify-center mb-4 mx-auto animate-bounce-gentle border border-gray-300">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Local Focus</h3>
              <p className="text-gray-600">
                Discover authentic small businesses in your neighborhood
              </p>
              </div>
            </FloatingCard>
            <FloatingCard delay={0.2}>
              <div className="glass rounded-3xl p-8 border border-gray-700 glass-hover">
                <div className="w-16 h-16 glass-light rounded-2xl flex items-center justify-center mb-4 mx-auto animate-bounce-gentle border border-gray-600">
                <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Real Reviews</h3>
              <p className="text-gray-600">
                Read honest reviews from real customers
              </p>
              </div>
            </FloatingCard>
            <FloatingCard delay={0.4}>
              <div className="glass rounded-3xl p-8 border border-gray-200 glass-hover">
                <div className="w-16 h-16 glass-light rounded-2xl flex items-center justify-center mb-4 mx-auto animate-bounce-gentle border border-gray-300">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Special Deals</h3>
              <p className="text-gray-600">
                Find exclusive coupons and deals from local businesses
              </p>
              </div>
            </FloatingCard>
          </div>
        </div>
      </div>
    </div>
  )
}

