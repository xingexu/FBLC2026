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
      const allBusinesses = await getAllBusinesses()
      const topRatedBusinesses = [...allBusinesses]
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 20)

      const bookmarkedBusinesses = await getBookmarkedBusinesses(currentUserId)

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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Reports & Exports</h1>
        <p className="text-lg text-gray-600">Export your data in CSV or PDF format</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 card-hover">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Top Rated Businesses</h2>
          <p className="text-gray-600 mb-4">
            Export the top 20 highest-rated businesses
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleExportTopRatedCSV}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportTopRatedPDF}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 card-hover">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">My Bookmarks</h2>
          <p className="text-gray-600 mb-4">
            Export your bookmarked businesses
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleExportBookmarksCSV}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportBookmarksPDF}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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

