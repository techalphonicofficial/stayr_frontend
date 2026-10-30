"use client";

import Navbar from "@/components/navbar/Navbar";
import FilterBar from "@/components/listings/FilterBar";
import ListingCard from "@/components/listings/ListingCard";
import Container from "@/components/common/Container";

import { use, useState, useEffect } from "react";
import { propertyApi } from "@/lib/api";
import { Sparkles, MapPin, CheckCircle2, SlidersHorizontal, Home } from "lucide-react";
import Link from "next/link";

export default function SearchResultsPage({ params }) {
  const unwrappedParams = use(params);
  const locationParam = unwrappedParams?.location || "Noida";
  const decodedQuery = decodeURIComponent(locationParam);
  const locationName = decodedQuery.charAt(0).toUpperCase() + decodedQuery.slice(1);

  // Category display names
  const CATEGORY_NAMES = {
    beachfront: "Beachfront",
    pools: "Pools",
    international: "International",
    family: "Family Friendly",
  };

  const isCategory = Object.keys(CATEGORY_NAMES).includes(decodedQuery.toLowerCase());
  const displayName = isCategory ? CATEGORY_NAMES[decodedQuery.toLowerCase()] : locationName;

  const [properties, setProperties] = useState([]);
  const [detectedIntent, setDetectedIntent] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      setLoading(true);
      try {
        // Execute AI Vector Semantic Search
        const json = await propertyApi.vectorSearch({
          q: decodedQuery,
          limit: 40
        });

        if (json && json.success && Array.isArray(json.data)) {
          setProperties(json.data);
          setDetectedIntent(json.detectedIntent || null);
          setTotalCount(json.total || json.data.length);
        } else {
          // Fallback to standard property fetch
          const fallback = await propertyApi.getProperties({ search: decodedQuery, limit: 30 });
          if (fallback && fallback.success && Array.isArray(fallback.data)) {
            setProperties(fallback.data);
            setTotalCount(fallback.total || fallback.data.length);
          } else {
            setProperties([]);
            setTotalCount(0);
          }
        }
      } catch (err) {
        console.error("Failed to fetch search properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProps();
  }, [decodedQuery]);

  // Filter state
  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const displayListings = properties.filter((listing) => {
    if (activeFilters.length === 0) return true;

    return activeFilters.every((f) => {
      if (f === "1+ bathrooms") {
        return (listing.bathrooms || 1) >= 1;
      }
      if (!listing.amenities || !Array.isArray(listing.amenities)) return false;
      return listing.amenities.some((a) => {
        const name = typeof a === "string" ? a : a.name;
        return name && name.toLowerCase().includes(f.toLowerCase());
      });
    });
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Navbar (Compact Mode) */}
      <Navbar forceCompact={true} flat={true} />

      {/* Main Content Area starting below Navbar */}
      <div className="pt-[150px] md:pt-[80px]">
        {/* Sticky Filter Bar */}
        <FilterBar activeFilters={activeFilters} onToggleFilter={toggleFilter} />

        <Container>
          {/* Vector Search Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mt-8 mb-6 gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF385C]/10 text-[#FF385C] text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={13} />
                  <span>AI Vector Search</span>
                </span>
                {detectedIntent?.location && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                    📍 {detectedIntent.location.toUpperCase()}
                  </span>
                )}
                {detectedIntent?.category && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800">
                    🏠 {detectedIntent.category}
                  </span>
                )}
                {detectedIntent?.amenities?.map((a) => (
                  <span key={a} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                    ✨ {a}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {decodedQuery.toLowerCase() === "monsoon"
                  ? "Monsoon Stays for Less"
                  : isCategory
                  ? `${displayName} Properties`
                  : `Verified Stays Matching "${displayName}"`}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-light">
                Semantic ranking prioritizing destination, property category, authentic amenities, and real availability.
              </p>
            </div>

            {/* Total Results Pill */}
            <div className="flex items-center gap-2 bg-white border border-border rounded-full px-4 py-2 shadow-xs shrink-0 self-start md:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-foreground">
                {totalCount} Verified {totalCount === 1 ? "Stay" : "Stays"}
              </span>
            </div>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-3xl h-80 border border-gray-100" />
              ))}
            </div>
          ) : displayListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {displayListings.map((listing, index) => (
                <div key={listing.id || index} className="relative flex flex-col h-full group">
                  <ListingCard
                    id={listing.id}
                    title={listing.title}
                    price={"₹" + (listing.pricePerNight || 0).toLocaleString("en-IN")}
                    image={listing.featuredImage || listing.images?.[0]?.url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"}
                    nights={3}
                    rating={listing.averageRating ? Number(listing.averageRating).toFixed(1) : "4.9"}
                    reviewCount={listing.totalReviews || 12}
                    topReview={listing.reviews?.[0]}
                  />

                  {/* Semantic Match Confidence Badge Overlay */}
                  {listing.matchConfidence && (
                    <div className="absolute top-3 left-3 pointer-events-none z-20">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-emerald-800 shadow-sm border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>{listing.matchConfidence}</span>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
                <Home size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No stays found for &ldquo;{decodedQuery}&rdquo;
              </h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Try searching for popular destinations like Goa, Manali, Noida, Mumbai, or searching by property type like &ldquo;Villa&rdquo; or &ldquo;Apartment&rdquo;.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition shadow-sm"
              >
                Back to Home Search
              </Link>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
