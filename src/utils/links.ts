/**
 * Link sanitization and validation utilities
 * Ensures safe URLs for website and phone links
 */

/**
 * Sanitize and validate a website URL
 * @param url Raw URL string
 * @returns Validated URL or null if invalid
 */
export function sanitizeWebsite(url: string | undefined): string | null {
  if (!url) return null

  try {
    // Add protocol if missing
    let normalized = url.trim()
    if (!normalized.match(/^https?:\/\//i)) {
      normalized = `https://${normalized}`
    }

    const urlObj = new URL(normalized)

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return null
    }

    // Basic validation: must have a domain
    if (!urlObj.hostname || urlObj.hostname.length < 3) {
      return null
    }

    return normalized
  } catch {
    return null
  }
}

/**
 * Sanitize and validate a phone number
 * @param phone Raw phone string
 * @returns Validated tel: link or null if invalid
 */
export function sanitizePhone(phone: string | undefined): string | null {
  if (!phone) return null

  // Remove all non-digit characters except + at start
  const cleaned = phone.replace(/[^\d+]/g, '')

  // Must have at least 10 digits (North American format)
  const digitsOnly = cleaned.replace(/\+/g, '')
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return null
  }

  return `tel:${cleaned}`
}

/**
 * Generate Google Maps directions link
 * @param lat Latitude
 * @param lng Longitude
 * @param address Optional address string
 * @returns Google Maps URL
 */
export function getDirectionsLink(
  lat: number,
  lng: number,
  address?: string
): string {
  if (address) {
    // URL encode the address
    const encodedAddress = encodeURIComponent(address)
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

