"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Wifi, Car, Key, Tv, Wind, Waves, Coffee, Bath, Dog, Fan, X } from "lucide-react";

// Helper to map amenity names to icons
const getAmenityDetails = (name) => {
  switch (name) {
    case "Wifi": return { icon: <Wifi size={24} strokeWidth={1.5} />, label: "Fast wifi" };
    case "Free parking": return { icon: <Car size={24} strokeWidth={1.5} />, label: "Free parking on premises" };
    case "Self check-in": return { icon: <Key size={24} strokeWidth={1.5} />, label: "Self check-in" };
    case "TV": return { icon: <Tv size={24} strokeWidth={1.5} />, label: "TV with standard cable" };
    case "Air conditioning": return { icon: <Wind size={24} strokeWidth={1.5} />, label: "Air conditioning" };
    case "Kitchen": return { icon: <Coffee size={24} strokeWidth={1.5} />, label: "Kitchen" };
    case "1+ bathrooms": return { icon: <Bath size={24} strokeWidth={1.5} />, label: "1+ bathrooms" };
    case "Washing machine": return { icon: <Fan size={24} strokeWidth={1.5} />, label: "Washing machine" };
    case "Allows pets": return { icon: <Dog size={24} strokeWidth={1.5} />, label: "Allows pets" };
    default: return { icon: <Wifi size={24} strokeWidth={1.5} />, label: name };
  }
};

export default function RoomDetails({ 
  hostName = "Stayr Host", 
  guests = 2, 
  bedrooms = 1, 
  beds = 1, 
  baths = 1,
  amenities = [],
  description = "Experience true luxury in this beautifully designed space. Featuring modern amenities, stunning views, and an unbeatable location, this is the perfect getaway for your next trip. Relax in the spacious living area, cook a gourmet meal in the fully equipped kitchen, or unwind on the private balcony."
}) {
  const displayAmenities = (amenities || []).map(getAmenityDetails);
  const [showAmenities, setShowAmenities] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showAmenities) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [showAmenities]);

  return (
    <div className="flex flex-col w-full text-foreground">
      
      {/* Title & basic info */}
      <div className="pb-6 border-b border-border">
        <h2 className="text-[22px] font-semibold mb-1">
          Entire rental unit hosted by {hostName}
        </h2>
        <div className="flex flex-row items-center gap-1 text-[15px] text-foreground">
          <span>{guests} guests</span>
          <span>·</span>
          <span>{bedrooms} bedroom{bedrooms > 1 ? 's' : ''}</span>
          <span>·</span>
          <span>{beds} bed{beds > 1 ? 's' : ''}</span>
          <span>·</span>
          <span>{baths} bath{baths > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Host Profile Ribbon */}
      <div className="py-6 border-b border-border flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative border border-gray-300">
           {/* Fallback avatar */}
           <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" alt={hostName} fill className="object-cover" />
        </div>
        <div>
          <div className="font-semibold text-[16px]">Hosted by {hostName}</div>
          <div className="text-[14px] text-muted">Host</div>
        </div>
      </div>



      {/* Description */}
      <div className="py-6 border-b border-border">
        <div className="text-[16px] leading-relaxed mb-4 text-foreground">
          {description}
        </div>
        <button className="font-semibold underline flex items-center gap-1 hover:text-black">
          Show more <span className="text-xl leading-none">›</span>
        </button>
      </div>

      {/* Amenities */}
      <div className="py-6">
        <h2 className="text-[22px] font-semibold mb-6">What this place offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {displayAmenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-4 text-foreground">
              {amenity.icon}
              <span className="text-[16px]">{amenity.label}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setShowAmenities(true)}
          className="mt-8 border border-foreground px-6 py-3 rounded-lg font-semibold text-[16px] hover:bg-gray-50 transition active:scale-95"
        >
          Show all amenities
        </button>
      </div>

      {/* Amenities Modal */}
      {showAmenities && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold">What this place offers</h3>
              <button 
                onClick={() => setShowAmenities(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-8 overflow-y-auto">
              <div className="flex flex-col gap-6">
                {displayAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-4 text-foreground pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="text-gray-700">{amenity.icon}</div>
                    <span className="text-[17px] font-medium">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
