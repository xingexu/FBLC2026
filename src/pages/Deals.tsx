/**
 * Deals page
 * Shows all active deals with filtering by category and expiry
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Deal, Business } from '../types'
import { getActiveDeals, getAllBusinesses } from '../db/repo'
import { DealCard } from '../components/DealCard'
import { CategoryChips } from '../components/CategoryChips'
import { useAppStore } from '../store'

export function Deals() {
  const { filters } = useAppStore()
  const [deals, setDeals] = useState<Deal[]>([])
  const [businesses, setBusinesses] = useState<Map<string, Business>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDeals()
  }, [filters.category])

  const loadDeals = async () => {
    setLoading(true)
    try {
      // Load deals and businesses in parallel
      const [allDeals, allBusinesses] = await Promise.all([
        getActiveDeals(),
        getAllBusinesses(),
      ])
      
      const businessMap = new Map<string, Business>()
      allBusinesses.forEach((b) => businessMap.set(b.id, b))

      // Filter by category if selected
      let filteredDeals = allDeals
      if (filters.category) {
        filteredDeals = allDeals.filter((deal) => {
          const business = businessMap.get(deal.businessId)
          return business?.categories.includes(filters.category!)
        })
      }

      // Sort by expiry date (soonest first)
      filteredDeals.sort((a, b) => {
        const dateA = new Date(a.endDate).getTime()
        const dateB = new Date(b.endDate).getTime()
        return dateA - dateB
      })

      setDeals(filteredDeals)
      setBusinesses(businessMap)
    } catch (error) {
      console.error('Error loading deals:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && deals.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="mb-8 glass rounded-2xl p-5 border border-gray-200 shadow-sm skeleton-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="flex gap-2 flex-wrap">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-20"></div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-gray-200 skeleton-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">Special Deals & Coupons</h1>
        <p className="text-lg text-gray-600 mb-6">Find exclusive offers from local businesses</p>
      </div>

      <div className="mb-8 glass rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Categories</h2>
        <CategoryChips />
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-12 glass rounded-2xl p-8 border border-gray-200">
          <p className="text-gray-700 text-lg font-semibold">No active deals found</p>
          <p className="text-gray-500 mt-2">
            {filters.category
              ? 'Try selecting a different category'
              : 'Check back later for new deals!'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => {
            const business = businesses.get(deal.businessId)
            if (!business) return null

            return (
              <div key={deal.id} className="glass rounded-2xl p-6 border border-gray-200 card-hover shadow-md hover:shadow-xl">
                <div className="mb-4">
                  <Link
                    to={`/business/${business.id}`}
                    className="text-black hover:text-gray-700 font-bold text-lg transition-colors"
                  >
                    {business.name}
                  </Link>
                </div>
                <DealCard deal={deal} business={business} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

