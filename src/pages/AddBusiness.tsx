/**
 * Add Business page
 * Form to manually add businesses with validation
 * Only accessible to admin users
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addBusiness, getUserById } from '../db/repo'
import { Business } from '../types'
import { useAppStore } from '../store'

const businessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  lat: z.number().min(43.58).max(43.76),
  lng: z.number().min(-79.50).max(-79.24),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
})

type BusinessFormData = z.infer<typeof businessSchema>

const CATEGORIES = [
  'food',
  'retail',
  'services',
  'health',
  'arts',
  'fitness',
  'repair',
  'books',
]

export function AddBusiness() {
  const navigate = useNavigate()
  const { currentUserId } = useAppStore()
  const [submitting, setSubmitting] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminAccess()
  }, [currentUserId])

  const checkAdminAccess = async () => {
    try {
      const user = await getUserById(currentUserId)
      if (user && user.role === 'admin') {
        setIsAdmin(true)
      } else {
        // Redirect non-admin users
        navigate('/home')
      }
    } catch (error) {
      console.error('Error checking admin access:', error)
      navigate('/home')
    } finally {
      setLoading(false)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
  })

  // Default coordinates for Toronto
  watch('lat', 43.6532)
  watch('lng', -79.3832)

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(newCategories)
    setValue('categories', newCategories)
  }

  const onSubmit = async (data: BusinessFormData) => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category')
      return
    }

    setSubmitting(true)
    try {
      const business: Business = {
        id: `biz-${Date.now()}`,
        name: data.name,
        categories: selectedCategories,
        tags: [],
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        website: data.website || undefined,
        phone: data.phone || undefined,
        hours: [
          { day: 'Monday', open: '09:00', close: '18:00' },
          { day: 'Tuesday', open: '09:00', close: '18:00' },
          { day: 'Wednesday', open: '09:00', close: '18:00' },
          { day: 'Thursday', open: '09:00', close: '18:00' },
          { day: 'Friday', open: '09:00', close: '18:00' },
          { day: 'Saturday', open: '10:00', close: '17:00' },
          { day: 'Sunday', open: 'closed', close: 'closed' },
        ],
        avgRating: 0,
        ratingCount: 0,
        deals: [],
      }

      await addBusiness(business)
      alert('Business added successfully!')
      navigate(`/business/${business.id}`)
    } catch (error) {
      console.error('Error adding business:', error)
      alert('Failed to add business. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="glass rounded-2xl p-8 md:p-12 max-w-2xl mx-auto border border-gray-200 skeleton-pulse">
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
            <div className="h-14 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">Add a Business</h1>
        <p className="text-lg text-gray-600">Help us grow the directory by adding a local business</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-8 md:p-12 max-w-2xl mx-auto border border-gray-200 shadow-md hover:shadow-xl">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 glass border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories *
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-black text-white border border-black'
                      : 'glass text-gray-700 hover:glass-light border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {errors.categories && (
              <p className="mt-1 text-sm text-red-600">{errors.categories.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              id="address"
              type="text"
              {...register('address')}
              className="w-full px-3 py-2 glass border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-2">
                Latitude *
              </label>
              <input
                id="lat"
                type="number"
                step="0.0001"
                {...register('lat', { valueAsNumber: true })}
                className="w-full px-3 py-2 glass border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
              {errors.lat && (
                <p className="mt-1 text-sm text-red-600">{errors.lat.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-2">
                Longitude *
              </label>
              <input
                id="lng"
                type="number"
                step="0.0001"
                {...register('lng', { valueAsNumber: true })}
                className="w-full px-3 py-2 glass border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
              {errors.lng && (
                <p className="mt-1 text-sm text-red-600">{errors.lng.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              id="website"
              type="url"
              {...register('website')}
              className="w-full px-3 py-2 glass border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              placeholder="https://example.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className="w-full px-3 py-2 glass border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              placeholder="+14165551234"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              'Add Business'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

