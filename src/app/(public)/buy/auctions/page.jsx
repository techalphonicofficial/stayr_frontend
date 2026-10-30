"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import SaleListingCard from "@/components/buy/SaleListingCard";
import { salePropertyApi } from "@/lib/api";
import Link from "next/link";
import { Gavel, Sparkles, TrendingUp, ShieldCheck, ArrowRight, Building2, MapPin, AlertCircle } from "lucide-react";

export default function AuctionPropertiesPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await salePropertyApi.getSaleListings({ limit: 12 });
        setListings(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-gray-900 flex flex-col">
      <Navbar forceCompact={true} />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero */}
        <div className="relative h-[380px] sm:h-[440px] w-full overflow-hidden bg-gray-950 text-white">
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80"
            alt="Properties for Auction"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2C] via-black/40 to-black/30" />

          <div className="absolute inset-0 flex items-end">
            <Container>
              <div className="pb-10 max-w-4xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-3 border border-rose-500/30">
                  <Gavel size={13} />
                  <span>Curated Competitive Bidding Marketplace</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-serif tracking-tight font-normal text-white">
                  Properties for Auction
                </h1>
                <p className="text-sm sm:text-base text-gray-200 mt-2 font-light leading-relaxed max-w-2xl">
                  Acquire rare trophy estates, bank-verified asset sales, and liquidation opportunities through transparent, timed auction bidding with published reserve guidelines.
                </p>
              </div>
            </Container>
          </div>
        </div>

        <Container>
          {/* Detail & Why It Costs This Much */}
          <div className="my-12 p-8 sm:p-12 rounded-3xl bg-white border border-[#EFE7D8] shadow-sm">
            <div className="max-w-3xl mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF385C] block mb-1.5">
                Valuation & Reserve Economics
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900">
                Why Auction Real Estate Is Priced This Way
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed font-light">
                Unlike speculative broker listings that sit for months with inflated markups, auction pricing represents true market discovery driven by verified reserves and expedited closings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <div className="w-8 h-8 rounded-xl bg-[#FF385C]/10 text-[#FF385C] font-bold flex items-center justify-center text-sm mb-3">
                  1
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Below-Market Reserve Bids</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Starting bids are deliberately set 20-30% below appraised valuation to attract qualified global bidding pools, creating immediate upside potential.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <div className="w-8 h-8 rounded-xl bg-[#FF385C]/10 text-[#FF385C] font-bold flex items-center justify-center text-sm mb-3">
                  2
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Motivated Sellers & Estate Settlements</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Auction properties typically arise from estate trust handovers, corporate asset realignments, or expedited liquidity needs where time certainty outweighs holding costs.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <div className="w-8 h-8 rounded-xl bg-[#FF385C]/10 text-[#FF385C] font-bold flex items-center justify-center text-sm mb-3">
                  3
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Comprehensive Title Due Diligence</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Every auction asset undergoes independent title search, structural inspection reports, and RERA/lien certification before being admitted to the auction catalog.
                </p>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="pt-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Featured Auction Lots & Tender Residences
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verified real estate available for registration and competitive bidding
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                {listings.length} Auction Listings
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-gray-100" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
                {listings.map((item) => (
                  <SaleListingCard key={item.id} listing={item} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
}

