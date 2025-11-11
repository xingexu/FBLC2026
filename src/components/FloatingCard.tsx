/**
 * Floating card component with bubble-like animations
 */
import { ReactNode } from 'react'

interface FloatingCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FloatingCard({ children, className = '', delay = 0 }: FloatingCardProps) {
  return (
    <div
      className={`animate-float ${className}`}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

