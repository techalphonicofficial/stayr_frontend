"use client";

import { useState } from "react";
import { Grid, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function PropertySaleGallery({ images = [], title = "Property" }) {
  const [showAllModal, setShowAllModal] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const imgUrls = images.length > 0
    ? images.map((img) => (typeof img === "string" ? img : img.url))
    : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"];

  const openModal = (idx = 0) => {
    setActiveIdx(idx);
    setShowAllModal(true);
  };

  return (
    <div className="relative mb-8">
      {/* 5-Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3 rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] max-h-[520px]">
        {/* Main Cover Image (2 cols) */}
        <div
          onClick={() => openModal(0)}
          className="relative md:col-span-2 h-full cursor-pointer overflow-hidden group bg-gray-100"
        >
          <img
            src={imgUrls[0]}
            alt={`${title} - Photo 1`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Next 2 Images (Col 3) */}
        <div className="hidden md:grid grid-rows-2 gap-2 sm:gap-3 h-full">
          {[1, 2].map((idx) => (
            <div
              key={idx}
              onClick={() => openModal(idx < imgUrls.length ? idx : 0)}
              className="relative h-full cursor-pointer overflow-hidden group bg-gray-100"
            >
              <img
                src={imgUrls[idx] || imgUrls[0]}
                alt={`${title} - Photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          ))}
        </div>

        {/* Final 2 Images (Col 4) */}
        <div className="hidden md:grid grid-rows-2 gap-2 sm:gap-3 h-full relative">
          {[3, 4].map((idx) => (
            <div
              key={idx}
              onClick={() => openModal(idx < imgUrls.length ? idx : 0)}
              className="relative h-full cursor-pointer overflow-hidden group bg-gray-100"
            >
              <img
                src={imgUrls[idx] || imgUrls[0]}
                alt={`${title} - Photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* "Show All Photos" Floating Button */}
      <button
        onClick={() => openModal(0)}
        className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-gray-900 px-4 py-2 rounded-2xl text-xs font-bold shadow-lg border border-gray-200/80 backdrop-blur-md flex items-center gap-2 transition hover:scale-105 active:scale-95"
      >
        <Grid size={15} />
        <span>Show all {imgUrls.length} photos</span>
      </button>

      {/* Fullscreen Modal Carousel */}
      {showAllModal && (
        <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white max-w-6xl mx-auto w-full pb-4">
            <span className="text-sm font-semibold text-gray-400">
              {activeIdx + 1} / {imgUrls.length}
            </span>
            <button
              onClick={() => setShowAllModal(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Center Image */}
          <div className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full overflow-hidden">
            <img
              src={imgUrls[activeIdx]}
              alt={`${title} - Image ${activeIdx + 1}`}
              className="max-h-[78vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {/* Prev / Next controls */}
            {imgUrls.length > 1 && (
              <>
                <button
                  onClick={() => setActiveIdx((prev) => (prev > 0 ? prev - 1 : imgUrls.length - 1))}
                  className="absolute left-2 sm:left-4 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition hover:scale-110"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => setActiveIdx((prev) => (prev < imgUrls.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 sm:right-4 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition hover:scale-110"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="max-w-6xl mx-auto w-full pt-4 overflow-x-auto flex items-center justify-center gap-2">
            {imgUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                  activeIdx === i ? "border-[#FF385C] scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

