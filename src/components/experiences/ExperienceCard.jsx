"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ExperienceCard({ experience }) {
  const fallbackImage = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80";
  const [imgSrc, setImgSrc] = useState(experience.image || fallbackImage);

  return (
    <Link href={`/experiences/${experience.slug}`} className="block group">
      <motion.div 
        className="relative flex flex-col gap-3"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-secondary">
          <Image
            src={imgSrc}
            alt={experience.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc(fallbackImage)}
          />
          
          {/* Wishlist Button */}
          <button className="absolute top-4 right-4 z-10 p-2 text-white hover:scale-110 transition-transform">
            <Heart className="w-6 h-6 stroke-[2px]" />
          </button>

          {/* Badge */}
          {experience.badge && (
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-foreground shadow-sm">
              {experience.badge}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {experience.title}
            </h3>
            <div className="flex items-center gap-1 text-sm font-medium shrink-0 ml-2">
              <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
              <span>{experience.rating}</span>
            </div>
          </div>
          
          <div className="text-muted text-sm line-clamp-1">
            {experience.category} • {experience.location}
          </div>
          <div className="text-muted text-sm line-clamp-1">
            {experience.duration}
          </div>

          <div className="mt-1 flex items-center justify-between">
            <div className="font-semibold text-foreground">
              From ₹{experience.price.toLocaleString("en-IN")} <span className="font-normal text-muted text-sm">/ guest</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
