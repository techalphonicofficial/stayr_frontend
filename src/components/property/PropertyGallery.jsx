"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Grid, Heart, Share, ChevronLeft, ChevronRight, X } from "lucide-react";
import ShareModal from "../modals/ShareModal";

export default function PropertyGallery({ images = [], property }) {
  const displayImages = images.length >= 5 ? images : [
    ...images,
    ...Array(5 - images.length).fill("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200")
  ].slice(0, 5);

  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

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

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Action Buttons */}
      <div className="flex justify-end items-center gap-4 text-[14px] font-semibold underline text-[#2B2B2B]">
        <button onClick={handleShare} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition">
          <Share size={16} /> Share
        </button>
        <button onClick={handleSave} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition">
          <Heart size={16} className={isSaved ? "fill-[#FF385C] text-[#FF385C]" : ""} /> {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      {/* Grid Container */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex gap-2 rounded-xl overflow-hidden group">
        
        {/* Main Image (Left) */}
        <div className="relative w-full md:w-1/2 h-full cursor-pointer overflow-hidden" onClick={() => { setCurrentIndex(0); setShowModal(true); }}>
          <Image 
            src={displayImages[0]} 
            alt="Main property view" 
            fill 
            className="object-cover hover:scale-105 transition duration-500" 
          />
        </div>

        {/* Small Images Grid (Right - Hidden on mobile) */}
        <div className="hidden md:grid w-1/2 grid-cols-2 grid-rows-2 gap-2 h-full">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="relative w-full h-full cursor-pointer overflow-hidden" onClick={() => { setCurrentIndex(idx); setShowModal(true); }}>
              <Image 
                src={displayImages[idx]} 
                alt={`Property detail ${idx}`} 
                fill 
                className="object-cover hover:scale-105 transition duration-500" 
              />
            </div>
          ))}
        </div>

        {/* Show all photos button */}
        <button 
          onClick={() => { setCurrentIndex(0); setShowModal(true); }}
          className="absolute bottom-6 right-6 bg-white border border-[#2B2B2B] px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-md hover:bg-gray-50 transition active:scale-95 z-10"
        >
          <Grid size={16} />
          Show all photos
        </button>
      </div>

      {/* Full Screen Lightbox Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-in fade-in duration-200">
          {/* Header */}
          <div className="w-full px-6 py-4 flex justify-between items-center text-white z-10">
            <button onClick={() => setShowModal(false)} className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-md transition">
              <X size={24} /> Close
            </button>
            <div className="font-semibold text-sm">
              {currentIndex + 1} / {displayImages.length}
            </div>
          </div>

          {/* Lightbox Image */}
          <div className="flex-1 relative flex items-center justify-center p-4 md:p-12">
            <button onClick={prevImage} className="absolute left-4 md:left-12 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition z-10">
              <ChevronLeft size={32} />
            </button>

            <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
              <Image 
                src={displayImages[currentIndex]} 
                alt={`Property image ${currentIndex + 1}`} 
                fill
                className="object-contain"
              />
            </div>

            <button onClick={nextImage} className="absolute right-4 md:right-12 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition z-10">
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        property={property} 
      />
    </div>
  );
}
