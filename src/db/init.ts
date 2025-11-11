/**
 * Database initialization
 * Loads seed data into IndexedDB on first run
 */
import { getDB } from './indexeddb'
import { addBusiness, addDeal } from './repo'
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
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const initialized = await isInitialized()
    if (initialized) {
      console.log('Database already initialized')
      return
    }

    console.log('Initializing database with seed data...')

    // Add businesses
    for (const business of seedData.businesses as unknown as Business[]) {
      await addBusiness(business)
    }

    // Add deals
    for (const deal of seedData.deals as Deal[]) {
      await addDeal(deal)
    }

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

