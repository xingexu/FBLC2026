/**
 * Distance slider component
 * Allows users to filter businesses by distance radius
 */
import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '../store'

export function DistanceSlider() {
  const { filters, setRadius } = useAppStore()
  const [localRadius, setLocalRadius] = useState(filters.radius)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>()

  // Update local radius when store radius changes (from external sources)
  useEffect(() => {
    setLocalRadius(filters.radius)
  }, [filters.radius])

  const handleChange = (value: number) => {
    setLocalRadius(value)
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    // Debounce the actual store update
    debounceTimerRef.current = setTimeout(() => {
      setRadius(value)
    }, 100) // Wait 100ms after user stops dragging for smoother updates
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-800 mb-3">
        Search radius: <span className="font-bold text-black">{localRadius} km</span>
      </label>
      <div className="relative">
        <input
          type="range"
          min="1"
          max="20"
          step="1"
          value={localRadius}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer distance-slider"
          style={{
            background: `linear-gradient(to right, black 0%, black ${((localRadius - 1) / 19) * 100}%, #e5e7eb ${((localRadius - 1) / 19) * 100}%, #e5e7eb 100%)`
          }}
          aria-label={`Search radius: ${localRadius} kilometers`}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span className="font-medium">1 km</span>
          <span className="font-medium">20 km</span>
        </div>
      </div>
    </div>
  )
}

