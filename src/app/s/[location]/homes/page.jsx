"use client";

import Navbar from "@/components/navbar/Navbar";
import FilterBar from "@/components/listings/FilterBar";
import ListingCard from "@/components/listings/ListingCard";
import Container from "@/components/common/Container";

import { 
  SEARCH_RESULTS_LISTINGS,
  GOA_LISTINGS,
  DELHI_LISTINGS,
  GURGAON_LISTINGS,
  NOIDA_LISTINGS,
  PERFECT_PLACE_LISTINGS,
  DISCOUNTED_LISTINGS
} from "@/data/listings";

import { use, useState } from "react";

export default function SearchResultsPage({ params }) {
  const unwrappedParams = use(params);
  // Format the location name (e.g. "noida" -> "Noida")
  const locationParam = unwrappedParams?.location || "Noida";
  const locationName = locationParam.charAt(0).toUpperCase() + locationParam.slice(1);

  // Category display names
  const CATEGORY_NAMES = {
    beachfront: "Beachfront",
    pools: "Pools",
    international: "International",
    family: "Family Friendly",
  };

  const isCategory = Object.keys(CATEGORY_NAMES).includes(locationParam.toLowerCase());
  const displayName = isCategory ? CATEGORY_NAMES[locationParam.toLowerCase()] : locationName;

  // Get relevant listings based on location
  const getListings = () => {
    const loc = locationParam.toLowerCase();
    if (loc === 'goa') return GOA_LISTINGS;
    if (loc === 'delhi' || loc === 'new delhi') return DELHI_LISTINGS;
    if (loc === 'gurgaon') return GURGAON_LISTINGS;
    if (loc === 'noida') return NOIDA_LISTINGS;
    if (loc === 'himachal') return PERFECT_PLACE_LISTINGS.family;
    if (loc === 'rajasthan') {
      return [
        { id: 901, title: "Heritage Palace in Jaipur", price: "₹24,500", nights: 2, rating: "4.98", image: "/rajasthan_palace.png", guestFavourite: true },
        ...PERFECT_PLACE_LISTINGS.pools.slice(0, 4)
      ];
    }
    if (loc === 'monsoon') return DISCOUNTED_LISTINGS;
    
    // Category-based routes
    if (loc === 'beachfront') return PERFECT_PLACE_LISTINGS.beachfront;
    if (loc === 'pools') return PERFECT_PLACE_LISTINGS.pools;
    if (loc === 'international') return PERFECT_PLACE_LISTINGS.international;
    if (loc === 'family') return PERFECT_PLACE_LISTINGS.family;

    return SEARCH_RESULTS_LISTINGS;
  };

  const allListingsForLocation = getListings();

  // Filter state
  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilter = (filter) => {
    setActiveFilters((prev) => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Filter listings based on selected amenities
  const displayListings = allListingsForLocation.filter(listing => {
    if (activeFilters.length === 0) return true;
    if (!listing.amenities) return false;
    // Listing must have ALL active filters
    return activeFilters.every(f => listing.amenities.includes(f));
  });

  return (
    <div className="min-h-screen bg-[#FFFDF8] pb-24">
      {/* Sticky Navbar (Compact Mode) */}
      <Navbar forceCompact={true} flat={true} />

      {/* Main Content Area starting below Navbar */}
      <div className="pt-[80px]">
        {/* Sticky Filter Bar */}
        <FilterBar activeFilters={activeFilters} onToggleFilter={toggleFilter} />

        <Container>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mt-8 mb-6 gap-4">
            <h1 className="text-2xl font-bold text-[#2B2B2B]">
              {locationParam.toLowerCase() === 'monsoon' 
                ? "Monsoon stays for less"
                : isCategory
                  ? `${displayName} properties`
                  : `Over 1,000 homes in ${displayName}`
              }
            </h1>
            
            {/* Toggle Switch Placeholder */}
            <div className="flex items-center gap-3 bg-white border border-[#EFE7D8] rounded-full px-4 py-2 shadow-sm w-fit">
              <span className="text-sm font-semibold text-[#2B2B2B]">Prices include all fees</span>
              <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Listings Grid (Cards only, no map, fully responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {displayListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
