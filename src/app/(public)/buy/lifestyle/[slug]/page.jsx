"use client";

import { use, useState, useEffect, useCallback } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import SaleListingCard from "@/components/buy/SaleListingCard";
import { getLifestyleBySlug, LIFESTYLES } from "@/data/lifestyleData";
import { salePropertyApi } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Compass, Building2, MapPin, Sparkles, Filter } from "lucide-react";
import { notFound } from "next/navigation";

export default function LifestyleDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  const lifestyle = getLifestyleBySlug(slug);

  if (!lifestyle) {
    notFound();
  }

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      // First try fetching listings filtered by lifestyle
      let res = await salePropertyApi.getSaleListings({
        lifestyle: lifestyle.name,
        limit: 12
      });

      // If no specific keyword match in database yet, load all published listings as recommendations
      if (!res?.data || res.data.length === 0) {
        res = await salePropertyApi.getSaleListings({ limit: 12 });
      }

      if (res && res.success) {
        setListings(res.data || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [lifestyle.name]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-gray-900 flex flex-col">
      <Navbar forceCompact={true} />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero Banner for this Lifestyle */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-gray-900 text-white">
          <img
            src={lifestyle.image}
            alt={lifestyle.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          <div className="absolute inset-0 flex items-end">
            <Container>
              <div className="pb-8 sm:pb-12 max-w-3xl">
                <Link
                  href="/buy/lifestyle"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white mb-4 transition"
                >
                  <ArrowLeft size={14} />
                  <span>All Lifestyles</span>
                </Link>

                <h1 className="text-3xl sm:text-5xl font-serif tracking-tight font-normal text-white">
                  {lifestyle.name} Properties
                </h1>
                <p className="text-sm sm:text-base text-gray-200 mt-2 font-light leading-relaxed">
                  {lifestyle.description}
                </p>
              </div>
            </Container>
          </div>
        </div>

        {/* Listings Section */}
        <Container>
          {/* Valuation & Locality Dynamics Card */}
          <div className="my-10 p-8 rounded-3xl bg-white border border-[#EFE7D8] shadow-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF385C] block mb-1.5">
              Lifestyle Valuation Dynamics
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-gray-900 mb-3">
              Why {lifestyle.name} Real Estate Commands a Value Premium
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 mt-4">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <strong className="text-gray-900 block mb-1 font-bold text-sm">Natural Topography Scarcity</strong>
                Prime {lifestyle.name.toLowerCase()} parcels (coastal dunes, fairway frontages, or mountain ridges) cannot be manufactured. Strict environmental zoning permanently limits new inventory.
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <strong className="text-gray-900 block mb-1 font-bold text-sm">Emotional & Wellness Appeal</strong>
                High-net-worth buyers invest in {lifestyle.name.toLowerCase()} homes for multi-generational well-being, privacy, and curated outdoor leisure that cannot be replicated in generic apartments.
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <strong className="text-gray-900 block mb-1 font-bold text-sm">High Secondary Liquidity</strong>
                Trophy {lifestyle.name.toLowerCase()} properties exhibit lower volatility during market downturns and command exceptional premium seasonal holiday rental returns.
              </div>
            </div>
          </div>

          <div className="pt-2">
            {/* Header / Filter Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>Available Residences</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {listings.length} Listed
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verified real estate properties matching {lifestyle.name.toLowerCase()} living
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/buy"
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-white text-xs font-bold text-gray-700 transition"
                >
                  View All Buy Listings
                </Link>
                <Link
                  href="/sell"
                  className="px-4 py-2 rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold hover:bg-[var(--brand-primary)]/90 transition shadow-sm"
                >
                  List {lifestyle.name} Property
                </Link>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-gray-100" />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
                {listings.map((item) => (
                  <SaleListingCard key={item.id} listing={item} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 mt-8 p-8">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center mx-auto mb-3">
                  <Building2 size={28} />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1">
                  No {lifestyle.name} properties found right now
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                  Be the first to list a property in this category or explore other luxury lifestyle portfolios.
                </p>
                <Link
                  href="/sell"
                  className="px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold"
                >
                  List a Property for Sale
                </Link>
              </div>
            )}

            {/* Explore Other Lifestyles Carousel / Grid */}
            <div className="mt-20 pt-10 border-t border-gray-200">
              <h3 className="font-serif text-2xl font-normal text-gray-900 mb-6">
                Explore Other Lifestyles
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {LIFESTYLES.filter((l) => l.slug !== slug).slice(0, 4).map((other) => (
                  <Link
                    key={other.id}
                    href={`/buy/lifestyle/${other.slug}`}
                    className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={other.image}
                        alt={other.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-serif text-sm font-medium text-gray-900 group-hover:text-[#FF385C] transition">
                        {other.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                        {other.subtitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

