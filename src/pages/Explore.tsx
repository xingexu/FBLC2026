/**
 * Explore page
 * Map and list view with filters, sorting, and radius search
 */
import { useState, useEffect, useMemo } from 'react'
import { MapView } from '../components/MapView'
import { BusinessCard } from '../components/BusinessCard'
import { CategoryChips } from '../components/CategoryChips'
import { SortBar } from '../components/SortBar'
import { DistanceSlider } from '../components/DistanceSlider'
import { EmptyState } from '../components/EmptyState'
import { useAppStore } from '../store'
import { getAllBusinesses, searchBusinesses } from '../db/repo'
import { Business } from '../types'
import { haversineDistance } from '../utils/geo'
import { fetchNearbyBusinesses } from '../overpass/fetchNearby'

export function Explore() {
  const { filters, userLocation, setUserLocation } = useAppStore()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list')

  useEffect(() => {
    loadBusinesses()
  }, [filters.category, filters.searchText, filters.radius, userLocation])

  const loadBusinesses = async () => {
    setLoading(true)
    try {
      let allBusinesses: Business[] = []

      // If user location is set, try to fetch from Overpass API
      if (userLocation) {
        try {
          const nearby = await fetchNearbyBusinesses(
            userLocation.lat,
            userLocation.lng,
            filters.radius
          )
          allBusinesses = nearby
        } catch (error) {
          console.warn('Overpass API failed, using seed data:', error)
          allBusinesses = await getAllBusinesses()
        }
      } else {
        allBusinesses = await getAllBusinesses()
      }

      // Filter by category
      if (filters.category) {
        allBusinesses = allBusinesses.filter((b) =>
          b.categories.includes(filters.category!)
        )
      }

      // Filter by search text
      if (filters.searchText) {
        allBusinesses = await searchBusinesses(
          filters.searchText,
          filters.category || undefined
        )
      }

      // Filter by distance if user location is set
      if (userLocation) {
        allBusinesses = allBusinesses.filter((b) => {
          const distance = haversineDistance(
            userLocation.lat,
            userLocation.lng,
            b.lat,
            b.lng
          )
          return distance <= filters.radius
        })
      }

      setBusinesses(allBusinesses)
    } catch (error) {
      console.error('Error loading businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  const sortedBusinesses = useMemo(() => {
    const sorted = [...businesses]

    switch (filters.sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.avgRating - a.avgRating)
      case 'reviews':
        return sorted.sort((a, b) => b.ratingCount - a.ratingCount)
      case 'distance':
        if (userLocation) {
          return sorted.sort((a, b) => {
            const distA = haversineDistance(
              userLocation.lat,
              userLocation.lng,
              a.lat,
              a.lng
            )
            const distB = haversineDistance(
              userLocation.lat,
              userLocation.lng,
              b.lat,
              b.lng
            )
            return distA - distB
          })
        }
        return sorted
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return sorted
    }
  }, [businesses, filters.sortBy, userLocation])

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert('Unable to get your location. Please enable location services.')
        }
      )
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">Explore Businesses</h1>
        <p className="text-lg text-gray-600 mb-6">Discover local businesses in Toronto</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleGetLocation}
            className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 transition-all font-medium text-sm glass-hover"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use My Location
            </span>
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            className="px-5 py-2.5 glass text-black rounded-lg hover:glass-light transition-all font-medium text-sm glass-hover border border-gray-300"
          >
            <span className="flex items-center gap-2">
              {viewMode === 'map' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  List View
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Map View
                </>
              )}
            </span>
          </button>
        </div>

        <div className="mb-4 glass rounded-2xl p-4 border border-gray-200">
          <CategoryChips />
        </div>

        <div className="flex flex-wrap gap-4 mb-6 glass rounded-2xl p-4 border border-gray-200">
          <SortBar />
          <div className="flex-1 min-w-[200px]">
            <DistanceSlider />
          </div>
        </div>
      </div>

      {sortedBusinesses.length === 0 ? (
        <EmptyState
          title="No businesses found"
          message="Try adjusting your filters or search criteria"
        />
      ) : viewMode === 'map' ? (
        <div className="h-[600px] rounded-lg overflow-hidden">
          <MapView
            businesses={sortedBusinesses}
            userLocation={userLocation}
            center={userLocation ? [userLocation.lat, userLocation.lng] : [43.6532, -79.3832]}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              showDistance={!!userLocation}
            />
          ))}
        </div>
      )}
    </div>
  )
}

