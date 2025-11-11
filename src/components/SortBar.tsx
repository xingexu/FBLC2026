/**
 * Sort bar component
 * Provides sorting options for business listings
 */
import { useAppStore } from '../store'
import { SortOption } from '../types'

export function SortBar() {
  const { filters, setSortBy } = useAppStore()

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'reviews', label: 'Most Reviews' },
    { value: 'distance', label: 'Nearest' },
    { value: 'name', label: 'Name (A-Z)' },
  ]

  return (
    <div className="flex items-center gap-4" role="group" aria-label="Sort options">
      <label className="text-sm font-medium text-gray-700">Sort by:</label>
      <select
        value={filters.sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Sort businesses"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

