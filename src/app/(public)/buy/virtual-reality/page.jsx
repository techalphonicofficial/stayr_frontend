"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import SaleListingCard from "@/components/buy/SaleListingCard";
import { salePropertyApi } from "@/lib/api";
import Link from "next/link";
import { Eye, Sparkles, Glasses, ShieldCheck, ArrowRight, Building2, MapPin } from "lucide-react";

export default function VirtualRealityPropertiesPage() {
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
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
            alt="Virtual Reality Properties"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2C] via-black/40 to-black/30" />

          <div className="absolute inset-0 flex items-end">
            <Container>
              <div className="pb-10 max-w-4xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3 border border-cyan-400/30">
                  <Eye size={13} />
                  <span>3D Digital Twin & Spatial VR Exploration</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-serif tracking-tight font-normal text-white">
                  Properties with Virtual Reality
                </h1>
                <p className="text-sm sm:text-base text-gray-200 mt-2 font-light leading-relaxed max-w-2xl">
                  Step inside world-class homes with true-to-scale millimeter-accurate Matterport 3D digital twins and VR headset spatial tours from anywhere in the world.
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
                Spatial Technology & Asset Verification
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900">
                Why 3D Virtual Reality Tours Are Standard for Multi-Million Dollar Real Estate
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed font-light">
                Digital twin technology provides laser-precise spatial measurements, floor plan verification, and unedited architectural transparency, ensuring trophy asset integrity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <div className="w-8 h-8 rounded-xl bg-[#FF385C]/10 text-[#FF385C] font-bold flex items-center justify-center text-sm mb-3">
                  1
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">True-to-Scale Dimensional Accuracy</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Infrared LiDAR scanning measures interior carpet area within 1% margin of error, allowing buyers and interior designers to measure walls and verify layout plans.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <div className="w-8 h-8 rounded-xl bg-[#FF385C]/10 text-[#FF385C] font-bold flex items-center justify-center text-sm mb-3">
                  2
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Frictionless Overseas Closings</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  International investors walk through estates room-by-room, inspecting ceiling finishes, window exposures, and cabinetry details without international travel delays.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
                <div className="w-8 h-8 rounded-xl bg-[#FF385C]/10 text-[#FF385C] font-bold flex items-center justify-center text-sm mb-3">
                  3
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">Unfiltered Real-Condition Transparency</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Unlike wide-angle photo tricks, 3D spatial models showcase actual room dimensions, hallway flows, and realistic natural light, eliminating inspection surprises.
                </p>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="pt-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Featured 3D & VR-Enabled Residences
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Walk through available real estate in full virtual 3D
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                {listings.length} VR Digital Twins
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

