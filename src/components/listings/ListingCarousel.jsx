"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ListingCard from "./ListingCard";
import Container from "../common/Container";

import { useState, useEffect } from "react";
import { propertyApi } from "@/lib/api";

export default function ListingCarousel({
  title = "Popular homes in Noida",
  location = "Noida"
}) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        // Fetch dynamically using our centralized API and location prop
        const json = await propertyApi.getProperties({ search: location, limit: 8 });
        if (json && json.success) setListings(json.data);
        else if (json && Array.isArray(json)) setListings(json); // fallback if api returns array directly
      } catch (err) {
        console.error("Failed to fetch carousel properties for", location, err);
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, [location]);

  return (
    <section className="w-full py-6 md:py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex flex-row items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-[#2B2B2B]">
                {title}
              </h2>
              <Link href={`/s/${location}/homes`} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition">
                <ChevronRight size={20} className="text-[#2B2B2B]" />
              </Link>
            </div>

            {/* Navigation Arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 hover:shadow-md hover:border-gray-300 transition bg-white"
              >
                <ChevronLeft size={18} className="text-[#2B2B2B]" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 hover:shadow-md hover:border-gray-300 transition bg-white"
              >
                <ChevronRight size={18} className="text-[#2B2B2B]" />
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div
            ref={scrollRef}
            className="flex flex-row gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {loading ? (
              <div className="text-gray-500 py-4 px-4">Loading properties...</div>
            ) : listings.map((listing) => (
              <div key={listing.id} className="snap-start shrink-0 w-[42vw] sm:w-[45vw] md:w-[30vw] lg:w-[calc(16.666%-20px)]">
                <ListingCard
                  id={listing.id}
                  title={listing.title}
                  price={"₹" + (listing.pricePerNight || 0).toLocaleString("en-IN")}
                  image={listing.featuredImage || listing.images?.[0]?.url || ""}
                  nights={3}
                  rating={listing.averageRating ? listing.averageRating.toFixed(2) : 4.9}
                  reviewCount={listing.totalReviews}
                  topReview={listing.reviews?.[0]}
                />
              </div>
            ))}

          {/* See All Card (Only show if we fetched the maximum limit, meaning there are more and it's pushed off-screen) */}
          {listings.length >= 8 && (
            <Link href={`/s/${location}/homes`} className="snap-start shrink-0 flex items-center justify-center w-[42vw] sm:w-[45vw] md:w-[30vw] lg:w-[calc(16.666%-20px)] aspect-square rounded-xl border border-[#EFE7D8] bg-white hover:shadow-md transition cursor-pointer group">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-20">
                  {/* Decorative overlapping images */}
                  <div className="absolute top-2 left-0 w-16 h-12 bg-gray-200 rounded-md border border-white shadow-sm transform -rotate-6 overflow-hidden">
                     {listings.length > 0 && <img src={listings[0]?.images?.[0]?.url || listings[0]?.featuredImage} onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80"; e.currentTarget.onerror = null; }} className="w-full h-full object-cover opacity: 1,y-80" />}
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-12 bg-gray-200 rounded-md border border-white shadow-sm transform rotate-12 overflow-hidden z-10">
                     {listings.length > 1 && <img src={listings[1]?.images?.[0]?.url || listings[1]?.featuredImage} onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"; e.currentTarget.onerror = null; }} className="w-full h-full object-cover opacity: 1,y-80" />}
                  </div>
                  <div className="absolute bottom-0 left-8 w-16 h-12 bg-gray-200 rounded-md border border-white shadow-md z-20 overflow-hidden">
                     {listings.length > 2 ? (
                       <img src={listings[2]?.images?.[0]?.url || listings[2]?.featuredImage} onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"; e.currentTarget.onerror = null; }} className="w-full h-full object-cover" />
                     ) : (listings.length > 0 && (
                       <img src={listings[0]?.images?.[0]?.url || listings[0]?.featuredImage} onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=400&q=80"; e.currentTarget.onerror = null; }} className="w-full h-full object-cover" />
                     ))}
                  </div>
                </div>
                <span className="font-bold text-[#2B2B2B] group-hover:underline">See all</span>
              </div>
            </Link>
          )}
        </div>
        </motion.div>
      </Container>
    </section>
  );
}
