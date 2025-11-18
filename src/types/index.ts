/**
 * Core data types for LocaLink business directory
 */

export type Business = {
  id: string
  name: string
  categories: string[]
  tags: string[]
  address: string
  lat: number
  lng: number
  website?: string
  phone?: string
  hours: { day: string; open: string; close: string }[]
  avgRating: number
  ratingCount: number
  deals: string[] // Deal IDs
}

export type Review = {
  id: string
  businessId: string
  userId: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  createdAt: string
}

export type Bookmark = {
  id: string
  userId: string
  businessId: string
  createdAt: string
}

export type Deal = {
  id: string
  businessId: string
  title: string
  description: string
  startDate: string
  endDate: string
  code: string
}

export type UserRole = 'user' | 'admin'

export type User = {
  id: string
  nickname: string
  email?: string
  profilePhoto?: string
  role?: UserRole // Defaults to 'user' if not specified
  createdAt: string
  verification: {
    emailVerified: boolean
    lastCaptchaAt?: string
  }
}

export type SortOption = 'rating' | 'distance' | 'name' | 'reviews'

export type FilterState = {
  category: string | null
  searchText: string
  radius: number // in km
  sortBy: SortOption
}

