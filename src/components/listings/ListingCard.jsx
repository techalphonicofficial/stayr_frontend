"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
      
      // If it wasn't saved before this click, it means we just added it.
      if (!isSaved) {
        toast.success("Added to wish list");
      } else {
        toast.success("Removed from wish list", {
          iconTheme: {
            primary: '#7B7468',
            secondary: '#2B2B2B',
          },
        });
      }
    } catch (error) {
      if (error.message.includes("401") || error.message.toLowerCase().includes("unauthorized")) {
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
      } else {
        toast.error(error.message || "Failed to save property");
      }
    }
  };

  return (
    <Link href={`/property/${id}?title=${encodeURIComponent(title)}`} className="block w-full cursor-pointer h-full">
      <motion.div 
        className="flex flex-col gap-3 w-full h-full p-2 rounded-2xl transition-colors group"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-200 shadow-sm group-hover:shadow-[0_10px_40px_rgba(232,182,91,0.25)] group-hover:border group-hover:border-primary/30 transition-all duration-300">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc(fallbackImage)}
          />

          {/* Subtle shine effect on hover */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full z-0 pointer-events-none"
            whileHover={{ translateX: ["-100%", "200%"] }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Overlay Badges */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
            {guestFavourite ? (
              <div className="bg-white/95 backdrop-blur-sm px-2 h-6 rounded-full shadow-sm inline-flex items-center justify-center overflow-hidden max-w-[70%]">
                <span className="text-[11px] font-bold text-foreground whitespace-nowrap leading-none truncate">Guest favourite</span>
              </div>
            ) : (
              <div></div> // Spacer
            )}

            <button 
              onClick={handleHeartClick}
              className="text-white drop-shadow-md hover:scale-110 transition z-20 flex-shrink-0 p-1"
            >
              <Heart size={22} strokeWidth={2} className={isSaved ? "fill-[#FF385C] text-[#FF385C]" : ""} />
            </button>
          </div>

          {/* Deal Badge */}
          {discountText && (
            <div className="absolute bottom-3 left-3 bg-primary text-foreground px-3 py-1 rounded-md shadow-md z-10">
              <span className="text-[12px] font-bold">{discountText}</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col px-1">
          <h3 className="font-semibold text-foreground text-[15px] truncate group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted text-[14px]">
            {originalPrice && <span className="line-through mr-1 text-gray-400">{originalPrice}</span>}
            <span className={originalPrice ? "font-bold text-foreground" : ""}>{price}</span>
            {" "}for {nights} nights • ★ {rating} {reviewCount ? `(${reviewCount})` : ''}
          </p>
          {topReview && (
            <p className="text-muted text-[13px] mt-1 line-clamp-1 italic text-ellipsis overflow-hidden">
              "{typeof topReview === 'string' ? topReview : topReview.comment}"
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
