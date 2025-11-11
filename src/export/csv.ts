/**
 * CSV export utility
 * Exports business data to CSV format for analysis
 */
import { Business, Bookmark } from '../types'

/**
 * Escape CSV field value
 * Handles commas, quotes, and newlines
 */
function escapeCSVField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * Export businesses to CSV
 * @param businesses Array of businesses to export
 * @param filename Output filename
 */
export function exportBusinessesToCSV(
  businesses: Business[],
  filename: string = 'businesses.csv'
): void {
  const headers = [
    'Name',
    'Categories',
    'Address',
    'Phone',
    'Website',
    'Rating',
    'Review Count',
    'Latitude',
    'Longitude',
  ]

  const rows = businesses.map((business) => [
    business.name,
    business.categories.join('; '),
    business.address,
    business.phone || '',
    business.website || '',
    business.avgRating.toString(),
    business.ratingCount.toString(),
    business.lat.toString(),
    business.lng.toString(),
  ])

  const csvContent = [
    headers.map(escapeCSVField).join(','),
    ...rows.map((row) => row.map(escapeCSVField).join(',')),
  ].join('\n')

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export bookmarks to CSV
 * @param bookmarks Array of bookmarks
 * @param businesses Map of business ID to business
 * @param filename Output filename
 */
export function exportBookmarksToCSV(
  bookmarks: Bookmark[],
  businesses: Map<string, Business>,
  filename: string = 'bookmarks.csv'
): void {
  const headers = [
    'Business Name',
    'Categories',
    'Address',
    'Phone',
    'Website',
    'Rating',
    'Bookmarked Date',
  ]

  const rows = bookmarks
    .map((bookmark) => {
      const business = businesses.get(bookmark.businessId)
      if (!business) return null
      return [
        business.name,
        business.categories.join('; '),
        business.address,
        business.phone || '',
        business.website || '',
        business.avgRating.toString(),
        new Date(bookmark.createdAt).toLocaleDateString(),
      ]
    })
    .filter((row): row is string[] => row !== null)

  const csvContent = [
    headers.map(escapeCSVField).join(','),
    ...rows.map((row) => row.map(escapeCSVField).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

