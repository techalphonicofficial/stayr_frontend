"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1599661559929-23d24263b652?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1596522354195-e84ae3c98731?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1585506942812-e72b29cef752?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1621214040941-026859336d3f?auto=format&fit=crop&w=800&q=80"
];

export default function ListingCard({ id, image, title, price, originalPrice, discountText, nights, rating, reviewCount, topReview, guestFavourite = true }) {
  const router = useRouter();
  const wishlist = useWishlist();
  
  // Safe fallback if not wrapped in provider
  const isSaved = wishlist?.savedPropertyIds?.has(id) || false;

  // Stable random selection based on ID
  const stringId = String(id || "");
  const imageIndex = stringId.length > 0 ? stringId.charCodeAt(stringId.length - 1) % FALLBACK_IMAGES.length : 0;
  const fallbackImage = FALLBACK_IMAGES[imageIndex];

  const [imgSrc, setImgSrc] = useState(image || fallbackImage);

  const handleHeartClick = async (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    if (!wishlist) return;

    try {
      await wishlist.toggleSavedProperty(id);
    } catch (error) {
      if (error.message.includes("401") || error.message.toLowerCase().includes("unauthorized")) {
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      } else {
        alert(error.message || "Failed to save property");
      }
    }
  };

  return (
    <Link href={`/property/${id}`} className="flex flex-col gap-3 w-full cursor-pointer group">
      {/* Image Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-200">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc(fallbackImage)}
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {guestFavourite ? (
            <div className="bg-white/95 backdrop-blur-sm px-3 h-7 rounded-full shadow-sm inline-flex items-center justify-center">
              <span className="text-[13px] font-semibold text-[#2B2B2B] whitespace-nowrap leading-none">Guest favourite</span>
            </div>
          ) : (
            <div></div> // Spacer
          )}

          <button 
            onClick={handleHeartClick}
            className="text-white drop-shadow-md hover:scale-110 transition z-10"
          >
            <Heart size={24} strokeWidth={2} className={isSaved ? "fill-[#FF385C] text-[#FF385C]" : ""} />
          </button>
        </div>

        {/* Deal Badge */}
        {discountText && (
          <div className="absolute bottom-3 left-3 bg-[#E8B65B] text-[#2B2B2B] px-3 py-1 rounded-md shadow-md">
            <span className="text-[12px] font-bold">{discountText}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <h3 className="font-semibold text-[#2B2B2B] text-[15px] truncate">
          {title}
        </h3>
        <p className="text-[#7B7468] text-[14px]">
          {originalPrice && <span className="line-through mr-1 text-gray-400">{originalPrice}</span>}
          <span className={originalPrice ? "font-bold text-[#2B2B2B]" : ""}>{price}</span>
          {" "}for {nights} nights • ★ {rating} {reviewCount ? `(${reviewCount})` : ''}
        </p>
        {topReview && (
          <p className="text-[#7B7468] text-[13px] mt-1 line-clamp-1 italic text-ellipsis overflow-hidden">
            "{typeof topReview === 'string' ? topReview : topReview.comment}"
          </p>
        )}
      </div>
    </Link>
  );
}
