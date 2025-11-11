/**
 * Deal card component
 * Displays special deals and coupons
 */
import { Deal, Business } from '../types'
import { useState } from 'react'

interface DealCardProps {
  deal: Deal
  business: Business
}

export function DealCard({ deal, business }: DealCardProps) {
  const [copied, setCopied] = useState(false)

  const isActive =
    new Date(deal.startDate) <= new Date() &&
    new Date(deal.endDate) >= new Date()

  const handleCopyCode = () => {
    navigator.clipboard.writeText(deal.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isActive) return null

  return (
    <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-2xl p-6 border-2 border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">{deal.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{deal.description}</p>
        </div>
        <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">
          {business.name}
        </span>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-3">
          <span className="text-lg font-mono font-bold bg-white px-4 py-2 rounded-xl border-2 border-primary-300 text-primary-700 shadow-md">
            {deal.code}
          </span>
          <button
            onClick={handleCopyCode}
            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            aria-label={`Copy code ${deal.code}`}
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>
        <span className="text-sm text-gray-600 font-medium bg-white px-3 py-1 rounded-lg border border-gray-200">
          Expires: {new Date(deal.endDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}

