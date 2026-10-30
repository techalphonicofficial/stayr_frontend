"use client";

import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import Link from "next/link";
import Image from "next/image";
import { LIFESTYLES } from "@/data/lifestyleData";
import { ArrowRight, Compass, Sparkles, Building2 } from "lucide-react";

export default function LuxuryLifestyleSearchPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-gray-900 flex flex-col">
      <Navbar forceCompact={true} />

      {/* Main Container */}
      <main className="flex-1 pt-28 pb-20">
        <Container>
          {/* Breadcrumb / Category Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FF385C] mb-4">
            <Compass size={14} />
            <span>Curated Real Estate Portfolios</span>
          </div>

          {/* Hero Editorial Header */}
          <div className="max-w-4xl mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-gray-900 mb-6 font-normal">
              Luxury Lifestyle Search
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
              Find the perfect home to fit your lifestyle, anywhere in the world. At Stayr, we
              specialize in luxury real estate properties for discerning individuals who are seeking
              a home that creates a unique lifestyle experience. If you like waterfront, find a home
              on an ocean beach or a lake shore, or even a private island estate all your own. If you
              like the outdoors, find a ski, mountain or golf home, or even an equestrian home. Like
              the city? Find a townhome or condo in New York, London, Paris, Mumbai, Noida or any of
              the great cities around the world. Whatever lifestyle you are seeking, we can help
              find the right home for you.
            </p>
          </div>

          {/* Lifestyles Grid (3 columns matching Screenshots 2 & 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {LIFESTYLES.map((item) => (
              <Link
                key={item.id}
                href={`/buy/lifestyle/${item.slug}`}
                className="group flex flex-col cursor-pointer"
              >
                {/* Photo Card with subtle zoom effect */}
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  {/* Subtle hover badge */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-900 flex items-center gap-1 shadow-md">
                    <span>Explore</span>
                    <ArrowRight size={10} />
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="mt-3.5">
                  <h3 className="font-serif text-lg font-medium text-gray-900 group-hover:text-[#FF385C] transition-colors flex items-center justify-between">
                    <span>{item.name}</span>
                    <span className="text-xs text-gray-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Callout Banner */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0F2030] to-[#0A1622] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                <Sparkles size={14} /> Custom Lifestyle Search
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium">Looking for a specific architectural vision?</h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                Connect with our verified private property advisors to access unlisted trophy estates, private off-market residences, and custom developments.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/buy"
                className="px-6 py-3 rounded-xl bg-white text-gray-900 text-xs font-bold hover:bg-gray-100 transition shadow-md"
              >
                Browse All Properties
              </Link>
              <Link
                href="/sell"
                className="px-6 py-3 rounded-xl border border-white/30 text-white text-xs font-bold hover:bg-white/10 transition"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

