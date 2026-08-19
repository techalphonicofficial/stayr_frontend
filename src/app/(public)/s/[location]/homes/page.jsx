"use client";

import Navbar from "@/components/navbar/Navbar";
import FilterBar from "@/components/listings/FilterBar";
import ListingCard from "@/components/listings/ListingCard";
import Container from "@/components/common/Container";

import { use, useState, useEffect } from "react";
import { propertyApi } from "@/lib/api";

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


  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProps = async () => {
      try {
        // Use 'search' instead of 'city' to allow partial matches (e.g. 'Delhi' matches 'New Delhi')
        const json = await propertyApi.getProperties({ search: locationParam });
        if (json && json.success) {
          if (json.data.length === 0) {
            const allJson = await propertyApi.getProperties();
            setProperties(allJson?.data || []);
          } else {
            setProperties(json.data);
          }
        } else if (json && Array.isArray(json)) {
            if (json.length === 0) {
               const allJson = await propertyApi.getProperties();
               setProperties(Array.isArray(allJson) ? allJson : (allJson?.data || []));
            } else {
                setProperties(json);
            }
        }
      } catch (err) {
        console.error("Failed to fetch search properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, [locationParam]);

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
  const displayListings = properties.filter(listing => {
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
              <span className="text-[14px] text-[#2B2B2B]">Over {properties.length} homes</span>
              <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Listings Grid (Cards only, no map, fully responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {loading ? (
            <div className="col-span-full py-10 text-center text-gray-500">Loading properties...</div>
          ) : displayListings.map((listing) => (
            <ListingCard 
              key={listing.id} 
              id={listing.id} 
              title={listing.title}
              price={"₹" + (listing.pricePerNight || 0).toLocaleString("en-IN")}
              image={listing.images?.[0]?.url || listing.featuredImage || "https://via.placeholder.com/400"}
              nights={3}
              rating={listing.averageRating ? listing.averageRating.toFixed(2) : 4.9}
              reviewCount={listing.totalReviews}
              topReview={listing.reviews?.[0]}
            />
          ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
