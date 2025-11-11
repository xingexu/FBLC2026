/**
 * PDF export utility using jsPDF
 * Exports business data to PDF format for reports
 */
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Business, Bookmark } from '../types'

/**
 * Export businesses to PDF
 * @param businesses Array of businesses to export
 * @param title Report title
 * @param filename Output filename
 */
export function exportBusinessesToPDF(
  businesses: Business[],
  title: string = 'Business Directory',
  filename: string = 'businesses.pdf'
): void {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(18)
  doc.text(title, 14, 22)

  // Add date
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)

  // Prepare table data
  const tableData = businesses.map((business) => [
    business.name,
    business.categories.join(', '),
    business.address,
    business.phone || 'N/A',
    business.avgRating.toFixed(1),
    business.ratingCount.toString(),
  ])

  // Add table
  autoTable(doc, {
    head: [['Name', 'Categories', 'Address', 'Phone', 'Rating', 'Reviews']],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 64, 175] },
  })

  // Save PDF
  doc.save(filename)
}

/**
 * Export bookmarks to PDF
 * @param bookmarks Array of bookmarks
 * @param businesses Map of business ID to business
 * @param filename Output filename
 */
export function exportBookmarksToPDF(
  bookmarks: Bookmark[],
  businesses: Map<string, Business>,
  filename: string = 'bookmarks.pdf'
): void {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(18)
  doc.text('My Bookmarks', 14, 22)

  // Add date
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30)

  // Prepare table data
  const tableData = bookmarks
    .map((bookmark) => {
      const business = businesses.get(bookmark.businessId)
      if (!business) return null
      return [
        business.name,
        business.categories.join(', '),
        business.address,
        business.phone || 'N/A',
        business.avgRating.toFixed(1),
        new Date(bookmark.createdAt).toLocaleDateString(),
      ]
    })
    .filter((row): row is string[] => row !== null)

  // Add table
  autoTable(doc, {
    head: [['Name', 'Categories', 'Address', 'Phone', 'Rating', 'Bookmarked']],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 64, 175] },
  })

  // Save PDF
  doc.save(filename)
}

