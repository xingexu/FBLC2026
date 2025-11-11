/**
 * Slider captcha component
 * Implements a simple slider-based bot verification
 */
import { useState, useRef, useEffect } from 'react'

interface CaptchaSliderProps {
  onVerify: (verified: boolean) => void
  disabled?: boolean
}

export function CaptchaSlider({ onVerify, disabled = false }: CaptchaSliderProps) {
  const [position, setPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const handleStart = (clientX: number) => {
    if (disabled) return
    setIsDragging(true)
    handleMove(clientX)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging || !trackRef.current) return

    const trackRect = trackRef.current.getBoundingClientRect()
    const newPosition = Math.max(
      0,
      Math.min(100, ((clientX - trackRect.left) / trackRect.width) * 100)
    )
    setPosition(newPosition)
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    // Verify if slider is at least 80% to the right
    const verified = position >= 80
    onVerify(verified)

    if (!verified) {
      // Reset position
      setTimeout(() => setPosition(0), 300)
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const handleMouseUp = () => handleEnd()

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, position])

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Slide to verify you're human
      </label>
      <div
        ref={trackRef}
        className="relative w-full h-12 bg-gray-200 rounded-full overflow-hidden"
        role="slider"
        aria-valuenow={position}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Verification slider"
      >
        <div
          ref={sliderRef}
          className="absolute left-0 top-0 h-full bg-primary-600 transition-all duration-300"
          style={{ width: `${position}%` }}
        />
        <div
          className="absolute top-0 left-0 h-full w-12 bg-white border-2 border-primary-600 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center shadow-md transition-transform hover:scale-110"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
          onMouseDown={(e) => handleStart(e.clientX)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' && position < 100) {
              setPosition(Math.min(100, position + 10))
            } else if (e.key === 'ArrowLeft' && position > 0) {
              setPosition(Math.max(0, position - 10))
            } else if (e.key === 'Enter' && position >= 80) {
              onVerify(true)
            }
          }}
        >
          <svg
            className="w-6 h-6 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
        {position >= 80 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-white">Verified ✓</span>
          </div>
        )}
      </div>
      <p className="sr-only">
        Use arrow keys to move the slider. Press Enter when the slider reaches the end.
      </p>
    </div>
  )
}

