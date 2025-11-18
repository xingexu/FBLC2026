/**
 * Business card component
 * Displays business information in a card format
 */
import { memo } from 'react'
import { Business } from '../types'
import { RatingStars } from './RatingStars'
import { Link } from 'react-router-dom'

interface BusinessCardProps {
  business: Business
  showDistance?: boolean
  distance?: number | null
}

export const BusinessCard = memo(function BusinessCard({ 
  business, 
  showDistance = false,
  distance = null 
}: BusinessCardProps) {

  return (
    <Link
      to={`/business/${business.id}`}
      className="block glass rounded-2xl hover:glass-light transition-all duration-500 p-6 card-hover border border-gray-200 animate-bubble-pop h-full flex flex-col shadow-md hover:shadow-xl"
      aria-label={`View details for ${business.name}`}
    >
      {/* Header with name and distance */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-black group-hover:text-gray-700 transition-colors flex-1 pr-2 line-clamp-2">
          {business.name}
        </h3>
        {showDistance && distance !== null && (
          <span className="text-xs font-semibold text-white bg-black px-3 py-1.5 rounded-full whitespace-nowrap ml-2 shadow-md">
            {distance.toFixed(1)} km
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <RatingStars rating={business.avgRating} size="sm" showNumber />
        <span className="text-xs text-gray-500 font-medium">
          ({business.ratingCount})
        </span>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-4">
        {business.categories.slice(0, 3).map((category) => (
          <span
            key={category}
            className="px-3 py-1 text-xs font-semibold glass text-gray-700 rounded-lg border border-gray-300 capitalize"
          >
            {category}
          </span>
        ))}
        {business.categories.length > 3 && (
          <span className="px-3 py-1 text-xs font-semibold text-gray-500">
            +{business.categories.length - 3}
          </span>
        )}
      </div>

      {/* Address */}
      <p className="text-sm text-gray-600 mb-4 flex items-start gap-2 flex-1">
        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="line-clamp-2">{business.address}</span>
      </p>

      {/* Contact info */}
      <div className="flex gap-4 text-xs text-gray-500 pt-4 border-t border-gray-200">
        {business.phone && (
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="truncate">{business.phone}</span>
          </span>
        )}
        {business.website && (
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span>Website</span>
          </span>
        )}
      </div>
    </Link>
  )
})

