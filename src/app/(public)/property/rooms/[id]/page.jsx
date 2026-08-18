"use client";

import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import ImageGallery from "@/components/rooms/ImageGallery";
import RoomDetails from "@/components/rooms/RoomDetails";
import BookingWidget from "@/components/rooms/BookingWidget";

import { getListingById } from "@/data/listings";

// Helper to generate missing details (since base listings only have title, price, etc.)
const generateRichRoomData = (baseListing) => {
  if (!baseListing) return null;
  
  // Use the ID to deterministically generate some mock rich data
  const seed = baseListing.id;
  
  return {
    ...baseListing,
    hostName: seed % 2 === 0 ? "Stayr Superhost" : "Verified Host",
    guests: (seed % 4) + 2, // 2 to 5 guests
    bedrooms: (seed % 3) + 1, // 1 to 3 bedrooms
    beds: (seed % 3) + 1,
    baths: (seed % 2) + 1,
    reviews: (seed * 7) % 300 + 12,
    images: [
      baseListing.image,
      "https://images.unsplash.com/photo-1560347876-aeef00ee58a4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    ]
  };
};

import { use, useEffect } from "react";
import { motion } from "framer-motion";

export default function RoomPage({ params }) {
  const unwrappedParams = use(params);
  const baseListing = getListingById(unwrappedParams.id);
  const roomData = generateRichRoomData(baseListing);

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!roomData) {
    return <div className="min-h-screen bg-[#FFFDF8] pt-32 text-center text-2xl font-bold">Room not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] pb-24">
      {/* Sticky Navbar (Compact Mode) */}
      <Navbar forceCompact={true} />

      <motion.div 
        className="pt-[100px] md:pt-[120px]"
        initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Container>
          
          {/* Room Title Header */}
          <div className="mb-6">
            <h1 className="text-[26px] md:text-[32px] font-bold text-[#2B2B2B] leading-tight">
              {roomData.title}
            </h1>
          </div>

          {/* Image Gallery */}
          <ImageGallery images={roomData.images} />

          {/* Content Split Layout */}
          <div className="flex flex-col md:flex-row gap-12 mt-12">
            
            {/* Left Column: Details & Description */}
            <div className="w-full md:w-2/3">
              <RoomDetails 
                hostName={roomData.hostName}
                guests={roomData.guests}
                bedrooms={roomData.bedrooms}
                beds={roomData.beds}
                baths={roomData.baths}
                amenities={roomData.amenities}
              />
            </div>

            {/* Right Column: Sticky Booking Widget */}
            <div className="w-full md:w-1/3 relative">
              <BookingWidget 
                propertyId={roomData.id}
                price={roomData.price}
                rating={roomData.rating}
                reviews={roomData.reviews}
              />
            </div>

          </div>

        </Container>
      </motion.div>
    </div>
  );
}
