/**
 * Recommendation engine using cosine similarity
 * Analyzes user's bookmarked businesses to recommend similar ones
 * Based on category vectors and cosine similarity
 */

import { Business } from '../types'
import { getBookmarkedBusinesses } from '../db/repo'

/**
 * Calculate cosine similarity between two vectors
 * @param vecA First vector
 * @param vecB Second vector
 * @returns Similarity score between 0 and 1
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  if (normA === 0 || normB === 0) return 0

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Build category vector for a business
 * @param business Business to vectorize
 * @param allCategories List of all possible categories
 * @returns Vector representation
 */
function buildCategoryVector(
  business: Business,
  allCategories: string[]
): number[] {
  return allCategories.map((cat) => (business.categories.includes(cat) ? 1 : 0))
}

/**
 * Get user's category preference vector from bookmarks
 * @param bookmarkedBusinesses User's bookmarked businesses
 * @param allCategories List of all possible categories
 * @returns User preference vector
 */
function getUserPreferenceVector(
  bookmarkedBusinesses: Business[],
  allCategories: string[]
): number[] {
  if (bookmarkedBusinesses.length === 0) {
    // Return uniform vector if no bookmarks
    return allCategories.map(() => 1 / allCategories.length)
  }

  // Count category occurrences
  const categoryCounts = new Map<string, number>()
  allCategories.forEach((cat) => categoryCounts.set(cat, 0))

  bookmarkedBusinesses.forEach((business) => {
    business.categories.forEach((cat) => {
      categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1)
    })
  })

  // Normalize to create preference vector
  const total = bookmarkedBusinesses.length
  return allCategories.map((cat) => (categoryCounts.get(cat) || 0) / total)
}

/**
 * Get recommended businesses for a user
 * @param userId User ID
 * @param allBusinesses All available businesses
 * @param limit Maximum number of recommendations
 * @returns Array of recommended businesses sorted by similarity
 */
export async function getRecommendations(
  userId: string,
  allBusinesses: Business[],
  limit: number = 10
): Promise<Business[]> {
  // Get user's bookmarked businesses
  const bookmarkedBusinesses = await getBookmarkedBusinesses(userId)

  if (bookmarkedBusinesses.length === 0) {
    // If no bookmarks, return top-rated businesses
    return allBusinesses
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, limit)
  }

  // Get all unique categories
  const allCategories = Array.from(
    new Set(allBusinesses.flatMap((b) => b.categories))
  ).sort()

  // Build user preference vector
  const userVector = getUserPreferenceVector(bookmarkedBusinesses, allCategories)

  // Get bookmarked business IDs to exclude from recommendations
  const bookmarkedIds = new Set(bookmarkedBusinesses.map((b) => b.id))

  // Calculate similarity for each business
  const scored = allBusinesses
    .filter((b) => !bookmarkedIds.has(b.id)) // Exclude already bookmarked
    .map((business) => {
      const businessVector = buildCategoryVector(business, allCategories)
      const similarity = cosineSimilarity(userVector, businessVector)
      return { business, similarity }
    })
    .sort((a, b) => b.similarity - a.similarity) // Sort by similarity
    .slice(0, limit)
    .map((item) => item.business)

  return scored
}

