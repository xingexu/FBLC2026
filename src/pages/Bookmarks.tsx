/**
 * Bookmarks page
 * Shows all bookmarked businesses
 */
import { useState, useEffect } from 'react'
import { BusinessCard } from '../components/BusinessCard'
import { EmptyState } from '../components/EmptyState'
import { getBookmarkedBusinesses } from '../db/repo'
import { useAppStore } from '../store'
import { Business } from '../types'

export function Bookmarks() {
  const { currentUserId } = useAppStore()
  const [bookmarkedBusinesses, setBookmarkedBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookmarks()
  }, [currentUserId])

  const loadBookmarks = async () => {
    setLoading(true)
    try {
      const businesses = await getBookmarkedBusinesses(currentUserId)
      setBookmarkedBusinesses(businesses)
    } catch (error) {
      console.error('Error loading bookmarks:', error)
    } finally {
      setLoading(false)
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">My Bookmarks</h1>
        <p className="text-lg text-gray-600">Your saved favorite businesses</p>
      </div>

      {bookmarkedBusinesses.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          message="Start exploring and bookmark your favorite businesses!"
          actionLabel="Explore Businesses"
          onAction={() => (window.location.href = '/explore')}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} showDistance />
          ))}
        </div>
      )}
    </div>
  )
}

