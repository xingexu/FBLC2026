/**
 * Database initialization
 * Loads seed data into IndexedDB on first run
 */
import { getDB } from './indexeddb'
import { Business, Deal } from '../types'
import seedData from './seed.json'

/**
 * Check if database has been initialized
 */
async function isInitialized(): Promise<boolean> {
  const db = await getDB()
  const count = await db.count('businesses')
  return count > 0
}

/**
 * Initialize database with seed data
 * Only runs if database is empty
 * Uses batch operations for faster loading
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const initialized = await isInitialized()
    if (initialized) {
      return
    }

    // Start initialization immediately
    const db = await getDB()
    const tx = db.transaction(['businesses', 'deals'], 'readwrite')

    // Batch add businesses (use Promise.all for parallel execution)
    const businessPromises = (seedData.businesses as unknown as Business[]).map((business) =>
      tx.objectStore('businesses').put(business)
    )

    // Batch add deals
    const dealPromises = (seedData.deals as Deal[]).map((deal) =>
      tx.objectStore('deals').put(deal)
    )

    // Execute all operations in parallel for maximum speed
    await Promise.all([...businessPromises, ...dealPromises])
    await tx.done
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

