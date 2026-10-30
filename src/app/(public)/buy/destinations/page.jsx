"use client";

import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import Link from "next/link";
import { POPULAR_CITIES_DATA } from "@/data/destinationsData";
import { MapPin, ArrowRight, Compass, Sparkles } from "lucide-react";

export default function DestinationsSearchPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-gray-900 flex flex-col">
      <Navbar forceCompact={true} />

      <main className="flex-1 pt-28 pb-20">
        <Container>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FF385C] mb-4">
            <Compass size={14} />
            <span>Global Real Estate Marketplace</span>
          </div>

          <div className="max-w-4xl mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-gray-900 mb-6 font-normal">
              Properties by Destination
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
              Explore exceptional homes in world-renowned metropolitan capitals, serene coastal
              escapes, and emerging growth corridors. From Manhattan penthouses and London townhouses
              to prime expressway residences in Noida and sea-facing estates in Mumbai and Dubai,
              Stayr connects you directly with premier real estate.
            </p>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {POPULAR_CITIES_DATA.map((item) => (
              <Link
                key={item.id}
                href={`/buy?city=${encodeURIComponent(item.query)}`}
                className="group flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-1">
                      {item.country}
                    </span>
                    <h3 className="font-serif text-2xl font-medium">{item.name}</h3>
                  </div>

                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 flex items-center gap-1 shadow-md">
                    <span>View Properties</span>
                    <ArrowRight size={11} />
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500 line-clamp-1">{item.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
}

