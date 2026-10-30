"use client";

import { use, useState, useEffect, useCallback } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import SaleListingCard from "@/components/buy/SaleListingCard";
import { getCityDetails, CITY_DETAILS } from "@/data/cityDetailsData";
import { salePropertyApi } from "@/lib/api";
import Link from "next/link";
import { 
  MapPin, Compass, Building2, TrendingUp, DollarSign, ShieldCheck, 
  ArrowLeft, ArrowRight, Sparkles, CheckCircle2, ChevronRight, Layers, Landmark
} from "lucide-react";
import { notFound } from "next/navigation";

export default function CityMarketplacePage({ params }) {
  const unwrappedParams = use(params);
  const citySlug = unwrappedParams.city;
  const cityInfo = getCityDetails(citySlug);

  if (!cityInfo) {
    notFound();
  }

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  const fetchCityListings = useCallback(async () => {
    setLoading(true);
    try {
      const searchCity = cityInfo.queryCity || cityInfo.cityName?.split("/")[0].trim() || cityInfo.cityName;
      const q = {
        city: searchCity,
        limit: 24
      };
      if (filterType !== "all") {
        q.propertyType = filterType;
      }
      const res = await salePropertyApi.getSaleListings(q);
      if (res && res.success) {
        setListings(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load city properties:", err);
    } finally {
      setLoading(false);
    }
  }, [cityInfo, filterType]);

  useEffect(() => {
    fetchCityListings();
  }, [fetchCityListings]);

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-gray-900 flex flex-col">
      <Navbar forceCompact={true} />

      <main className="flex-1 pt-24 pb-20">
        {/* ================================================================= */}
        {/* HERO BANNER                                                       */}
        {/* ================================================================= */}
        <div className="relative h-[420px] sm:h-[480px] w-full overflow-hidden bg-gray-950 text-white">
          <img
            src={cityInfo.heroImage}
            alt={cityInfo.cityName}
            className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2C] via-black/40 to-black/30" />

          <div className="absolute inset-0 flex items-end">
            <Container>
              <div className="pb-10 max-w-4xl">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-semibold text-white/70 mb-3">
                  <Link href="/buy" className="hover:text-white transition">Buy</Link>
                  <ChevronRight size={12} />
                  <Link href="/buy/destinations" className="hover:text-white transition">Destinations</Link>
                  <ChevronRight size={12} />
                  <span className="text-white font-bold">{cityInfo.cityName}</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-cyan-300 text-xs font-semibold mb-3 border border-white/15">
                  <Landmark size={12} />
                  <span>{cityInfo.country} Prime Real Estate</span>
                </div>

                <h1 className="text-3xl sm:text-6xl font-serif tracking-tight font-normal text-white">
                  {cityInfo.cityName}
                </h1>
                <p className="text-sm sm:text-lg text-gray-200 mt-2 font-light leading-relaxed max-w-3xl">
                  {cityInfo.tagline}
                </p>
              </div>
            </Container>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MARKET KEY STATS BAR                                              */}
        {/* ================================================================= */}
        <div className="bg-[#FAF7F2] border-y border-[#EFE7D8] py-6 shadow-sm">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] block">
                  Avg Rate / Sq Ft
                </span>
                <span className="text-base sm:text-xl font-bold text-gray-900 mt-0.5 block">
                  {cityInfo.avgPricePerSqFt}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">{cityInfo.priceInINR}</span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] block">
                  Annual Appreciation
                </span>
                <span className="text-base sm:text-xl font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                  <TrendingUp size={16} />
                  {cityInfo.annualAppreciation}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">Historical CAGR</span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] block">
                  Gross Rental Yield
                </span>
                <span className="text-base sm:text-xl font-bold text-gray-900 mt-0.5 block">
                  {cityInfo.rentalYield}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">Prime Residential</span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] block">
                  Market Status
                </span>
                <span className="text-base sm:text-xl font-bold text-[#FF385C] mt-0.5 block">
                  High Demand
                </span>
                <span className="text-[10px] text-gray-500 font-medium">Trophy Asset Class</span>
              </div>
            </div>
          </Container>
        </div>

        <Container>
          {/* =============================================================== */}
          {/* OVERVIEW & LOCALITY GUIDE                                       */}
          {/* =============================================================== */}
          <div className="pt-16 pb-12">
            <div className="max-w-4xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF385C] block mb-2">
                Locality & Neighborhood Guide
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-medium text-gray-900">
                Prime Residential Neighborhoods in {cityInfo.cityName}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mt-4 font-light">
                {cityInfo.overview}
              </p>
            </div>

            {/* Micro-Localities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cityInfo.localities.map((loc, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-[#EFE7D8] shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                      <MapPin size={16} className="text-[#FF385C]" />
                      <span>{loc.name}</span>
                    </h3>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF385C]/10 text-[#FF385C]">
                      {loc.priceTier}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mt-2">
                    {loc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* =============================================================== */}
          {/* WHY IT COSTS THIS MUCH                                          */}
          {/* =============================================================== */}
          <div className="my-12 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0F2030] to-[#0A1622] text-white shadow-xl">
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={13} />
                <span>Investment & Valuation Analysis</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-medium">
                Why Real Estate Costs This Much in {cityInfo.cityName}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-3 font-light leading-relaxed">
                Understanding the underlying structural, economic, and geographic fundamentals that create sustained, compounding property valuations in this world-class micro-market.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cityInfo.whyItCostsThisMuch.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-[#FF385C] text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-md">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base mb-1.5">{item.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed font-light">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =============================================================== */}
          {/* CURATED PROPERTY LISTINGS                                       */}
          {/* =============================================================== */}
          <div className="pt-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>Available Residences in {cityInfo.cityName}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                    {listings.length} Properties
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  100% verified documentation with direct seller contacts
                </p>
              </div>

              {/* Quick Type Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {["all", "Penthouse", "Villa", "Apartment"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                      filterType === t
                        ? "bg-[#FF385C] text-white shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {t === "all" ? "All Types" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Cards Grid */}
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
                  No properties found in this filter
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                  Try viewing all property types or connect with our private property advisors.
                </p>
                <button
                  onClick={() => setFilterType("all")}
                  className="px-5 py-2.5 rounded-xl bg-[#FF385C] text-white text-xs font-bold"
                >
                  Clear Type Filter
                </button>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* EXPLORE OTHER GLOBAL DESTINATIONS                               */}
          {/* =============================================================== */}
          <div className="mt-20 pt-10 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-2xl font-normal text-gray-900">
                  Explore Other Global Metropolises
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Discover premier real estate markets around the world
                </p>
              </div>
              <Link
                href="/buy/destinations"
                className="text-xs font-bold text-[#FF385C] hover:underline flex items-center gap-1"
              >
                <span>All Destinations</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.values(CITY_DETAILS).filter(c => c.slug !== citySlug).slice(0, 4).map((other) => (
                <Link
                  key={other.slug}
                  href={`/buy/city/${other.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-white border border-[#EFE7D8] shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                    <img
                      src={other.heroImage}
                      alt={other.cityName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-2 left-3 text-white font-bold text-sm">
                      {other.cityName}
                    </span>
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      {other.country}
                    </span>
                    <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {other.avgPricePerSqFt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

