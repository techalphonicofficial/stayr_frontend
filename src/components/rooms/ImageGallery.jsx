"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Grid, Heart, Share, ChevronLeft } from "lucide-react";

export default function ImageGallery({ images = [] }) {
  // We expect an array of at least 5 images for the full layout
  // Fallback to placeholders if not provided
  const displayImages = images.length >= 5 ? images : [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1560347876-aeef00ee58a4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
  ];

  const [showModal, setShowModal] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Action Buttons (Share/Save) - Desktop positioned relative to title, but shown here for layout flow */}
      <div className="flex justify-end items-center gap-4 text-[14px] font-semibold underline text-foreground">
        <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition">
          <Share size={16} /> Share
        </button>
        <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition">
          <Heart size={16} /> Save
        </button>
      </div>

      {/* Image Grid Container */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex gap-2 rounded-xl overflow-hidden group">
        
        {/* Main Image (Left) */}
        <div className="relative w-full md:w-1/2 h-full cursor-pointer overflow-hidden">
          <Image 
            src={displayImages[0]} 
            alt="Main room view" 
            fill 
            className="object-cover hover:scale-105 transition duration-500" 
          />
          {/* Overlay to dim other images when hovering over grid, typically done with complex CSS, keeping it simple here */}
        </div>

        {/* Small Images Grid (Right - Hidden on mobile) */}
        <div className="hidden md:grid w-1/2 grid-cols-2 grid-rows-2 gap-2 h-full">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="relative w-full h-full cursor-pointer overflow-hidden">
              <Image 
                src={displayImages[idx]} 
                alt={`Room detail ${idx}`} 
                fill 
                className="object-cover hover:scale-105 transition duration-500" 
              />
            </div>
          ))}
        </div>

        {/* Show all photos button */}
        <button 
          onClick={() => setShowModal(true)}
          className="absolute bottom-6 right-6 bg-white border border-foreground px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-md hover:bg-gray-50 transition active:scale-95 z-10"
        >
          <Grid size={16} />
          Show all photos
        </button>
      </div>

      {/* Full Screen Photo Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in duration-200">
          
          {/* Modal Header */}
          <div className="sticky top-0 w-full bg-white px-6 py-4 flex justify-between items-center z-10 border-b border-gray-200">
            <button 
              onClick={() => setShowModal(false)}
              className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-4 text-sm font-semibold underline">
              <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition">
                <Share size={16} /> Share
              </button>
              <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition">
                <Heart size={16} /> Save
              </button>
            </div>
          </div>

          {/* Modal Images Content */}
          <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-4">
            {displayImages.map((imgUrl, idx) => (
              <div key={idx} className="relative w-full aspect-[4/3] md:aspect-[16/9]">
                <Image 
                  src={imgUrl} 
                  alt={`Room image ${idx + 1}`} 
                  fill 
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
