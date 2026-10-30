"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, CheckCircle2, ShieldCheck, MapPin, Bed, Bath, Maximize2, Compass } from "lucide-react";
import { formatIndianPrice, calculatePricePerSqFt, formatArea } from "./formatters";
import { salePropertyApi } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function SaleListingCard({ listing, onSaveToggle, isSavedInitially = false }) {
  const [isSaved, setIsSaved] = useState(isSavedInitially);
  const [isSaving, setIsSaving] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  if (!listing) return null;

  const images = listing.images && listing.images.length > 0
    ? listing.images.map((img) => (typeof img === 'string' ? img : img.url))
    : listing.featuredImage
    ? [listing.featuredImage]
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'];

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaving) return;
    setIsSaving(true);
    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    try {
      const res = await salePropertyApi.toggleSave(listing.id);
      if (res && res.saved !== undefined) {
        setIsSaved(res.saved);
        toast.success(res.saved ? "Saved to favorites" : "Removed from favorites");
      }
      if (onSaveToggle) onSaveToggle(listing.id, nextSavedState);
    } catch (err) {
      setIsSaved(!nextSavedState);
      toast.error(err.message || "Please sign in to save properties");
    } finally {
      setIsSaving(false);
    }
  };

  const pricePerSqFt = listing.pricePerSqFt
    ? `₹${Number(listing.pricePerSqFt).toLocaleString('en-IN')}/sq ft`
    : calculatePricePerSqFt(listing.price, listing.area);

  const detailUrl = `/buy/${listing.slug || listing.id}`;

  return (
    <div className="group relative bg-white rounded-3xl border border-gray-100/80 hover:border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Top Image Media Container */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-100">
        <Link href={detailUrl} className="block w-full h-full">
          <img
            src={images[imgIndex]}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Gradient Overlay for badges & heart */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {listing.category && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm backdrop-blur-md bg-white/95 text-gray-800">
              {listing.category}
            </span>
          )}
          {listing.isVerified && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1 shadow-sm backdrop-blur-md bg-emerald-600/90 text-white">
              <CheckCircle2 size={12} strokeWidth={2.5} />
              Verified
            </span>
          )}
          {listing.reraNumber && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider shadow-sm backdrop-blur-md bg-blue-600/85 text-white">
              RERA
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={isSaved ? "Remove from saved" : "Save property"}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110 active:scale-95 z-10"
        >
          <Heart
            size={18}
            className={isSaved ? "fill-[#FF385C] text-[#FF385C]" : "text-gray-700 hover:text-black"}
          />
        </button>

        {/* Bottom Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {images.slice(0, 5).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  imgIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Price & Price/SqFt */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                {formatIndianPrice(listing.price)}
              </span>
              {listing.priceNegotiable && (
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Negotiable
                </span>
              )}
            </div>
            {pricePerSqFt && (
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                {pricePerSqFt}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={detailUrl} className="block group-hover:text-[#FF385C] transition-colors">
            <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-1 mb-1">
              {listing.title}
            </h3>
          </Link>

          {/* Location */}
          <p className="text-xs text-gray-500 flex items-center gap-1 mb-3 line-clamp-1">
            <MapPin size={13} className="text-gray-400 shrink-0" />
            <span>
              {listing.locality ? `${listing.locality}, ` : ''}{listing.city}, {listing.state}
            </span>
          </p>

          {/* Property Key Specs Badges */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-gray-50/80 rounded-2xl mb-3 text-center border border-gray-100">
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400">Type</span>
              <span className="font-bold text-gray-800 text-xs truncate block">
                {listing.bhk || listing.propertyType || 'Property'}
              </span>
            </div>
            <div className="border-x border-gray-200/70">
              <span className="block text-[10px] uppercase font-bold text-gray-400">Area</span>
              <span className="font-bold text-gray-800 text-xs truncate block">
                {formatArea(listing.area, listing.areaUnit)}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400">Status</span>
              <span className="font-bold text-gray-800 text-xs truncate block">
                {listing.possessionStatus || 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Action Button */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-gray-100">
          <div className="text-[11px] text-gray-400">
            Listed by <span className="font-semibold text-gray-700">{listing.sellerType || 'Verified Seller'}</span>
          </div>

          <Link
            href={detailUrl}
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold bg-[#FF385C] hover:bg-[#E00B41] text-white transition-colors duration-200 shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

