"use client";

import { useState } from "react";
import {
  Wifi,
  Tv,
  Coffee,
  Wind,
  Car,
  Waves,
  Droplets,
  Flame,
  ShieldAlert,
  Dumbbell,
  Flower2,
  WashingMachine,
  Microwave,
  ArrowUpDown,
  Briefcase,
  HeartPulse,
  CheckCircle2,
  Home,
  Utensils,
} from "lucide-react";
import PropertyModal from "./PropertyModal";

export default function AmenitiesGrid({ amenities = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!amenities || amenities.length === 0) return null;

  // Icon mapper based on amenity string matching
  const getIcon = (amenity) => {
    const name = typeof amenity === "string" ? amenity : amenity.name || "";
    const lower = name.toLowerCase();

    if (lower.includes("wifi") || lower.includes("internet"))
      return <Wifi size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("tv") || lower.includes("television"))
      return <Tv size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("kitchen") || lower.includes("cooking"))
      return <Utensils size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("coffee"))
      return <Coffee size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("air") || lower.includes("ac") || lower.includes("cooling"))
      return <Wind size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("heat"))
      return <Flame size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("park") || lower.includes("car") || lower.includes("garage"))
      return <Car size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("pool") || lower.includes("swim"))
      return <Waves size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("hot water") || lower.includes("water") || lower.includes("shower") || lower.includes("bath"))
      return <Droplets size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("wash") || lower.includes("dry") || lower.includes("laundry"))
      return <WashingMachine size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("gym") || lower.includes("fitness"))
      return <Dumbbell size={24} strokeWidth={1.5} className="text-foreground" />;
    if (
      lower.includes("garden") ||
      lower.includes("balcony") ||
      lower.includes("patio") ||
      lower.includes("outdoor")
    )
      return <Flower2 size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("workspace") || lower.includes("desk") || lower.includes("office"))
      return <Briefcase size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("first aid") || lower.includes("medical"))
      return <HeartPulse size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("fire") || lower.includes("smoke") || lower.includes("alarm") || lower.includes("extinguisher"))
      return <ShieldAlert size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("microwave"))
      return <Microwave size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("lift") || lower.includes("elevator"))
      return <ArrowUpDown size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("fridge") || lower.includes("refrigerator"))
      return <Home size={24} strokeWidth={1.5} className="text-foreground" />;

    return <CheckCircle2 size={24} strokeWidth={1.5} className="text-foreground" />;
  };

  // Display the first 10 amenities on the property page
  const visibleAmenities = amenities.slice(0, 10);
  const hasMore = amenities.length > 10;

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-[22px] font-bold text-foreground mb-6">Popular amenities</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
        {visibleAmenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center gap-4">
            {getIcon(amenity)}
            <span className="text-foreground text-[15px]">
              {typeof amenity === "string" ? amenity : amenity.name}
            </span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setIsOpen(true)}
          className="mt-8 border border-foreground text-foreground bg-white hover:bg-gray-50 active:scale-98 font-semibold py-2.5 px-6 rounded-lg transition duration-150"
        >
          See all {amenities.length} amenities
        </button>
      )}

      {/* Full Amenities Modal */}
      <PropertyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="What this place offers"
      >
        <div className="py-2">
          <p className="text-sm text-gray-500 mb-6">
            All {amenities.length} amenities available at this property
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            {amenities.map((amenity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
              >
                <div className="shrink-0">{getIcon(amenity)}</div>
                <span className="text-foreground text-[16px]">
                  {typeof amenity === "string" ? amenity : amenity.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </PropertyModal>
    </div>
  );
}
