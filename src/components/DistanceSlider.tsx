/**
 * Distance slider component
 * Allows users to filter businesses by distance radius
 */
import { useAppStore } from '../store'

export function DistanceSlider() {
  const { filters, setRadius } = useAppStore()

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Search radius: {filters.radius} km
      </label>
      <input
        type="range"
        min="1"
        max="20"
        step="1"
        value={filters.radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        aria-label={`Search radius: ${filters.radius} kilometers`}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>1 km</span>
        <span>20 km</span>
      </div>
    </div>
  )
}

