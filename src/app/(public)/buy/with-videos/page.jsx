"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import SaleListingCard from "@/components/buy/SaleListingCard";
import { salePropertyApi } from "@/lib/api";
import Link from "next/link";
import { PlayCircle, Sparkles, Video, ShieldCheck, ArrowRight, Building2, MapPin } from "lucide-react";

export default function PropertiesWithVideosPage() {
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
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80"
            alt="Properties with Videos"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2C] via-black/40 to-black/30" />

          <div className="absolute inset-0 flex items-end">
            <Container>
              <div className="pb-10 max-w-4xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-500/30">
                  <PlayCircle size={13} />
                  <span>Cinematic Video Tours & Architectural Walkthroughs</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-serif tracking-tight font-normal text-white">
                  Properties with Videos
                </h1>
                <p className="text-sm sm:text-base text-gray-200 mt-2 font-light leading-relaxed max-w-2xl">
                  Experience ultra-luxury residences through high-definition 4K aerial drone cinematics, sunlight time-lapses, and immersive walk-through architectural tours before visiting in person.
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
                Market Presentation & Valuation
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900">
                Why Video Walkthrough Properties Command a Valuation Premium
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed font-light">
                High-end video production is exclusively commissioned for tier-one luxury residences where bespoke finishes, architectural scale, and natural light transitions cannot be conveyed through static photography alone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <div className="w-8 h-8 rounded-xl bg-[#FF385C]/10 text-[#FF385C] font-bold flex items-center justify-center text-sm mb-3">
                  1
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Architectural Spatial Clarity</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Video captures continuous spatial transitions, ceiling height drama, and natural light movement from sunrise to golden hour, verifying property scale.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <div className="w-8 h-8 rounded-xl bg-[#FF385C]/10 text-[#FF385C] font-bold flex items-center justify-center text-sm mb-3">
                  2
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Global Cross-Border Buyer Trust</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Over 45% of prime purchases in Dubai, London, and New York are initiated remotely. Detailed video tours enable overseas buyers to transact with complete confidence.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <div className="w-8 h-8 rounded-xl bg-[#FF385C]/10 text-[#FF385C] font-bold flex items-center justify-center text-sm mb-3">
                  3
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Premier Brokerage Representation</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Properties filmed by professional architectural cinematographers are vetted by top-tier real estate advisors, ensuring verified documentation and clear legal titles.
                </p>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="pt-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Featured Residences with Video Walkthroughs
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Explore full video and photographic coverage
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                {listings.length} Video-Enabled Residences
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

