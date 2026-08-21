"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Clock, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ServiceCard({ service }) {
  const fallbackImage = "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9de?auto=format&fit=crop&w=800&q=80";
  const [imgSrc, setImgSrc] = useState(service.image || fallbackImage);

  return (
    <Link href={`/services/${service.slug}`} className="block group">
      <motion.div
        className="relative flex flex-col gap-4 p-4 rounded-3xl border border-transparent hover:border-border hover:shadow-xl hover:bg-white transition-all duration-300"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-secondary">
          <Image
            src={imgSrc}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc(fallbackImage)}
          />

          {/* Wishlist Button */}
          <button className="absolute top-3 right-3 z-10 p-2 text-white hover:scale-110 transition-transform bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/40">
            <Heart className="w-5 h-5 stroke-[2px]" />
          </button>

          {/* Badge */}
          {service.badge && (
            <div className="absolute top-3 left-3 z-10 bg-primary text-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              {service.badge}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-semibold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
              {service.title}
            </h3>
            {service.rating && (
              <div className="flex items-center gap-1 text-sm font-medium shrink-0 bg-secondary px-2 py-1 rounded-md">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span>{service.rating}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium border border-green-100">
              <Home className="w-3 h-3" />
              {service.location}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {service.duration}
            </div>
          </div>

          <div className="mt-2 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-muted mb-0.5">{service.availability}</div>
              <div className="font-semibold text-foreground">
                From ₹{service.price.toLocaleString("en-IN")}
              </div>
            </div>

            <button className="text-sm font-semibold text-primary hover:text-primary-hover transition border border-primary px-4 py-1.5 rounded-full group-hover:bg-primary group-hover:text-white">
              View details
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
