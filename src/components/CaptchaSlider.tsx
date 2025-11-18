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

  const isVerified = position >= 80

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-800 mb-3">
        Verify you're human
      </label>
      <div
        ref={trackRef}
        className="relative w-full h-14 glass rounded-2xl overflow-hidden border border-gray-300 shadow-inner"
        role="slider"
        aria-valuenow={position}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Verification slider"
      >
        {/* Background track with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100" />
        
        {/* Progress fill */}
        <div
          ref={sliderRef}
          className={`absolute left-0 top-0 h-full transition-all duration-300 ease-out ${
            isVerified 
              ? 'bg-gradient-to-r from-black to-gray-800' 
              : 'bg-gradient-to-r from-gray-300 to-gray-400'
          }`}
          style={{ width: `${position}%` }}
        />
        
        {/* Slider handle */}
        <div
          className={`absolute top-1/2 left-0 h-12 w-12 -translate-y-1/2 glass rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center shadow-lg border-2 transition-all duration-300 ${
            isVerified
              ? 'border-black bg-white'
              : 'border-gray-400 bg-white'
          } ${isDragging ? 'scale-110' : 'hover:scale-105'}`}
          style={{ left: `${position}%`, transform: `translate(-50%, -50%)` }}
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
          {isVerified ? (
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-600"
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
          )}
        </div>
        
        {/* Verification message */}
        {isVerified && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm font-semibold text-white drop-shadow-lg">
              Verified ✓
            </span>
          </div>
        )}
        
        {/* Instruction text when not verified */}
        {!isVerified && position < 10 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs font-medium text-gray-500">
              Slide to verify
            </span>
          </div>
        )}
      </div>
      <p className="sr-only">
        Use arrow keys to move the slider. Press Enter when the slider reaches the end.
      </p>
    </div>
  )
}

