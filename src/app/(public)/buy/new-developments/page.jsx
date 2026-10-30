"use client";

import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import Link from "next/link";
import { Building2, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Clock } from "lucide-react";

const DEVELOPMENTS = [
  {
    id: "skyline-towers",
    title: "Aura Sky Residences",
    developer: "Prestige Grand Developments",
    location: "Sector 128, Expressway, Noida",
    status: "Under Construction",
    completion: "Q4 2027",
    units: "3, 4 & 5 BHK Sky Mansions",
    startingPrice: "₹3.8 Cr",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    highlights: ["Infinity sky pool", "Private elevator lobby", "Smart home automation", "IGBC Platinum Certified"]
  },
  {
    id: "bayview-marina",
    title: "The Marina Bay Penthouses",
    developer: "Sobha Signature Realty",
    location: "Worli Sea Face, Mumbai",
    status: "Newly Launched",
    completion: "Q2 2028",
    units: "4 & 6 BHK Sea-Facing Duplexes",
    startingPrice: "₹14.5 Cr",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    highlights: ["Unobstructed Arabian Sea views", "Concierge yacht charter", "Private plunge pools"]
  },
  {
    id: "emerald-greens",
    title: "The Reserve Golf Villas",
    developer: "DLF Luxury Estates",
    location: "Golf Course Extension, Gurgaon",
    status: "Ready to Move",
    completion: "Delivered",
    units: "Independent 5 BHK Villas",
    startingPrice: "₹9.2 Cr",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    highlights: ["Overlooking 18-hole golf course", "Private landscaped lawns", "Double-height living rooms"]
  }
];

export default function NewDevelopmentsPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-gray-900 flex flex-col">
      <Navbar forceCompact={true} />

      <main className="flex-1 pt-28 pb-20">
        <Container>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FF385C] mb-4">
            <Building2 size={14} />
            <span>Architectural Landmarks & Pre-Construction</span>
          </div>

          <div id="overview" className="max-w-4xl mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-gray-900 mb-6 font-normal">
              Discover New Developments
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
              Explore premier off-plan, under-construction and newly delivered master-planned
              developments across prime regions. Stayr partners directly with vetted developers and
              premier builders to offer transparent pricing, milestone schedules, and direct-from-developer
              guarantees.
            </p>
          </div>

          {/* Development Showcase Cards */}
          <div className="space-y-8">
            {DEVELOPMENTS.map((dev) => (
              <div
                key={dev.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col lg:flex-row"
              >
                <div className="lg:w-1/2 relative min-h-[280px] lg:min-h-[380px] overflow-hidden">
                  <img
                    src={dev.image}
                    alt={dev.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/75 backdrop-blur text-white flex items-center gap-1.5">
                      <Clock size={12} className="text-amber-400" />
                      {dev.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur text-gray-900">
                      Handover: {dev.completion}
                    </span>
                  </div>
                </div>

                <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                      {dev.developer}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 mt-1">
                      {dev.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      {dev.location}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-4 pb-6 border-b border-gray-100">
                      <div>
                        <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Configuration</span>
                        <span className="text-sm font-semibold text-gray-900 mt-0.5 block">{dev.units}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Starting Price</span>
                        <span className="text-lg font-bold text-gray-900 mt-0.5 block">{dev.startingPrice}</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <span className="text-xs font-bold text-gray-700 block mb-2">Project Highlights:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {dev.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <ShieldCheck size={14} className="text-blue-600" />
                      RERA Verified & Approved
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/buy?search=${encodeURIComponent(dev.title)}`}
                        className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                      >
                        <span>View Units</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
}

