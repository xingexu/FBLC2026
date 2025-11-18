/**
 * Repository functions for CRUD operations on IndexedDB
 * Provides type-safe access to all data stores
 */
import { getDB } from './indexeddb'
import { Business, Review, Bookmark, Deal, User } from '../types'

// Simple in-memory cache for frequently accessed data
const cache = {
  businesses: null as Business[] | null,
  businessesTimestamp: 0,
  CACHE_TTL: 5000, // 5 seconds cache
}

// Business operations
export async function getAllBusinesses(): Promise<Business[]> {
  // Return cached data if still valid
  const now = Date.now()
  if (cache.businesses && (now - cache.businessesTimestamp) < cache.CACHE_TTL) {
    return cache.businesses
  }

  const db = await getDB()
  const businesses = await db.getAll('businesses')
  
  // Update cache
  cache.businesses = businesses
  cache.businessesTimestamp = now
  
  return businesses
}

// Clear cache when businesses are modified
function clearBusinessCache() {
  cache.businesses = null
  cache.businessesTimestamp = 0
}

export async function getBusinessById(id: string): Promise<Business | undefined> {
  const db = await getDB()
  return db.get('businesses', id)
}

export async function getBusinessesByCategory(
  category: string
): Promise<Business[]> {
  const db = await getDB()
  const all = await db.getAll('businesses')
  return all.filter((b) => b.categories.includes(category))
}

export async function addBusiness(business: Business): Promise<void> {
  const db = await getDB()
  await db.put('businesses', business)
  clearBusinessCache()
}

export async function updateBusiness(business: Business): Promise<void> {
  const db = await getDB()
  await db.put('businesses', business)
  clearBusinessCache()
}

export async function searchBusinesses(
  query: string,
  category?: string
): Promise<Business[]> {
  const db = await getDB()
  const all = await db.getAll('businesses')
  const lowerQuery = query.toLowerCase()

  return all.filter((business) => {
    const matchesQuery =
      business.name.toLowerCase().includes(lowerQuery) ||
      business.address.toLowerCase().includes(lowerQuery) ||
      business.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      business.categories.some((cat) => cat.toLowerCase().includes(lowerQuery))

    const matchesCategory = !category || business.categories.includes(category)

    return matchesQuery && matchesCategory
  })
}

// Review operations
export async function getReviewsByBusiness(
  businessId: string
): Promise<Review[]> {
  const db = await getDB()
  return db.getAllFromIndex('reviews', 'by-business', businessId)
}

export async function getReviewsByUser(userId: string): Promise<Review[]> {
  const db = await getDB()
  return db.getAllFromIndex('reviews', 'by-user', userId)
}

export async function addReview(review: Review): Promise<void> {
  const db = await getDB()
  await db.put('reviews', review)

  // Update business rating
  const business = await getBusinessById(review.businessId)
  if (business) {
    const allReviews = await getReviewsByBusiness(review.businessId)
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
    const avgRating = totalRating / allReviews.length
    const ratingCount = allReviews.length

    await updateBusiness({
      ...business,
      avgRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      ratingCount,
    })
  }
}

export async function checkRecentReview(
  userId: string,
  businessId: string,
  secondsThreshold: number = 30
): Promise<boolean> {
  const db = await getDB()
  const userReviews = await db.getAllFromIndex('reviews', 'by-user', userId)
  const now = Date.now()

  return userReviews.some((review) => {
    if (review.businessId !== businessId) return false
    const reviewTime = new Date(review.createdAt).getTime()
    return now - reviewTime < secondsThreshold * 1000
  })
}

// Bookmark operations
export async function getBookmarksByUser(userId: string): Promise<Bookmark[]> {
  const db = await getDB()
  return db.getAllFromIndex('bookmarks', 'by-user', userId)
}

export async function isBookmarked(
  userId: string,
  businessId: string
): Promise<boolean> {
  const db = await getDB()
  const bookmarks = await db.getAllFromIndex('bookmarks', 'by-user', userId)
  return bookmarks.some((b) => b.businessId === businessId)
}

export async function addBookmark(bookmark: Bookmark): Promise<void> {
  const db = await getDB()
  await db.put('bookmarks', bookmark)
}

export async function removeBookmark(
  userId: string,
  businessId: string
): Promise<void> {
  const db = await getDB()
  const bookmarks = await db.getAllFromIndex('bookmarks', 'by-user', userId)
  const bookmark = bookmarks.find((b) => b.businessId === businessId)
  if (bookmark) {
    await db.delete('bookmarks', bookmark.id)
  }
}

export async function getBookmarkedBusinesses(
  userId: string
): Promise<Business[]> {
  const bookmarks = await getBookmarksByUser(userId)
  const businesses = await Promise.all(
    bookmarks.map((b) => getBusinessById(b.businessId))
  )
  return businesses.filter((b): b is Business => b !== undefined)
}

// Deal operations
export async function getAllDeals(): Promise<Deal[]> {
  const db = await getDB()
  return db.getAll('deals')
}

export async function getDealsByBusiness(businessId: string): Promise<Deal[]> {
  const db = await getDB()
  return db.getAllFromIndex('deals', 'by-business', businessId)
}

export async function getActiveDeals(): Promise<Deal[]> {
  const db = await getDB()
  const all = await db.getAll('deals')
  const now = new Date().toISOString()
  return all.filter(
    (deal) => deal.startDate <= now && deal.endDate >= now
  )
}

export async function addDeal(deal: Deal): Promise<void> {
  const db = await getDB()
  await db.put('deals', deal)
}

// User operations
export async function getUserById(id: string): Promise<User | undefined> {
  const db = await getDB()
  return db.get('users', id)
}

export async function addUser(user: User): Promise<void> {
  const db = await getDB()
  await db.put('users', user)
}

export async function updateUser(user: User): Promise<void> {
  const db = await getDB()
  await db.put('users', user)
}

