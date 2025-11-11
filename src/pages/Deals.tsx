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
      const allDeals = await getActiveDeals()
      const allBusinesses = await getAllBusinesses()
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Special Deals & Coupons</h1>
        <p className="text-lg text-gray-600 mb-6">Find exclusive offers from local businesses</p>
      </div>

      <div className="mb-8 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <CategoryChips />
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No active deals found</p>
          <p className="text-gray-400 mt-2">
            {filters.category
              ? 'Try selecting a different category'
              : 'Check back later for new deals!'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {deals.map((deal) => {
            const business = businesses.get(deal.businessId)
            if (!business) return null

            return (
              <div key={deal.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 card-hover">
                <div className="mb-4">
                  <Link
                    to={`/business/${business.id}`}
                    className="text-primary-600 hover:text-primary-700 font-bold text-lg transition-colors"
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

