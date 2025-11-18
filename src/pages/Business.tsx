/**
 * Business detail page
 * Shows full business information, reviews, deals, and allows adding reviews
 */
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Business as BusinessType, Review, Deal } from "../types";
import {
  getBusinessById,
  getReviewsByBusiness,
  getActiveDeals,
} from "../db/repo";
import { RatingStars } from "../components/RatingStars";
import { BookmarkButton } from "../components/BookmarkButton";
import { DealCard } from "../components/DealCard";
import { ReviewForm } from "../reviews/ReviewForm";
import {
  sanitizeWebsite,
  sanitizePhone,
  getDirectionsLink,
} from "../utils/links";
import { haversineDistance } from "../utils/geo";
import { useAppStore } from "../store";

export function Business() {
  const { id } = useParams<{ id: string }>();
  const { userLocation } = useAppStore();
  const [business, setBusiness] = useState<BusinessType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadBusiness();
  }, [id]);

  const loadBusiness = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Load business data first (most important, show immediately)
      const businessData = await getBusinessById(id);
      if (businessData) {
        setBusiness(businessData);
        setLoading(false); // Show business data immediately
      }

      // Load reviews and deals in parallel (less critical, can load after)
      const [businessReviews, allDeals] = await Promise.all([
        getReviewsByBusiness(id),
        getActiveDeals(),
      ]);

      setReviews(businessReviews);
      const businessDeals = allDeals.filter((deal) => deal.businessId === id);
      setDeals(businessDeals);
    } catch (error) {
      console.error("Error loading business:", error);
      setLoading(false);
    }
  };

  const handleReviewSubmit = (review: Review) => {
    setReviews([review, ...reviews]);
    setShowReviewForm(false);
    loadBusiness(); // Reload to update rating
  };

  if (loading && !business) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="glass rounded-2xl p-8 border border-gray-200 skeleton-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Business not found</h2>
          <Link to="/" className="text-primary-600 hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const website = sanitizeWebsite(business.website);
  const phone = sanitizePhone(business.phone);
  const directionsLink = getDirectionsLink(
    business.lat,
    business.lng,
    business.address
  );

  // Calculate distance with full precision and error handling
  let distance: number | null = null;
  if (userLocation && business.lat && business.lng) {
    try {
      // Validate coordinates before calculation
      if (
        Number.isFinite(business.lat) &&
        Number.isFinite(business.lng) &&
        Number.isFinite(userLocation.lat) &&
        Number.isFinite(userLocation.lng) &&
        business.lat >= -90 &&
        business.lat <= 90 &&
        business.lng >= -180 &&
        business.lng <= 180 &&
        userLocation.lat >= -90 &&
        userLocation.lat <= 90 &&
        userLocation.lng >= -180 &&
        userLocation.lng <= 180
      ) {
        // Calculate with full precision (no rounding until display)
        distance = haversineDistance(
          userLocation.lat,
          userLocation.lng,
          business.lat,
          business.lng
        );
      }
    } catch (error) {
      console.warn("Failed to calculate distance:", error);
      distance = null;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {business.name}
              </h1>
              <BookmarkButton business={business} />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <RatingStars rating={business.avgRating} size="lg" showNumber />
              <span className="text-gray-600">
                ({business.ratingCount} reviews)
              </span>
              {distance !== null && (
                <span className="text-gray-600">
                  • {distance.toFixed(1)} km away
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {business.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
            <p className="text-gray-700 mb-4">{business.address}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
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
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Visit Website
            </a>
          )}
          {phone && (
            <a
              href={phone}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call
            </a>
          )}
          <a
            href={directionsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
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
            Get Directions
          </a>
        </div>

        <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Hours</h2>
          <div className="grid grid-cols-2 gap-3">
            {business.hours.map((hour, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
              >
                <span className="font-semibold text-gray-700">{hour.day}</span>
                <span className="text-gray-600 font-medium">
                  {hour.open === "closed" ? (
                    <span className="text-red-500">Closed</span>
                  ) : (
                    `${hour.open} - ${hour.close}`
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {deals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Special Deals
            </h2>
            <div className="space-y-4">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} business={business} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          </div>

          {showReviewForm && (
            <div className="mb-6 p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-lg">
              <ReviewForm
                businessId={business.id}
                onSubmit={handleReviewSubmit}
              />
            </div>
          )}

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500 text-lg">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <RatingStars rating={review.rating} size="sm" />
                    <span className="text-sm text-gray-500 font-medium">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
