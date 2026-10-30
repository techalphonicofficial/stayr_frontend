"use client";

import { useState, useEffect, useCallback, use } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import SaleSearchBar from "@/components/buy/SaleSearchBar";
import SaleListingCard from "@/components/buy/SaleListingCard";
import { salePropertyApi } from "@/lib/api";
import { Building2, Sparkles, FilterX, MapPin, KeyRound } from "lucide-react";
import Link from "next/link";

const POPULAR_CITIES = [
  { label: "All Cities", value: "" },
  { label: "Noida", value: "Noida" },
  { label: "Gurgaon", value: "Gurgaon" },
  { label: "Mumbai", value: "Mumbai" },
  { label: "Bangalore", value: "Bangalore" },
];

export default function BuyDiscoveryPage({ searchParams }) {
  const unwrappedParams = searchParams ? use(searchParams) : {};

  const [filters, setFilters] = useState({
    category: unwrappedParams.category || "",
    propertyType: unwrappedParams.propertyType || "",
    city: unwrappedParams.city || "",
    search: unwrappedParams.search || "",
    minPrice: unwrappedParams.minPrice || "",
    maxPrice: unwrappedParams.maxPrice || "",
    bedrooms: unwrappedParams.bedrooms || "",
    minArea: unwrappedParams.minArea || "",
    maxArea: unwrappedParams.maxArea || "",
    furnishingStatus: unwrappedParams.furnishingStatus || "",
    possessionStatus: unwrappedParams.possessionStatus || "",
    isVerified: unwrappedParams.isVerified || "",
    lifestyle: unwrappedParams.lifestyle || "",
    sort: unwrappedParams.sort || "newest",
    page: 1,
    limit: 24,
  });

  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savedListingIds, setSavedListingIds] = useState(new Set());

  // Keep filters in sync when URL query params change (e.g. navigation via dropdown)
  useEffect(() => {
    if (unwrappedParams.city !== undefined || unwrappedParams.category !== undefined) {
      setFilters((prev) => ({
        ...prev,
        city: unwrappedParams.city || "",
        category: unwrappedParams.category || prev.category,
        propertyType: unwrappedParams.propertyType || prev.propertyType,
        page: 1,
      }));
    }
  }, [unwrappedParams.city, unwrappedParams.category, unwrappedParams.propertyType]);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await salePropertyApi.getSaleListings(filters);
      if (res && res.success) {
        setListings(res.data || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error("Failed to load sale properties:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch saved properties for logged-in user
  useEffect(() => {
    salePropertyApi.getSavedListings()
      .then((res) => {
        if (res && res.success && res.data) {
          const ids = new Set(res.data.map((item) => item.saleListingId || item.id));
          setSavedListingIds(ids);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilterChange = (updated) => {
    setFilters({ ...updated, page: 1 });
  };

  const handleCitySelect = (city) => {
    setFilters((prev) => ({ ...prev, city, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: "",
      propertyType: "",
      city: "",
      search: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      minArea: "",
      maxArea: "",
      furnishingStatus: "",
      possessionStatus: "",
      isVerified: "",
      lifestyle: "",
      sort: "newest",
      page: 1,
      limit: 24,
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar forceCompact={true} />

      {/* Main Content Area */}
      <main className="pt-28 pb-20">
        <Container>
          {/* Hero Banner Header */}
          <div className="relative rounded-3xl bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white p-6 sm:p-10 mb-8 overflow-hidden shadow-xl">
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <Building2 size={360} />
            </div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF385C]/20 border border-[#FF385C]/40 text-[#FF385C] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={13} />
                <span>Stayr Real Estate</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
                Buy Verified Real Estate with Zero Surprises
              </h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Explore premium penthouses, villas, high-rise apartments and prime commercial office spaces with 100% verified documentation.
              </p>

              {/* Quick Seller Callout */}
              <div className="mt-5 pt-4 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                <span>Looking to sell your real estate property?</span>
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-1 text-[#FF385C] font-bold hover:underline"
                >
                  <KeyRound size={14} />
                  <span>List for sale for free →</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick City Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <MapPin size={13} /> Cities:
            </span>
            {POPULAR_CITIES.map((city) => (
              <button
                key={city.value}
                onClick={() => handleCitySelect(city.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  filters.city === city.value
                    ? "bg-[#FF385C] text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>

          {/* Search & Filter Bar */}
          <SaleSearchBar filters={filters} onFilterChange={handleFilterChange} />

          {/* Results Count & Current Active Filters Banner */}
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {loading ? (
                "Searching real estate listings..."
              ) : (
                <>
                  <span className="font-extrabold text-black">{total}</span>{" "}
                  {total === 1 ? "Property" : "Properties"} for Sale
                  {filters.lifestyle ? ` • ${filters.lifestyle} Lifestyle` : ""}
                  {filters.city ? ` in ${filters.city}` : ""}
                </>
              )}
            </h2>

            {(filters.city || filters.category || filters.search || filters.bedrooms || filters.minPrice || filters.lifestyle) && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#FF385C] hover:underline flex items-center gap-1"
              >
                <FilterX size={13} />
                Clear all filters
              </button>
            )}
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 animate-pulse">
                  <div className="aspect-[16/11] bg-gray-200 rounded-2xl mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Properties Grid */}
          {!loading && listings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <SaleListingCard
                  key={listing.id}
                  listing={listing}
                  isSavedInitially={savedListingIds.has(listing.id)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && listings.length === 0 && (
            <div className="text-center py-20 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#FF385C] flex items-center justify-center mx-auto mb-4">
                <Building2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No matching properties found</h3>
              <p className="text-sm text-gray-500 mb-6">
                Try widening your price range, searching another city, or removing some specific filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}

