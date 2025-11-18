/**
 * Explore page
 * Map and list view with filters, sorting, and radius search
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import { MapView } from "../components/MapView";
import { BusinessCard } from "../components/BusinessCard";
import { CategoryChips } from "../components/CategoryChips";
import { SortBar } from "../components/SortBar";
import { DistanceSlider } from "../components/DistanceSlider";
import { EmptyState } from "../components/EmptyState";
import { useAppStore } from "../store";
import { getAllBusinesses, searchBusinesses } from "../db/repo";
import { Business } from "../types";
import { haversineDistance } from "../utils/geo";
import { fetchNearbyBusinesses } from "../overpass/fetchNearby";

export function Explore() {
  const { filters, userLocation, setUserLocation, setSortBy } = useAppStore();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "list">("list");

  const loadBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      // Always start with seed data businesses (fast, local)
      let allBusinesses: Business[] = await getAllBusinesses();

      // Show seed data immediately, then fetch Overpass in background (non-blocking)
      if (userLocation) {
        // Don't await - fetch in background and update when ready
        fetchNearbyBusinesses(
          userLocation.lat,
          userLocation.lng,
          filters.radius * 1.5
        )
          .then((nearby) => {
            // Merge Overpass results with seed data, avoiding duplicates
            const existingIds = new Set(allBusinesses.map((b) => b.id));
            const validNearby = nearby.filter((b) => {
              // Only include businesses with valid coordinates
              return (
                b.lat &&
                b.lng &&
                !Number.isNaN(b.lat) &&
                !Number.isNaN(b.lng) &&
                b.lat >= -90 &&
                b.lat <= 90 &&
                b.lng >= -180 &&
                b.lng <= 180 &&
                !existingIds.has(b.id)
              );
            });
            // Update state with merged results
            setBusinesses((prev) => {
              const prevIds = new Set(prev.map((b) => b.id));
              const newBusinesses = validNearby.filter((b) => !prevIds.has(b.id));
              return [...prev, ...newBusinesses];
            });
          })
          .catch((error) => {
            console.warn("Overpass API failed, using seed data only:", error);
            // Already have seed data, so continue
          });
      }

      // Filter by search text first (before distance filtering)
      if (filters.searchText) {
        const searchResults = await searchBusinesses(
          filters.searchText,
          filters.category || undefined
        );
        // Merge search results with all businesses, prioritizing search results
        const searchIds = new Set(searchResults.map((b) => b.id));
        allBusinesses = [
          ...searchResults,
          ...allBusinesses.filter((b) => !searchIds.has(b.id)),
        ];
      }

      // Filter by category
      if (filters.category) {
        allBusinesses = allBusinesses.filter((b) =>
          b.categories.includes(filters.category!)
        );
      }

      // Filter by distance if user location is set (this is the key filter)
      // Use bounding box pre-filter for better performance
      if (userLocation) {
        // Quick pre-filter using bounding box approximation (much faster)
        const latDelta = filters.radius / 111; // ~1 degree = 111 km
        const lngDelta =
          filters.radius / (111 * Math.cos((userLocation.lat * Math.PI) / 180));
        const minLat = userLocation.lat - latDelta;
        const maxLat = userLocation.lat + latDelta;
        const minLng = userLocation.lng - lngDelta;
        const maxLng = userLocation.lng + lngDelta;

        // First pass: bounding box filter (very fast)
        let candidates = allBusinesses.filter((b) => {
          if (!b.lat || !b.lng || Number.isNaN(b.lat) || Number.isNaN(b.lng)) {
            return false;
          }
          return (
            b.lat >= minLat &&
            b.lat <= maxLat &&
            b.lng >= minLng &&
            b.lng <= maxLng
          );
        });

        // Second pass: precise distance filter (only on candidates)
        // Uses full precision Haversine formula for accurate filtering
        allBusinesses = candidates.filter((b) => {
          // Validate coordinates one more time
          if (
            !b.lat ||
            !b.lng ||
            !Number.isFinite(b.lat) ||
            !Number.isFinite(b.lng)
          ) {
            return false;
          }

          try {
            // Calculate precise distance with full accuracy
            const distance = haversineDistance(
              userLocation.lat,
              userLocation.lng,
              b.lat,
              b.lng
            );
            return distance <= filters.radius;
          } catch (error) {
            // If calculation fails, exclude the business
            console.warn(`Distance calculation failed for ${b.id}:`, error);
            return false;
          }
        });
      }

      // Set businesses immediately (fast local data)
      setBusinesses(allBusinesses);
    } catch (error) {
      console.error("Error loading businesses:", error);
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.searchText, filters.radius, userLocation]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  // Pre-calculate distances and store with businesses for efficient sorting
  // Uses full precision calculations - no rounding until display
  const businessesWithDistance = useMemo(() => {
    if (!userLocation)
      return businesses.map((b) => ({ business: b, distance: null }));

    return businesses.map((b) => {
      // Validate coordinates before calculating distance
      if (
        !b.lat ||
        !b.lng ||
        !Number.isFinite(b.lat) ||
        !Number.isFinite(b.lng) ||
        b.lat < -90 ||
        b.lat > 90 ||
        b.lng < -180 ||
        b.lng > 180
      ) {
        return { business: b, distance: null };
      }

      try {
        // Calculate distance with full precision (no rounding)
        const distance = haversineDistance(
          userLocation.lat,
          userLocation.lng,
          b.lat,
          b.lng
        );
        return { business: b, distance };
      } catch (error) {
        // If calculation fails, exclude from distance-based operations
        console.warn(
          `Failed to calculate distance for business ${b.id}:`,
          error
        );
        return { business: b, distance: null };
      }
    });
  }, [businesses, userLocation]);

  const sortedBusinesses = useMemo(() => {
    // If user location is available, always sort by distance first
    if (userLocation) {
      const sortedWithDistance = [...businessesWithDistance];
      sortedWithDistance.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
      return sortedWithDistance.map((item) => item.business);
    }

    // If no location, use the selected sort option
    const sorted = [...businesses];
    switch (filters.sortBy) {
      case "rating": {
        const sortedByRating = [...sorted];
        sortedByRating.sort((a, b) => b.avgRating - a.avgRating);
        return sortedByRating;
      }
      case "reviews": {
        const sortedByReviews = [...sorted];
        sortedByReviews.sort((a, b) => b.ratingCount - a.ratingCount);
        return sortedByReviews;
      }
      case "name": {
        const sortedByName = [...sorted];
        sortedByName.sort((a, b) => a.name.localeCompare(b.name));
        return sortedByName;
      }
      default:
        return sorted;
    }
  }, [businessesWithDistance, filters.sortBy, userLocation, businesses]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          // Auto-set sort to distance when location is first obtained
          if (!userLocation) {
            setSortBy("distance");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Unable to get your location. Please enable location services."
          );
        }
      );
    }
  };

  if (loading && businesses.length === 0) {
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
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
              Explore Businesses
            </h1>
            <p className="text-lg text-gray-600">
              Discover local businesses in Toronto
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0 items-center">
            {userLocation && (
              <div className="px-4 py-2 glass rounded-lg border border-gray-300 text-sm">
                <span className="text-gray-600">Location: </span>
                <span className="font-semibold text-black">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </span>
              </div>
            )}
            <button
              onClick={handleGetLocation}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-all font-semibold text-sm glass-hover shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {userLocation ? "Update Location" : "Use My Location"}
              </span>
            </button>
            <button
              onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
              className="px-6 py-3 glass text-black rounded-xl hover:glass-light transition-all font-semibold text-sm glass-hover border border-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                {viewMode === "map" ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    List View
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    Map View
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Categories
            </h2>
            <CategoryChips />
          </div>

          <div className="glass rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Sort By
                </h2>
                <SortBar />
              </div>
              <div className="flex-1 min-w-[200px]">
                <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Distance
                </h2>
                <DistanceSlider />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {!userLocation && (
        <div className="mb-6 glass rounded-2xl p-4 border border-gray-200 bg-yellow-50">
          <p className="text-sm text-gray-700">
            <strong>Location required:</strong> Please enable location services
            to filter businesses by distance. Click "Use My Location" above.
          </p>
        </div>
      )}
      {sortedBusinesses.length === 0 ? (
        <EmptyState
          title="No businesses found"
          message={
            userLocation
              ? `No businesses found within ${filters.radius} km of your location. Try increasing the search radius or adjusting your filters.`
              : "Enable location services to see businesses near you, or adjust your search criteria."
          }
        />
      ) : viewMode === "map" ? (
        <div className="h-[600px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          <MapView
            businesses={sortedBusinesses}
            userLocation={userLocation}
            center={
              userLocation
                ? [userLocation.lat, userLocation.lng]
                : [43.6532, -79.3832]
            }
          />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">
              {sortedBusinesses.length}{" "}
              {sortedBusinesses.length === 1 ? "Business" : "Businesses"} Found
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedBusinesses.map((business: Business) => {
              const businessWithDist = businessesWithDistance.find(
                (b) => b.business.id === business.id
              );
              const distance = businessWithDist?.distance ?? null;
              const shouldShowDistance = !!userLocation;
              return (
                <BusinessCard
                  key={business.id}
                  business={business}
                  distance={distance}
                  showDistance={shouldShowDistance}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
