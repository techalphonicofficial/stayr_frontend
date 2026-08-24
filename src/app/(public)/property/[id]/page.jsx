"use client";

import { use, useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import { notFound } from "next/navigation";
import { propertyApi } from "@/lib/api";

// Import all our new components
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyHeader from "@/components/property/PropertyHeader";
import AmenitiesGrid from "@/components/property/AmenitiesGrid";
import ExploreArea from "@/components/property/ExploreArea";
import RoomsAndBeds from "@/components/property/RoomsAndBeds";
import BathroomsSection from "@/components/property/BathroomsSection";
import SpacesSection from "@/components/property/SpacesSection";
import AboutProperty from "@/components/property/AboutProperty";
import HostSection from "@/components/property/HostSection";
import ReviewsSection from "@/components/property/ReviewsSection";
import Policies from "@/components/property/Policies";
import BookingCard from "@/components/property/BookingCard";
import PropertyDetailLayout from "@/components/property/PropertyDetailLayout";

export default function PropertyPage({ params, searchParams }) {
  const unwrappedParams = use(params);
  const unwrappedSearch = use(searchParams);
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const json = await propertyApi.getPropertyById(unwrappedParams.id);
        if (json && json.success) {
          setPropertyData(json.data);
        } else if (json && json.id) {
           setPropertyData(json);
        } else {
          setPropertyData(null);
        }
      } catch (err) {
        console.error("Failed to fetch property:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-24 pt-[100px] flex justify-center items-center">
        <p className="text-gray-500">Loading property details...</p>
      </div>
    );
  }

  if (!propertyData) {
    notFound();
  }

  // Safe mapping of dynamic JSON fields
  const imagesForGallery = propertyData.images?.length > 0 
    ? propertyData.images.map(img => img.url) 
    : (propertyData.featuredImage ? [propertyData.featuredImage] : []);
                           
  const taxRate = propertyData.bookingSettings?.taxRate || 0; 
  
  const houseRules = propertyData.houseRules?.length > 0 ? propertyData.houseRules : [
    "Check-in after 2:00 PM", 
    "Checkout before 11:00 AM", 
    "No smoking", 
    "No parties or events"
  ];
  
  const importantInfo = propertyData.importantInformation?.length > 0 ? propertyData.importantInformation : [
    "Extra charges may apply depending on the number of guests.", 
    "Government-issued photo identification and a credit card may be required at check-in for incidental charges."
  ];
  
  const cancellation = propertyData.cancellationPolicy || {
    policy: "Partial refund",
    description: "If you cancel your reservation before Aug 14 at 11:59pm you'll get a refund of 50% of the amount."
  };
  
  const aboutProperty = propertyData.aboutProperty || {};
  
  // Use overridden title from URL if provided by a dummy card
  const overriddenTitle = unwrappedSearch?.title;
  let overriddenLocation = null;
  if (overriddenTitle && overriddenTitle.includes(" in ")) {
    overriddenLocation = overriddenTitle.split(" in ")[1];
  }
  
  const finalTitle = overriddenTitle || propertyData.title;
  const locationString = overriddenLocation || [propertyData.city, propertyData.state, propertyData.country].filter(Boolean).join(", ");
  
  // Fallbacks for missing DB schema data
  const fallbackRooms = [
    { name: "Bedroom 1", beds: ["1 King bed"] },
    { name: "Bedroom 2", beds: ["1 Queen bed"] },
    { name: "Bedroom 3", beds: ["2 Single beds"] }
  ];
  const fallbackBathrooms = [
    { name: "Bathroom 1", amenities: ["Towels provided", "Bathtub or shower", "Toilet"] },
    { name: "Bathroom 2", amenities: ["Towels provided", "Bathtub or shower", "Toilet"] }
  ];
  const fallbackSpaces = [
    { name: "Kitchen", icon: "Utensils" },
    { name: "Dining area", icon: "UtensilsCrossed" },
    { name: "Living room", icon: "Sofa" },
    { name: "Balcony", icon: "Wind" }
  ];
  const fallbackReviews = [
    {
      rating: 5,
      text: "Absolutely stunning property! The views were incredible and the space was spotless. We had a wonderful family vacation here and would highly recommend it to anyone looking for a relaxing getaway.",
      author: "Sarah Jenkins",
      date: "August 2023",
      images: [],
      avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      rating: 4.5,
      text: "Great location and very comfortable beds. The kitchen was well stocked with everything we needed to cook meals. Only minor issue was the wifi was a bit slow in the evenings.",
      author: "Michael Chang",
      date: "July 2023",
      images: [],
      avatar: "https://i.pravatar.cc/150?u=michael"
    },
    {
      rating: 5,
      text: "Host was extremely communicative and helpful. The property is even more beautiful in person than in the photos. We spent most of our time out on the patio enjoying the breeze.",
      author: "Emma Rodriguez",
      date: "June 2023",
      images: [],
      avatar: "https://i.pravatar.cc/150?u=emma"
    }
  ];
  
  const activeRooms = propertyData.roomsAndBeds?.bedrooms?.length > 0 ? propertyData.roomsAndBeds.bedrooms : fallbackRooms;
  const activeBathrooms = propertyData.roomsAndBeds?.bathrooms?.length > 0 ? propertyData.roomsAndBeds.bathrooms : fallbackBathrooms;
  const activeSpaces = propertyData.roomsAndBeds?.spaces?.length > 0 ? propertyData.roomsAndBeds.spaces : fallbackSpaces;
  
  const activeReviews = propertyData.reviews?.length > 0 
    ? propertyData.reviews.map(r => ({
        rating: r.rating,
        text: r.comment,
        author: r.guest?.name || 'Anonymous',
        date: new Date(r.createdAt).toLocaleDateString(),
        images: r.images || [],
        avatar: r.guest?.profileImage || null
      }))
    : fallbackReviews;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Sticky Navbar */}
      <Navbar forceCompact={true} />

      <main className="pt-[100px] md:pt-[120px]">
        <Container>
          
          {/* Gallery is full width on mobile, constrained by container on desktop */}
          <PropertyGallery images={imagesForGallery} property={propertyData} />

          {/* Main layout: left content, right sticky booking card */}
          <PropertyDetailLayout 
            sidebar={
              <BookingCard 
                property={propertyData}
                taxRate={taxRate}
              />
            }
          >
            {/* Header / Basic Info */}
            <PropertyHeader property={{ ...propertyData, title: finalTitle }} />

            {/* Popular Amenities */}
            <AmenitiesGrid amenities={propertyData.amenities} />

            {/* Explore the area */}
            <ExploreArea location={locationString} nearbyPlaces={propertyData.nearbyPlaces} />

            {/* Rooms and Beds */}
            <RoomsAndBeds 
              rooms={activeRooms} 
              bedrooms={propertyData.bedrooms || 3} 
              guests={propertyData.maxGuests || 6} 
            />

            {/* Bathrooms */}
            <BathroomsSection 
              bathroomsList={activeBathrooms} 
              bathroomsCount={propertyData.bathrooms || 2} 
            />

            {/* Spaces */}
            <SpacesSection 
              spaces={activeSpaces} 
              property={{...propertyData, roomsAndBeds: { bedrooms: activeRooms, bathrooms: activeBathrooms }}}
            />

            {/* About this property */}
            <AboutProperty 
              title={aboutProperty.title || finalTitle} 
              description={aboutProperty.description || propertyData.description} 
            />

            {/* About the host */}
            <HostSection host={propertyData.host} />

            {/* Reviews */}
            <ReviewsSection 
              rating={propertyData.averageRating || 4.8} 
              reviewCount={propertyData.totalReviews || 120} 
              reviews={activeReviews} 
            />

            {/* Policies: Rules, Damage, Cancel, Important Info */}
            <Policies 
              houseRules={houseRules} 
              importantInfo={importantInfo} 
              cancellation={cancellation}
              damagePolicy={propertyData.damagePolicy}
            />
            
          </PropertyDetailLayout>

        </Container>
      </main>
    </div>
  );
}
