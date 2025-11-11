/**
 * Zod validation schemas for reviews
 * Ensures data integrity and prevents invalid submissions
 */
import { z } from 'zod'

/**
 * Review form schema
 * Validates rating (1-5) and text (min 10 chars, max 1000 chars)
 */
export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  text: z
    .string()
    .min(10, 'Review text must be at least 10 characters')
    .max(1000, 'Review text must be at most 1000 characters')
    .trim(),
})

export type ReviewFormData = z.infer<typeof reviewSchema>

