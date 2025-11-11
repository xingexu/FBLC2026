/**
 * Zustand store for global application state
 */
import { create } from 'zustand'
import { FilterState, SortOption } from '../types'

interface AppState {
  // User location
  userLocation: { lat: number; lng: number } | null
  setUserLocation: (location: { lat: number; lng: number } | null) => void

  // Filters and search
  filters: FilterState
  setCategory: (category: string | null) => void
  setSearchText: (text: string) => void
  setRadius: (radius: number) => void
  setSortBy: (sortBy: SortOption) => void

  // Current user
  currentUserId: string
  setCurrentUserId: (id: string) => void
  hasCompletedLocationConsent: boolean
  setHasCompletedLocationConsent: (completed: boolean) => void

  // UI state
  theme: 'light' | 'dark' | 'high-contrast'
  setTheme: (theme: 'light' | 'dark' | 'high-contrast') => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),

  filters: {
    category: null,
    searchText: '',
    radius: 5,
    sortBy: 'rating',
  },
  setCategory: (category) =>
    set((state) => ({
      filters: { ...state.filters, category },
    })),
  setSearchText: (text) =>
    set((state) => ({
      filters: { ...state.filters, searchText: text },
    })),
  setRadius: (radius) =>
    set((state) => ({
      filters: { ...state.filters, radius },
    })),
  setSortBy: (sortBy) =>
    set((state) => ({
      filters: { ...state.filters, sortBy },
    })),

  currentUserId: 'user-1', // Default user ID
  setCurrentUserId: (id) => set({ currentUserId: id }),
  hasCompletedLocationConsent: false,
  setHasCompletedLocationConsent: (completed) => set({ hasCompletedLocationConsent: completed }),

  theme: 'light',
  setTheme: (theme) => set({ theme }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))

