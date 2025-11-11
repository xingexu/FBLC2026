/**
 * Landing page
 * Shows preview of the app and directs to login
 */
import { Link } from "react-router-dom";
import { FloatingCard } from "../components/FloatingCard";

export function Landing() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-black mb-4">
            Discover Toronto's
            <span className="text-gray-700"> Small Businesses</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with local shops, restaurants, and services in your
            neighborhood. Find deals, read reviews, and support your community.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-black text-white rounded-2xl hover:bg-gray-900 transition-all font-semibold text-lg glass-hover transform hover:scale-110 active:scale-95 btn-bubble"
            >
              Get Started Now →
            </Link>
            <Link
              to="/login"
              className="inline-block px-8 py-4 glass text-black border border-gray-300 rounded-2xl hover:glass-light transition-all font-semibold text-lg glass-hover transform hover:scale-110 active:scale-95 btn-bubble"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-black mb-8">
            See What's Inside
          </h2>

          {/* Preview Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Business Directory Preview */}
            <FloatingCard delay={0}>
              <div className="glass rounded-3xl p-6 glass-hover transform hover:scale-105 transition-all duration-300 border border-gray-200">
                <div className="mb-4">
                  <svg
                    className="w-12 h-12 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  Business Directory
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse 50+ local businesses across Toronto neighborhoods
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Search by category
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Filter by location
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Interactive map view
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* Reviews & Ratings Preview */}
            <FloatingCard delay={0.2}>
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-110 transition-all duration-300 border-2 border-yellow-200 animate-pulse-glow">
                <div className="mb-4">
                  <svg
                    className="w-12 h-12 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  Reviews & Ratings
                </h3>
                <p className="text-gray-600 mb-4">
                  Read honest reviews and leave your own feedback
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    1-5 star ratings
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Detailed reviews
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Bot protection
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* Deals & Coupons Preview */}
            <FloatingCard delay={0.4}>
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-110 transition-all duration-300 border-2 border-green-200 animate-pulse-glow">
                <div className="mb-4">
                  <svg
                    className="w-12 h-12 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  Deals & Coupons
                </h3>
                <p className="text-gray-600 mb-4">
                  Find exclusive deals and special offers
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Active deals
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Copy codes instantly
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Expiry tracking
                  </div>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>

        {/* Screenshot/Mockup Section */}
        <FloatingCard delay={0.6}>
          <div className="glass rounded-3xl p-8 max-w-5xl mx-auto mb-16 border border-gray-200 glass-hover">
            <h2 className="text-3xl font-bold text-center text-black mb-8">
              Explore Local Businesses
            </h2>
            <div className="glass-dark rounded-2xl p-6 border border-gray-200">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {["Food", "Retail", "Services"].map((cat) => (
                  <div
                    key={cat}
                    className="glass rounded-xl p-3 text-center border border-gray-200"
                  >
                    <span className="text-sm font-medium text-black">
                      {cat}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="glass rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 glass-light rounded-full flex items-center justify-center border border-gray-300">
                        <span className="text-black font-bold">B{i}</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-4 glass-dark rounded w-3/4 mb-2"></div>
                        <div className="h-3 glass-dark rounded w-1/2"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-700">★★★★★</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FloatingCard>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black mb-4">
            Ready to Discover?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of Torontonians supporting local businesses
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-black text-white rounded-2xl hover:bg-gray-900 transition-all font-semibold text-lg glass-hover transform hover:scale-110 active:scale-95 btn-bubble"
            >
              Get Started Now →
            </Link>
            <Link
              to="/login"
              className="inline-block px-8 py-4 glass text-black border border-gray-300 rounded-2xl hover:glass-light transition-all font-semibold text-lg glass-hover transform hover:scale-110 active:scale-95 btn-bubble"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
