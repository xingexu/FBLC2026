/**
 * Bookmarks page
 * Shows all bookmarked businesses
 */
import { useState, useEffect } from "react";
import { BusinessCard } from "../components/BusinessCard";
import { EmptyState } from "../components/EmptyState";
import { getBookmarkedBusinesses } from "../db/repo";
import { useAppStore } from "../store";
import { Business } from "../types";

export function Bookmarks() {
  const { currentUserId } = useAppStore();
  const [bookmarkedBusinesses, setBookmarkedBusinesses] = useState<Business[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, [currentUserId]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const businesses = await getBookmarkedBusinesses(currentUserId);
      setBookmarkedBusinesses(businesses);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && bookmarkedBusinesses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 border border-gray-200 skeleton-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
          My Bookmarks
        </h1>
        <p className="text-lg text-gray-600">Your saved favorite businesses</p>
      </div>

      {bookmarkedBusinesses.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          message="Start exploring and bookmark your favorite businesses!"
          actionLabel="Explore Businesses"
          onAction={() => (window.location.href = "/explore")}
        />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">
              {bookmarkedBusinesses.length}{" "}
              {bookmarkedBusinesses.length === 1 ? "Bookmark" : "Bookmarks"}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookmarkedBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                showDistance
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
