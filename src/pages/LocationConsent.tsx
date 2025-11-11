/**
 * Location consent page
 * Asks user for permission to use their location
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { FloatingCard } from '../components/FloatingCard'

export function LocationConsent() {
  const navigate = useNavigate()
  const { setUserLocation, setHasCompletedLocationConsent } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAllowLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setHasCompletedLocationConsent(true)
        navigate('/home')
      },
      (error) => {
        console.error('Geolocation error:', error)
        let errorMessage = 'Unable to get your location.'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. You can still use the app without location.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        
        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const handleSkip = () => {
    setUserLocation(null)
    setHasCompletedLocationConsent(true)
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingCard>
        <div className="glass rounded-3xl p-8 w-full max-w-md border border-gray-200 glass-hover">
        <div className="text-center mb-8">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enable Location Services</h1>
          <p className="text-gray-600">
            Help us show you businesses near you
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Find nearby businesses</p>
              <p className="text-sm text-gray-600">See businesses sorted by distance</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Get directions</p>
              <p className="text-sm text-gray-600">Quick access to Google Maps directions</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Personalized recommendations</p>
              <p className="text-sm text-gray-600">Better suggestions based on your location</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleAllowLocation}
            disabled={loading}
            className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
          >
            {loading ? 'Getting location...' : 'Allow Location Access'}
          </button>

          <button
            onClick={handleSkip}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Skip for Now
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Your location data is stored locally and never shared with third parties.
        </p>
        </div>
      </FloatingCard>
    </div>
  )
}

