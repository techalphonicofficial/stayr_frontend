"use client";

import { useState, useEffect } from "react";
import SaleListingCard from "./SaleListingCard";
import { salePropertyApi } from "@/lib/api";
import Link from "next/link";
import { Sparkles, ArrowRight, Building2 } from "lucide-react";

export default function SimilarPropertiesSection({ currentListing }) {
  const [similarListings, setSimilarListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentListing || !currentListing.id) return;

    let isMounted = true;
    setLoading(true);

    async function loadSimilar() {
      try {
        // First try same city
        const res = await salePropertyApi.getSaleListings({
          city: currentListing.city,
          limit: 8
        });

        let matches = [];
        if (res && res.success && Array.isArray(res.data)) {
          matches = res.data.filter((l) => l.id !== currentListing.id);
        }

        // If not enough in same city, fetch by category / property type
        if (matches.length < 3) {
          const fallbackRes = await salePropertyApi.getSaleListings({
            category: currentListing.category || "Residential",
            limit: 8
          });
          if (fallbackRes && fallbackRes.success && Array.isArray(fallbackRes.data)) {
            const extra = fallbackRes.data.filter(
              (l) => l.id !== currentListing.id && !matches.some((m) => m.id === l.id)
            );
            matches = [...matches, ...extra];
          }
        }

        if (isMounted) {
          setSimilarListings(matches.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load similar properties:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSimilar();

    return () => {
      isMounted = false;
    };
  }, [currentListing?.id, currentListing?.city, currentListing?.category]);

  if (!loading && similarListings.length === 0) {
    return null;
  }

  const city = currentListing?.city || "your region";
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="mt-16 pt-12 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF385C] mb-2">
            <Sparkles size={14} />
            <span>Curated Recommendations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-950">
            Similar Properties in {city}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-light">
            Compare similar verified residences, penthouses, and luxury villas in this micro-market.
          </p>
        </div>

        <Link
          href={`/buy/city/${citySlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF385C] hover:underline shrink-0"
        >
          <span>Explore all {city} properties</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-3xl h-80 border border-gray-100"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarListings.map((listing) => (
            <SaleListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

