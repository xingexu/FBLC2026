/**
 * Report page
 * Export bookmarks and top-rated businesses to CSV and PDF
 */
import { useState, useEffect } from 'react'
import { getAllBusinesses, getBookmarkedBusinesses } from '../db/repo'
import { exportBusinessesToCSV, exportBookmarksToCSV } from '../export/csv'
import { exportBusinessesToPDF, exportBookmarksToPDF } from '../export/pdf'
import { useAppStore } from '../store'
import { Business } from '../types'

export function Report() {
  const { currentUserId } = useAppStore()
  const [topRated, setTopRated] = useState<Business[]>([])
  const [bookmarked, setBookmarked] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [currentUserId])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load data in parallel for faster loading
      const [allBusinesses, bookmarkedBusinesses] = await Promise.all([
        getAllBusinesses(),
        getBookmarkedBusinesses(currentUserId),
      ])
      
      const topRatedBusinesses = [...allBusinesses]
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 20)

      setTopRated(topRatedBusinesses)
      setBookmarked(bookmarkedBusinesses)
    } catch (error) {
      console.error('Error loading report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportTopRatedCSV = () => {
    exportBusinessesToCSV(topRated, 'top-rated-businesses.csv')
  }

  const handleExportTopRatedPDF = () => {
    exportBusinessesToPDF(topRated, 'Top Rated Businesses', 'top-rated-businesses.pdf')
  }

  const handleExportBookmarksCSV = () => {
    const businessMap = new Map<string, Business>()
    bookmarked.forEach((b) => businessMap.set(b.id, b))
    // We need bookmarks with business data - simplified for now
    exportBookmarksToCSV(
      bookmarked.map((b) => ({
        id: `bookmark-${b.id}`,
        userId: currentUserId,
        businessId: b.id,
        createdAt: new Date().toISOString(),
      })),
      businessMap,
      'my-bookmarks.csv'
    )
  }

  const handleExportBookmarksPDF = () => {
    const businessMap = new Map<string, Business>()
    bookmarked.forEach((b) => businessMap.set(b.id, b))
    exportBookmarksToPDF(
      bookmarked.map((b) => ({
        id: `bookmark-${b.id}`,
        userId: currentUserId,
        businessId: b.id,
        createdAt: new Date().toISOString(),
      })),
      businessMap,
      'my-bookmarks.pdf'
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-8 border border-gray-200 skeleton-pulse">
              <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex gap-4 mb-4">
                <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
                <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">Reports & Exports</h1>
        <p className="text-lg text-gray-600">Export your data in CSV or PDF format</p>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-2xl p-8 border border-gray-200 card-hover shadow-md hover:shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-black">Top Rated Businesses</h2>
          <p className="text-gray-600 mb-4">
            Export the top 20 highest-rated businesses
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleExportTopRatedCSV}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportTopRatedPDF}
              className="px-6 py-3 glass text-black rounded-xl hover:glass-light transition-all font-semibold border border-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Export PDF
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {topRated.length} businesses ready to export
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 border border-gray-200 card-hover shadow-md hover:shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-black">My Bookmarks</h2>
          <p className="text-gray-600 mb-4">
            Export your bookmarked businesses
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleExportBookmarksCSV}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportBookmarksPDF}
              className="px-6 py-3 glass text-black rounded-xl hover:glass-light transition-all font-semibold border border-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Export PDF
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {bookmarked.length} bookmarked businesses
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

