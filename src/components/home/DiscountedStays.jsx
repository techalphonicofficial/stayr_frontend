"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "../common/Container";
import ListingCard from "../listings/ListingCard";
import { useState, useEffect } from "react";
import { propertyApi } from "@/lib/api";

export default function DiscountedStays() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const json = await propertyApi.getProperties({ limit: 4 });
        if (json && json.success) setProperties(json.data);
        else if (json && Array.isArray(json)) setProperties(json);
      } catch (err) {
        console.error("Failed to fetch discounted properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, []);
  return (
    <section className="w-full py-6 md:py-12 border-t border-[#EFE7D8] bg-[#FFFDF8]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-[#2B2B2B] flex items-center gap-4">
              Monsoon stays for less
            </h2>
            <p className="text-[#7B7468] text-[15px] mt-1">
              Whether you go last minute or want to stay longer, find deals on thousands of luxury rentals across India.
            </p>
          </div>
          <Link 
            href="/s/monsoon/homes" 
            className="self-start md:self-auto shrink-0 px-5 py-2 rounded-full border-2 border-[#2B2B2B] text-[#2B2B2B] font-bold text-sm hover:bg-[#2B2B2B] hover:text-white transition-colors"
          >
            Book now
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500">Loading deals...</div>
          ) : properties.map((listing) => (
            <ListingCard 
              key={listing.id} 
              id={listing.id}
              title={listing.title}
              price={"₹" + (listing.pricePerNight || 0).toLocaleString("en-IN")}
              originalPrice={"₹" + ((listing.pricePerNight || 0) + 2000).toLocaleString("en-IN")}
              image={listing.images?.[0]?.url || listing.featuredImage || "https://via.placeholder.com/400"}
              discountText="20% off"
              nights={3}
              rating={listing.averageRating ? listing.averageRating.toFixed(2) : 4.9}
              reviewCount={listing.totalReviews}
              topReview={listing.reviews?.[0]}
            />
          ))}
        </div>
        </motion.div>
      </Container>
    </section>
  );
}
