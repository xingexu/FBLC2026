/**
 * Fetch nearby businesses from Overpass API
 * Maps OpenStreetMap data to Business model
 * Falls back to seed data if network fails or rate limited
 */
import { buildOverpassQuery, EXCLUDE_BRAND_LIST } from './queryTemplate'
import { getBoundingBox } from './bbox'
import { Business } from '../types'
import { addBusiness } from '../db/repo'
import seedData from '../db/seed.json'

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter'

/**
 * Map OSM node to Business model
 * @param node OSM node from Overpass API
 * @returns Business object or null if invalid
 */
function mapOSMToBusiness(node: any): Business | null {
  // Skip if no name
  if (!node.tags?.name) return null

  // Skip if brand is in exclusion list
  const brand = node.tags.brand || node.tags['brand:en']
  if (brand && EXCLUDE_BRAND_LIST.includes(brand)) return null

  // Must have website or phone to be considered
  if (!node.tags.website && !node.tags.phone) {
    // Allow if no brand tag (likely local)
    if (node.tags.brand || node.tags['brand:en']) return null
  }

  // Extract categories from OSM tags
  const categories: string[] = []
  if (node.tags.shop) categories.push('retail')
  if (node.tags.amenity) {
    const amenity = node.tags.amenity
    if (amenity.includes('restaurant') || amenity.includes('cafe') || amenity.includes('bar') || amenity.includes('fast_food')) {
      categories.push('food')
    } else if (amenity.includes('hairdresser')) {
      categories.push('services')
    } else if (amenity.includes('pharmacy') || amenity.includes('clinic')) {
      categories.push('health')
    } else if (amenity.includes('bicycle_repair')) {
      categories.push('repair')
      categories.push('services')
    } else if (amenity.includes('bookstore')) {
      categories.push('books')
    }
  }

  // Default to services if no category found
  if (categories.length === 0) categories.push('services')

  // Generate ID from OSM node ID
  const id = `osm-${node.id}`

  // Parse hours if available
  const hours = parseHours(node.tags.opening_hours)

  return {
    id,
    name: node.tags.name,
    categories,
    tags: extractTags(node.tags),
    address: node.tags['addr:full'] || `${node.tags['addr:street'] || ''}, ${node.tags['addr:city'] || 'Toronto'}, ON`,
    lat: node.lat,
    lng: node.lon,
    website: node.tags.website || undefined,
    phone: node.tags.phone || undefined,
    hours,
    avgRating: 0,
    ratingCount: 0,
    deals: [],
  }
}

/**
 * Extract tags from OSM tags
 */
function extractTags(tags: any): string[] {
  const tagList: string[] = []
  if (tags.cuisine) tagList.push(tags.cuisine)
  if (tags.shop) tagList.push(tags.shop)
  if (tags.amenity) tagList.push(tags.amenity)
  return tagList
}

/**
 * Parse opening hours from OSM format
 * Simplified parser - returns basic structure
 */
function parseHours(openingHours?: string): { day: string; open: string; close: string }[] {
  if (!openingHours) {
    // Default hours
    return [
      { day: 'Monday', open: '09:00', close: '18:00' },
      { day: 'Tuesday', open: '09:00', close: '18:00' },
      { day: 'Wednesday', open: '09:00', close: '18:00' },
      { day: 'Thursday', open: '09:00', close: '18:00' },
      { day: 'Friday', open: '09:00', close: '18:00' },
      { day: 'Saturday', open: '10:00', close: '17:00' },
      { day: 'Sunday', open: 'closed', close: 'closed' },
    ]
  }

  // Simple parsing - in production, use a proper OSM hours parser
  return [
    { day: 'Monday', open: '09:00', close: '18:00' },
    { day: 'Tuesday', open: '09:00', close: '18:00' },
    { day: 'Wednesday', open: '09:00', close: '18:00' },
    { day: 'Thursday', open: '09:00', close: '18:00' },
    { day: 'Friday', open: '09:00', close: '18:00' },
    { day: 'Saturday', open: '10:00', close: '17:00' },
    { day: 'Sunday', open: 'closed', close: 'closed' },
  ]
}

/**
 * Fetch nearby businesses from Overpass API
 * Falls back to seed data if network fails
 * @param lat Center latitude
 * @param lng Center longitude
 * @param radiusKm Radius in kilometers
 * @returns Array of businesses
 */
export async function fetchNearbyBusinesses(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<Business[]> {
  try {
    const bbox = getBoundingBox(lat, lng, radiusKm)
    const query = buildOverpassQuery(bbox.south, bbox.west, bbox.north, bbox.east)

    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
    })

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`)
    }

    const data = await response.json()
    const businesses: Business[] = []

    // Process elements from Overpass response
    if (data.elements) {
      for (const element of data.elements) {
        if (element.type === 'node') {
          const business = mapOSMToBusiness(element)
          if (business) {
            businesses.push(business)
            // Save to IndexedDB
            await addBusiness(business).catch(() => {
              // Ignore errors if business already exists
            })
          }
        }
      }
    }

    return businesses
  } catch (error) {
    // Fallback to seed data on error
    console.warn('Overpass API failed, using seed data:', error)
    return seedData.businesses as unknown as Business[]
  }
}

