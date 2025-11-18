/**
 * Geographic utility functions
 * Implements Haversine formula for accurate distance calculation
 */

/**
 * Earth's mean radius in kilometers (WGS84 ellipsoid)
 * This is the most accurate constant for the Haversine formula
 */
const EARTH_RADIUS_KM = 6371.0088

/**
 * Convert degrees to radians with full precision
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Calculate distance between two coordinates using the Haversine formula
 * This is the most accurate formula for calculating great-circle distances
 * between two points on a sphere (Earth).
 * 
 * Accuracy: Within 0.5% for most practical purposes
 * 
 * @param lat1 Latitude of first point in degrees (-90 to 90)
 * @param lng1 Longitude of first point in degrees (-180 to 180)
 * @param lat2 Latitude of second point in degrees (-90 to 90)
 * @param lng2 Longitude of second point in degrees (-180 to 180)
 * @returns Distance in kilometers (full precision, no rounding)
 * 
 * @throws Error if coordinates are invalid
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  // Validate input coordinates
  if (
    !Number.isFinite(lat1) || !Number.isFinite(lng1) ||
    !Number.isFinite(lat2) || !Number.isFinite(lng2)
  ) {
    throw new Error('Invalid coordinates: all values must be finite numbers')
  }

  if (
    lat1 < -90 || lat1 > 90 || lat2 < -90 || lat2 > 90 ||
    lng1 < -180 || lng1 > 180 || lng2 < -180 || lng2 > 180
  ) {
    throw new Error('Invalid coordinates: latitude must be -90 to 90, longitude must be -180 to 180')
  }

  // Convert to radians with full precision
  const φ1 = toRadians(lat1) // φ (phi) is latitude
  const φ2 = toRadians(lat2)
  const Δφ = toRadians(lat2 - lat1) // Δ (delta) is difference
  const Δλ = toRadians(lng2 - lng1) // λ (lambda) is longitude

  // Haversine formula
  // a = sin²(Δφ/2) + cos(φ1) * cos(φ2) * sin²(Δλ/2)
  const sinHalfDeltaLat = Math.sin(Δφ / 2)
  const sinHalfDeltaLng = Math.sin(Δλ / 2)
  
  const a =
    sinHalfDeltaLat * sinHalfDeltaLat +
    Math.cos(φ1) * Math.cos(φ2) * sinHalfDeltaLng * sinHalfDeltaLng

  // c = 2 * atan2(√a, √(1-a))
  // This is the more numerically stable version
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  // Distance = R * c
  // Return with full precision (no rounding)
  return EARTH_RADIUS_KM * c
}

/**
 * Calculate bounding box from center point and radius
 * @param lat Center latitude
 * @param lng Center longitude
 * @param radiusKm Radius in kilometers
 * @returns Bounding box { north, south, east, west }
 */
export function calculateBoundingBox(
  lat: number,
  lng: number,
  radiusKm: number
): { north: number; south: number; east: number; west: number } {
  // Approximate conversion: 1 degree latitude ≈ 111 km
  const latDelta = radiusKm / 111
  // Longitude delta depends on latitude
  const lngDelta = radiusKm / (111 * Math.cos(toRadians(lat)))

  return {
    north: lat + latDelta,
    south: lat - latDelta,
    east: lng + lngDelta,
    west: lng - lngDelta,
  }
}

