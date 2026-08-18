"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Umbrella, Waves, Globe, Users, Heart } from "lucide-react";
import Container from "../common/Container";
import Link from "next/link";
import Image from "next/image";

const TABS = [
  { id: "beachfront", label: "Beachfront", icon: <Umbrella size={24} strokeWidth={1.5} /> },
  { id: "pools", label: "Pools", icon: <Waves size={24} strokeWidth={1.5} /> },
  { id: "international", label: "International", icon: <Globe size={24} strokeWidth={1.5} /> },
  { id: "family", label: "Family friendly", icon: <Users size={24} strokeWidth={1.5} /> },
];

import { useEffect } from "react";

export default function PerfectPlaceSection() {
  const [activeTab, setActiveTab] = useState("beachfront");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/properties?limit=20`);
        const json = await res.json();
        if (json.success) setProperties(json.data);
      } catch (err) {
        console.error("Failed to fetch perfect places:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, []);

  const getFilteredProperties = () => {
    // Simple filter mapping based on tab
    if (activeTab === "beachfront") return properties.slice(0, 4);
    if (activeTab === "pools") return properties.slice(4, 8);
    if (activeTab === "international") return properties.slice(8, 12);
    if (activeTab === "family") return properties.slice(12, 16);
    return properties.slice(0, 4);
  };

  const currentProperties = getFilteredProperties();

  return (
    <section className="w-full py-8 md:py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
        
        {/* Header */}
        <h2 className="text-[24px] md:text-[32px] font-bold text-[#2B2B2B] mb-6 md:mb-8">
          Find your perfect place to stay
        </h2>

        {/* Custom Tab Row - Mobile Optimized */}
        <div className="flex flex-row items-center gap-1 md:gap-2 mb-8 md:mb-10 overflow-x-auto scrollbar-hide pb-2 border-b border-[#EFE7D8]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[75px] md:min-w-[120px] px-2 md:px-4 py-3 md:py-4 transition-colors duration-300 ${
                activeTab === tab.id ? "text-[#0050FF]" : "text-[#7B7468] hover:text-[#2B2B2B]"
              }`}
            >
              <div className="mb-1 md:mb-2 scale-[0.85] md:scale-100">
                {tab.icon}
              </div>
              <span className="text-[11px] md:text-[14px] font-semibold whitespace-nowrap">
                {tab.label}
              </span>

              {/* Animated Underline */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="perfect-place-tab"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0050FF]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Listings Grid (Mobile: 1 col landscape cards, Desktop: 4 col) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
          {loading ? (
            <div className="col-span-full py-10 text-center text-gray-500">Loading properties...</div>
          ) : currentProperties.map((listing) => {
            const numericPrice = listing.pricePerNight || 0;
            const nights = 3; // default nights for display
            const total = numericPrice * nights;
            const formattedTotal = "₹" + total.toLocaleString("en-IN");
            const priceDisplay = "₹" + numericPrice.toLocaleString("en-IN");
            const imageToUse = listing.images?.[0]?.url || listing.featuredImage || "https://via.placeholder.com/400x300";

            return (
              <Link href={`/property/${listing.id}`} key={listing.id} className="flex flex-col gap-3 w-full cursor-pointer group">
                {/* Image Container - Landscape 4:3 */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
                  <Image 
                    src={imageToUse} 
                    alt={listing.title} 
                    fill 
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {/* Premier Host Badge */}
                  <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                    <span className="text-[10px] font-bold text-[#2B2B2B] uppercase tracking-wider">Premier Host</span>
                  </div>
                  
                  {/* Heart Button */}
                  <button className="absolute top-3 right-3 text-white drop-shadow-md hover:scale-110 transition">
                    <Heart size={24} strokeWidth={2} />
                  </button>
                </div>

                {/* Details Container - Vrbo Style */}
                <div className="flex justify-between items-start mt-1">
                  
                  {/* Left Column */}
                  <div className="flex flex-col max-w-[65%]">
                    <h3 className="font-semibold text-[#2B2B2B] text-[15px] leading-snug truncate">
                      {listing.title}
                    </h3>
                    <p className="text-[#7B7468] text-[13px] mt-0.5">
                      {listing.bedrooms || 3} bedrooms
                    </p>
                    
                    {/* Reviews */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <div className="bg-[#128859] w-[18px] h-[18px] rounded flex items-center justify-center">
                         <span className="text-white text-[12px] leading-none font-bold pb-[1px]">✓</span>
                      </div>
                      <span className="text-[#128859] text-[12px] font-bold">
                        {listing.totalReviews || 15} reviews
                      </span>
                    </div>
                  </div>

                  {/* Right Column (Price Details) */}
                  <div className="flex flex-col items-end text-right">
                    <span className="font-bold text-[#2B2B2B] text-[16px]">{priceDisplay}</span>
                    <span className="text-[#7B7468] text-[11px] mt-0.5">
                      {formattedTotal} for {nights} nights
                    </span>
                    <span className="text-[#7B7468] text-[11px] mt-0.5">
                      Nov 6 - Nov 9
                    </span>
                  </div>
                  
                </div>
              </Link>
            );
          })}
        </div>

        {/* View More Link */}
        <div className="mt-12 text-center md:text-left">
          <Link 
            href={`/s/${activeTab}/homes`}
            className="text-[#2B2B2B] font-semibold hover:underline text-[15px]"
          >
            View more properties →
          </Link>
        </div>

        </motion.div>
      </Container>
    </section>
  );
}
