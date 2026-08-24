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
        // Fetch properties (first try with search param)
        const json = await propertyApi.getProperties({ search: locationParam });
        let fetchedListings = [];
        
        if (json && json.success) {
          fetchedListings = json.data;
        } else if (json && Array.isArray(json)) {
          fetchedListings = json;
        }

        // If the DB doesn't have enough matching properties, fetch baseline dummy data
        if (fetchedListings.length < 8) {
           const fallbackJson = await propertyApi.getProperties({ limit: 15 });
           let fallbackListings = [];
           if (fallbackJson && fallbackJson.success) fallbackListings = fallbackJson.data;
           else if (fallbackJson && Array.isArray(fallbackJson)) fallbackListings = fallbackJson;
           
           // Duplicate if needed to fill the page
           if (fallbackListings.length > 0) {
             const duplicated = [];
             while (duplicated.length < 15) {
               duplicated.push(...fallbackListings);
             }
             fetchedListings = duplicated.slice(0, 15);
           }
        }

        // Tailor the properties to match the requested location perfectly
        const tailoredListings = fetchedListings.map((listing, index) => {
           const categories = ["Premium Apartment", "Luxury Villa", "Cozy Studio", "Modern Loft", "Spacious Penthouse", "Boutique Hotel"];
           const category = categories[index % categories.length];
           
           // Inject dynamic amenities so the filter bar works realistically for the demo
           const allDemoAmenities = [ "Free parking", "Self check-in", "Wifi", "Air conditioning", "TV", "Kitchen", "Washing machine", "Allows pets" ];
           // Base amenities everyone gets, plus a pseudo-random subset based on index
           const dynamicAmenities = allDemoAmenities
             .filter((_, i) => i < 3 || (index + i) % 2 === 0)
             .map(name => ({ name }));
           
           return {
             ...listing,
             amenities: dynamicAmenities,
             bathrooms: listing.bathrooms || 2,
             uniqueKey: `${listing.id}-${locationParam}-${index}`, // Safe React key
             title: isCategory ? listing.title : `${category} in ${displayName}`
           };
        });

        setProperties(tailoredListings);
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

  const displayListings = properties.filter(listing => {
    if (activeFilters.length === 0) return true;
    
    return activeFilters.every(f => {
      if (f === "1+ bathrooms") {
        return listing.bathrooms >= 1;
      }
      if (!listing.amenities || !Array.isArray(listing.amenities)) return false;
      return listing.amenities.some(a => a.name.toLowerCase() === f.toLowerCase());
    });
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Navbar (Compact Mode) */}
      <Navbar forceCompact={true} flat={true} />

      {/* Main Content Area starting below Navbar */}
      <div className="pt-[150px] md:pt-[80px]">
        {/* Sticky Filter Bar */}
        <FilterBar activeFilters={activeFilters} onToggleFilter={toggleFilter} />

        <Container>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mt-8 mb-6 gap-4">
            <h1 className="text-2xl font-bold text-foreground">
              {locationParam.toLowerCase() === 'monsoon'
                ? "Monsoon stays for less"
                : isCategory
                  ? `${displayName} properties`
                  : `Over 1,000 homes in ${displayName}`
              }
            </h1>

            {/* Toggle Switch Placeholder */}
            <div className="flex items-center gap-3 bg-white border border-border rounded-full px-4 py-2 shadow-sm w-fit">
              <span className="text-[14px] text-foreground">Over {properties.length} homes</span>
              <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Listings Grid (Cards only, no map, fully responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {loading ? (
              <div className="col-span-full py-10 text-center text-gray-500">Loading properties...</div>
            ) : displayListings.map((listing, index) => (
              <ListingCard
                key={listing.uniqueKey || `${listing.id}-${index}`}
                id={listing.id}
                title={listing.title}
                price={"₹" + (listing.pricePerNight || 0).toLocaleString("en-IN")}
                image={listing.featuredImage || listing.images?.[0]?.url || ""}
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
