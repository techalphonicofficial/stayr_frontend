import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function ListingCard({ id, image, title, price, originalPrice, discountText, nights, rating, guestFavourite = true }) {
  return (
    <Link href={`/rooms/${id || 1}`} className="flex flex-col gap-3 w-full cursor-pointer group">
      {/* Image Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-200">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          
          <button className="text-white drop-shadow-md hover:scale-110 transition">
            <Heart size={24} strokeWidth={2} />
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
          {" "}for {nights} nights • ★ {rating}
        </p>
      </div>
    </Link>
  );
}
