/**
 * Bounding box utilities for Overpass API queries
 * Calculates bounding boxes from center point and radius
 */
import { calculateBoundingBox } from '../utils/geo'

/**
 * Generate bounding box for Overpass API query
 * @param lat Center latitude
 * @param lng Center longitude
 * @param radiusKm Radius in kilometers
 * @returns Bounding box { north, south, east, west }
 */
export function getBoundingBox(
  lat: number,
  lng: number,
  radiusKm: number
): { north: number; south: number; east: number; west: number } {
  return calculateBoundingBox(lat, lng, radiusKm)
}

