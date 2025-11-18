/**
 * IndexedDB schema and database initialization
 * Uses idb library for type-safe IndexedDB operations
 */
import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Business, Review, Bookmark, Deal, User } from "../types";

/**
 * Database schema definition
 */
interface LocaLinkDB extends DBSchema {
  businesses: {
    key: string;
    value: Business;
    indexes: { "by-category": string[]; "by-rating": number };
  };
  reviews: {
    key: string;
    value: Review;
    indexes: { "by-business": string; "by-user": string; "by-created": string };
  };
  bookmarks: {
    key: string;
    value: Bookmark;
    indexes: { "by-user": string; "by-business": string; "by-created": string };
  };
  deals: {
    key: string;
    value: Deal;
    indexes: { "by-business": string; "by-end-date": string };
  };
  users: {
    key: string;
    value: User;
  };
}

const DB_NAME = "localink-db";
const DB_VERSION = 1;

/**
 * Open and initialize the IndexedDB database
 * @returns Promise resolving to database instance
 */
export async function openDatabase(): Promise<IDBPDatabase<LocaLinkDB>> {
  return openDB<LocaLinkDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Businesses store
      if (!db.objectStoreNames.contains("businesses")) {
        const businessStore = db.createObjectStore("businesses", {
          keyPath: "id",
        });
        // Index by category (array index)
        businessStore.createIndex("by-category", "categories", {
          multiEntry: true,
        });
        // Index by rating for sorting
        businessStore.createIndex("by-rating", "avgRating");
      }

      // Reviews store
      if (!db.objectStoreNames.contains("reviews")) {
        const reviewStore = db.createObjectStore("reviews", {
          keyPath: "id",
        });
        reviewStore.createIndex("by-business", "businessId");
        reviewStore.createIndex("by-user", "userId");
        reviewStore.createIndex("by-created", "createdAt");
      }

      // Bookmarks store
      if (!db.objectStoreNames.contains("bookmarks")) {
        const bookmarkStore = db.createObjectStore("bookmarks", {
          keyPath: "id",
        });
        bookmarkStore.createIndex("by-user", "userId");
        bookmarkStore.createIndex("by-business", "businessId");
        bookmarkStore.createIndex("by-created", "createdAt");
      }

      // Deals store
      if (!db.objectStoreNames.contains("deals")) {
        const dealStore = db.createObjectStore("deals", {
          keyPath: "id",
        });
        dealStore.createIndex("by-business", "businessId");
        dealStore.createIndex("by-end-date", "endDate");
      }

      // Users store
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", {
          keyPath: "id",
        });
      }
    },
  });
}

/**
 * Get database instance (singleton pattern)
 */
let dbInstance: IDBPDatabase<LocaLinkDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<LocaLinkDB>> {
  dbInstance ??= await openDatabase();
  return dbInstance;
}
