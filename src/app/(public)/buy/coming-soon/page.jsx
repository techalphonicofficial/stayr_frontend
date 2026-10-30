"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import SaleListingCard from "@/components/buy/SaleListingCard";
import { salePropertyApi } from "@/lib/api";
import Link from "next/link";
import { Clock, Sparkles, TrendingUp, ShieldCheck, ArrowRight, Building2, MapPin } from "lucide-react";

export default function ComingSoonPropertiesPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Fetch properties with Under Construction or newest listings
        const res = await salePropertyApi.getSaleListings({
          possessionStatus: "Under Construction",
          limit: 12
        });
        if (res && res.success && res.data?.length > 0) {
          setListings(res.data);
        } else {
          const fallback = await salePropertyApi.getSaleListings({ limit: 12 });
          setListings(fallback.data || []);
        }
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
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt="Coming Soon Properties"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2C] via-black/40 to-black/30" />

          <div className="absolute inset-0 flex items-end">
            <Container>
              <div className="pb-10 max-w-4xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
                  <Clock size={13} />
                  <span>Pre-Launch & Off-Market Portfolio</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-serif tracking-tight font-normal text-white">
                  Properties Coming Soon
                </h1>
                <p className="text-sm sm:text-base text-gray-200 mt-2 font-light leading-relaxed max-w-2xl">
                  First-mover access to prime off-market residences and luxury developments before public market debut. Secure foundational pre-launch valuations and preferred floor layouts.
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
                Valuation & Investment Analysis
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900">
                Why Coming Soon Properties Are Priced This Way
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed font-light">
                Pre-launch and coming-soon pricing reflects an asymmetric risk-reward window where buyers benefit from developer introductory pricing while absorbing execution timelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <div className="w-8 h-8 rounded-xl bg-[#FF385C]/10 text-[#FF385C] font-bold flex items-center justify-center text-sm mb-3">
                  1
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">15% - 25% First-Mover Discount</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Developers offer preferential launch rates during private preview phases to achieve institutional debt covenants, granting early buyers immediate built-in equity.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <div className="w-8 h-8 rounded-xl bg-[#FF385C]/10 text-[#FF385C] font-bold flex items-center justify-center text-sm mb-3">
                  2
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Milestone Escrow Payment Plans</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Capital outlay is deferred across 2-4 years linked to audited construction milestones (e.g. 20% down, 80% on handover), drastically lowering capital costs.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <div className="w-8 h-8 rounded-xl bg-[#FF385C]/10 text-[#FF385C] font-bold flex items-center justify-center text-sm mb-3">
                  3
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Prime High-Floor Selection</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Coming soon inventory unlocks access to corner penthouses, sea-facing stacks, and top-floor unobstructed vistas before public brokers exhaust the inventory.
                </p>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="pt-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Featured Coming Soon Properties
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pre-construction and private preview listings available for registration
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {listings.length} Active Listings
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

