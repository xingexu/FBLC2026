/**
 * Bookmark button component
 * Allows users to save/unsave businesses
 */
import { useState, useEffect } from 'react'
import { Business } from '../types'
import { isBookmarked, addBookmark, removeBookmark } from '../db/repo'
import { useAppStore } from '../store'

interface BookmarkButtonProps {
  business: Business
}

export function BookmarkButton({ business }: BookmarkButtonProps) {
  const { currentUserId } = useAppStore()
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkBookmarkStatus()
  }, [business.id, currentUserId])

  const checkBookmarkStatus = async () => {
    try {
      const status = await isBookmarked(currentUserId, business.id)
      setBookmarked(status)
    } catch (error) {
      console.error('Error checking bookmark status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    try {
      if (bookmarked) {
        await removeBookmark(currentUserId, business.id)
        setBookmarked(false)
      } else {
        await addBookmark({
          id: `bookmark-${Date.now()}`,
          userId: currentUserId,
          businessId: business.id,
          createdAt: new Date().toISOString(),
        })
        setBookmarked(true)
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  if (loading) {
    return (
      <button
        disabled
        className="p-2 text-gray-400 cursor-not-allowed"
        aria-label="Loading bookmark status"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded transition-colors ${
        bookmarked
          ? 'text-yellow-500 hover:text-yellow-600'
          : 'text-gray-400 hover:text-gray-600'
      }`}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      aria-pressed={bookmarked}
    >
      <svg
        className="w-5 h-5"
        fill={bookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  )
}

