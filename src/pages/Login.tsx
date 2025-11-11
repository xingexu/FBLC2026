/**
 * Login page
 * Interactive login with username, password, remember me, captcha, and profile photo
 */
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppStore } from '../store'
import { addUser } from '../db/repo'
import { CaptchaSlider } from '../components/CaptchaSlider'
import { FloatingCard } from '../components/FloatingCard'

export function Login() {
  const navigate = useNavigate()
  const { setCurrentUserId } = useAppStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (!password) {
      setError('Please enter a password')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!captchaVerified) {
      setError('Please complete the verification')
      return
    }

    setLoading(true)

    try {
      // Create user
      const userId = `user-${Date.now()}`
      await addUser({
        id: userId,
        nickname: username.trim(),
        profilePhoto: profilePhoto || undefined,
        createdAt: new Date().toISOString(),
        verification: {
          emailVerified: false,
          lastCaptchaAt: new Date().toISOString(),
        },
      })

      // Store in localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem('localink_user', JSON.stringify({
          userId,
          username: username.trim(),
          profilePhoto,
        }))
      }

      setCurrentUserId(userId)
      
      // Navigate to location consent
      navigate('/location-consent')
    } catch (err) {
      console.error('Login error:', err)
      setError('Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Check for saved login on mount
  useEffect(() => {
    const saved = localStorage.getItem('localink_user')
    if (saved) {
      try {
        const { userId, username: savedUsername, profilePhoto: savedPhoto } = JSON.parse(saved)
        setUsername(savedUsername)
        if (savedPhoto) setProfilePhoto(savedPhoto)
        setCurrentUserId(userId)
        navigate('/location-consent')
      } catch (e) {
        // Invalid saved data
      }
    }
  }, [navigate, setCurrentUserId])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <FloatingCard>
        <div className="glass rounded-3xl p-8 w-full max-w-md border border-gray-200 glass-hover">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">LocaLink</h1>
          <p className="text-gray-600">Welcome back! Please sign in</p>
        </div>

        {/* Profile Photo Section */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-300">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors shadow-lg"
              aria-label="Upload profile photo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              autoFocus
              disabled={loading}
              aria-describedby={error ? 'username-error' : undefined}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              disabled={loading}
              aria-describedby={error ? 'password-error' : undefined}
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              disabled={loading}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          {/* Captcha */}
          <div>
            <CaptchaSlider
              onVerify={(verified) => {
                setCaptchaVerified(verified)
                if (verified) {
                  setError(null)
                }
              }}
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!captchaVerified || loading}
            className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-black hover:text-gray-700 font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
        </div>
      </FloatingCard>
    </div>
  )
}
