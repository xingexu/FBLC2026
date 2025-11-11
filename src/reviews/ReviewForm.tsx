/**
 * Review form component with captcha verification
 * Implements bot prevention with slider captcha and timing checks
 */
import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewSchema, ReviewFormData } from './schemas'
import { CaptchaSlider } from '../components/CaptchaSlider'
import { RatingStars } from '../components/RatingStars'
import { addReview, checkRecentReview } from '../db/repo'
import { useAppStore } from '../store'
import { Review } from '../types'

interface ReviewFormProps {
  businessId: string
  onSubmit: (review: Review) => void
}

export function ReviewForm({ businessId, onSubmit }: ReviewFormProps) {
  const { currentUserId } = useAppStore()
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [rating, setRating] = useState<number>(5)
  const [submitting, setSubmitting] = useState(false)
  const formStartTime = useRef<number>(Date.now())
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  })

  useEffect(() => {
    formStartTime.current = Date.now()
  }, [])

  const handleCaptchaVerify = (verified: boolean) => {
    setCaptchaVerified(verified)
    if (!verified) {
      setError('Please complete the verification')
    } else {
      setError(null)
    }
  }

  const onSubmitForm = async (data: ReviewFormData) => {
    if (!captchaVerified) {
      setError('Please complete the verification')
      return
    }

    // Check timing - must have spent at least 5 seconds on form (human behavior)
    const timeSpent = Date.now() - formStartTime.current
    if (timeSpent < 5000) {
      setError('Please take your time writing the review')
      return
    }

    // Check for recent review from same user
    const hasRecentReview = await checkRecentReview(currentUserId, businessId, 30)
    if (hasRecentReview) {
      setError('You have already submitted a review recently. Please wait before submitting another.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const review: Review = {
        id: `review-${Date.now()}`,
        businessId,
        userId: currentUserId,
        rating: rating as 1 | 2 | 3 | 4 | 5,
        text: data.text,
        createdAt: new Date().toISOString(),
      }

      await addReview(review)
      onSubmit(review)
      reset()
      setRating(5)
      setCaptchaVerified(false)
      formStartTime.current = Date.now()
    } catch (err) {
      setError('Failed to submit review. Please try again.')
      console.error('Error submitting review:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <RatingStars
          rating={rating}
          interactive
          onRatingChange={setRating}
          size="lg"
        />
        <input type="hidden" value={rating} {...register('rating', { valueAsNumber: true })} />
      </div>

      <div>
        <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          id="review-text"
          {...register('text')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Share your experience..."
          aria-describedby="review-text-error"
        />
        {errors.text && (
          <p id="review-text-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.text.message}
          </p>
        )}
      </div>

      <CaptchaSlider onVerify={handleCaptchaVerify} disabled={submitting} />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!captchaVerified || submitting}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}

