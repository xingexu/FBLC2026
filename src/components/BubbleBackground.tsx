/**
 * Bubble background component
 * Creates animated floating bubbles that appear on hover
 */
import { useEffect, useRef, useState } from 'react'

interface Bubble {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export function BubbleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const bubblesRef = useRef<Bubble[]>([])
  const animationFrameRef = useRef<number>()
  const [isHovered, setIsHovered] = useState(false)
  const [targetOpacity, setTargetOpacity] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create bubbles - subtle and minimal
    const createBubbles = () => {
      const bubbles: Bubble[] = []
      const bubbleCount = 12 // Fewer bubbles

      for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 15, // Smaller: 15-45px
        speedX: (Math.random() - 0.5) * 0.02, // Very slow: 0.02
        speedY: (Math.random() - 0.5) * 0.02, // Very slow
        opacity: Math.random() * 0.04 + 0.01, // Very subtle: 0.01-0.05
      })
      }

      bubblesRef.current = bubbles
    }

    createBubbles()

    // Handle hover state - show bubbles when mouse enters, hide when it leaves
    const handleMouseEnter = () => {
      setIsHovered(true)
      setTargetOpacity(1)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      setTargetOpacity(0)
    }

    // Listen to mouse enter/leave on the main app container
    const appContainer = document.body
    if (appContainer) {
      appContainer.addEventListener('mouseenter', handleMouseEnter)
      appContainer.addEventListener('mouseleave', handleMouseLeave)
    }

    // Smooth opacity transition
    let currentOpacity = 0

    // Animation loop - optimized to pause when not needed
    let lastFrameTime = 0
    const frameInterval = 16 // ~60fps, but we can skip frames when opacity is low
    
    const animate = (currentTime: number) => {
      // Throttle animation when opacity is very low
      if (currentTime - lastFrameTime < frameInterval && currentOpacity < 0.1) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTime = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Smoothly transition opacity - slower for less pop
      const opacityDiff = targetOpacity - currentOpacity
      currentOpacity += opacityDiff * 0.02 // Much slower fade in/out to prevent pop

      // Skip rendering entirely if opacity is too low
      if (currentOpacity < 0.01) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      bubblesRef.current.forEach((bubble) => {
        // Update position
        bubble.x += bubble.speedX
        bubble.y += bubble.speedY

        // Bounce off edges
        if (bubble.x < 0 || bubble.x > canvas.width) bubble.speedX *= -1
        if (bubble.y < 0 || bubble.y > canvas.height) bubble.speedY *= -1

        // Keep bubbles in bounds
        bubble.x = Math.max(0, Math.min(canvas.width, bubble.x))
        bubble.y = Math.max(0, Math.min(canvas.height, bubble.y))

        // Draw bubble - very subtle white/grey with hover opacity
        const effectiveOpacity = bubble.opacity * currentOpacity
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          bubble.x - bubble.size * 0.3,
          bubble.y - bubble.size * 0.3,
          0,
          bubble.x,
          bubble.y,
          bubble.size
        )
        gradient.addColorStop(0, `rgba(250, 250, 250, ${effectiveOpacity * 0.3})`)
        gradient.addColorStop(1, `rgba(230, 230, 230, ${effectiveOpacity * 0.1})`)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw very subtle highlight
        ctx.beginPath()
        ctx.arc(
          bubble.x - bubble.size * 0.25,
          bubble.y - bubble.size * 0.25,
          bubble.size * 0.15,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = `rgba(255, 255, 255, ${effectiveOpacity * 0.2})`
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (appContainer) {
        appContainer.removeEventListener('mouseenter', handleMouseEnter)
        appContainer.removeEventListener('mouseleave', handleMouseLeave)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: 'transparent',
          willChange: 'contents' // Optimize for animations
        }}
      />
    </div>
  )
}

