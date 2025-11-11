/**
 * Business card component
 * Displays business information in a card format
 */
import { Business } from '../types'
import { RatingStars } from './RatingStars'
import { Link } from 'react-router-dom'
import { haversineDistance } from '../utils/geo'
import { useAppStore } from '../store'

interface BusinessCardProps {
  business: Business
  showDistance?: boolean
}

export function BusinessCard({ business, showDistance = false }: BusinessCardProps) {
  const { userLocation } = useAppStore()

  const distance = userLocation
    ? haversineDistance(
        userLocation.lat,
        userLocation.lng,
        business.lat,
        business.lng
      )
    : null

  return (
    <Link
      to={`/business/${business.id}`}
      className="block glass rounded-xl hover:glass-light transition-all duration-300 p-6 card-hover border border-gray-200 animate-bubble-pop"
      aria-label={`View details for ${business.name}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-black group-hover:text-gray-700 transition-colors">{business.name}</h3>
        {showDistance && distance !== null && (
          <span className="text-sm font-medium text-black glass-light px-3 py-1 rounded-full whitespace-nowrap ml-2 border border-gray-300">
            {distance.toFixed(1)} km
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <RatingStars rating={business.avgRating} size="sm" showNumber />
        <span className="text-sm text-gray-500">
          ({business.ratingCount} reviews)
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {business.categories.map((category) => (
          <span
            key={category}
            className="px-3 py-1 text-xs font-medium glass text-black rounded-full border border-gray-300"
          >
            {category}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {business.address}
      </p>

      <div className="flex gap-4 text-sm text-gray-500">
        {business.phone && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {business.phone}
          </span>
        )}
        {business.website && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Website
          </span>
        )}
      </div>
    </Link>
  )
}

