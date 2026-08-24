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
import { propertyApi } from "@/lib/api";

export default function PerfectPlaceSection() {
  const [activeTab, setActiveTab] = useState("beachfront");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      setLoading(true);
      try {
        // Fetch properties specifically matching the active tab keyword
        const json = await propertyApi.getProperties({ search: activeTab, limit: 4 });
        if (json && json.success) setProperties(json.data);
        else if (json && Array.isArray(json)) setProperties(json);
      } catch (err) {
        console.error("Failed to fetch perfect places:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, [activeTab]);

  const currentProperties = properties.slice(0, 4);

  return (
    <section className="w-full py-4 md:py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >

          {/* Header */}
          <h2 className="text-[24px] md:text-[32px] font-bold text-foreground mb-6 md:mb-8">
            Find your perfect place to stay
          </h2>

          {/* Custom Tab Row - Mobile Optimized */}
          <div className="flex flex-row items-center gap-1 md:gap-2 mb-8 md:mb-10 overflow-x-auto scrollbar-hide pb-2 border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center min-w-[75px] md:min-w-[120px] px-2 md:px-4 py-3 md:py-4 transition-colors duration-300 ${activeTab === tab.id ? "text-[#0050FF]" : "text-muted hover:text-foreground"
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
              const imageToUse = listing.featuredImage || listing.images?.[0]?.url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";

              return (
                <Link href={`/property/${listing.id}`} key={listing.id} className="block w-full cursor-pointer h-full">
                  <motion.div 
                    className="flex flex-col gap-3 w-full h-full p-2 rounded-2xl transition-colors group"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {/* Image Container - Landscape 4:3 */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 shadow-sm group-hover:shadow-[0_10px_40px_rgba(232,182,91,0.25)] group-hover:border group-hover:border-primary/30 transition-all duration-300">
                      <Image
                        src={imageToUse}
                        alt={listing.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      {/* Subtle shine effect on hover */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full z-0 pointer-events-none"
                        whileHover={{ translateX: ["-100%", "200%"] }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />

                      {/* Premier Host Badge */}
                    <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                      <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Premier Host</span>
                    </div>

                    {/* Heart Button */}
                    <button className="absolute top-3 right-3 text-white drop-shadow-md hover:scale-110 transition">
                      <Heart size={24} strokeWidth={2} />
                    </button>
                  </div>

                  {/* Details Container - Vrbo Style */}
                  <div className="flex justify-between items-start mt-1">

                    {/* Left Column */}
                    <div className="flex flex-col max-w-[65%] px-1">
                      <h3 className="font-semibold text-foreground text-[15px] leading-snug truncate group-hover:text-primary transition-colors duration-300">
                        {listing.title}
                      </h3>
                      <p className="text-muted text-[13px] mt-0.5">
                        {listing.bedrooms || 3} bedrooms
                      </p>

                      {/* Reviews */}
                      <div className="flex items-center gap-1.5 mt-3">
                        <div className="bg-success w-[18px] h-[18px] rounded flex items-center justify-center">
                          <span className="text-white text-[12px] leading-none font-bold pb-[1px]">✓</span>
                        </div>
                        <span className="text-success text-[12px] font-bold">
                          {listing.totalReviews || 15} reviews
                        </span>
                      </div>
                    </div>

                    {/* Right Column (Price Details) */}
                    <div className="flex flex-col items-end text-right">
                      <span className="font-bold text-foreground text-[16px]">{priceDisplay}</span>
                      <span className="text-muted text-[11px] mt-0.5">
                        {formattedTotal} for {nights} nights
                      </span>
                      <span className="text-muted text-[11px] mt-0.5">
                        Nov 6 - Nov 9
                      </span>
                    </div>

                  </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* View More Link */}
          <div className="mt-12 text-center md:text-left">
            <Link
              href={`/s/${activeTab}/homes`}
              className="text-foreground font-semibold hover:underline text-[15px]"
            >
              View more properties →
            </Link>
          </div>

        </motion.div>
      </Container>
    </section>
  );
}
