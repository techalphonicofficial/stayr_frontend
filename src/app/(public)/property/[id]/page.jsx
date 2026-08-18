"use client";

import { use, useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import { notFound } from "next/navigation";

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

export default function PropertyPage({ params }) {
  const unwrappedParams = use(params);
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/properties/${unwrappedParams.id}`);
        if (res.ok) {
          const json = await res.json();
          setPropertyData(json.data);
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
  const imagesForGallery = propertyData.images?.map(img => img.url) || 
                           (propertyData.featuredImage ? [propertyData.featuredImage] : []);
                           
  const taxRate = propertyData.bookingSettings?.taxRate || 0.18; // Default 18% tax
  
  const houseRules = propertyData.houseRules || [];
  const importantInfo = propertyData.importantInformation || [];
  const cancellation = propertyData.cancellationPolicy || { fullRefundDays: 14, partialRefundDays: 7 };
  const aboutProperty = propertyData.aboutProperty || {};
  
  const locationString = [propertyData.city, propertyData.state, propertyData.country].filter(Boolean).join(", ");

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
                price={propertyData.pricePerNight} 
                guests={propertyData.maxGuests}
                rating={propertyData.averageRating}
                reviewCount={propertyData.totalReviews}
                taxRate={taxRate}
              />
            }
          >
            {/* Header / Basic Info */}
            <PropertyHeader property={propertyData} />

            {/* Popular Amenities */}
            <AmenitiesGrid amenities={propertyData.amenities} />

            {/* Explore the area */}
            <ExploreArea location={locationString} nearbyPlaces={propertyData.nearbyPlaces} />

            {/* Rooms and Beds */}
            <RoomsAndBeds 
              rooms={propertyData.roomsAndBeds?.bedrooms || []} 
              bedrooms={propertyData.bedrooms} 
              guests={propertyData.maxGuests} 
            />

            {/* Bathrooms */}
            <BathroomsSection 
              bathroomsList={propertyData.roomsAndBeds?.bathrooms || []} 
              bathroomsCount={propertyData.bathrooms} 
            />

            {/* Spaces */}
            <SpacesSection 
              spaces={propertyData.roomsAndBeds?.spaces || []} 
              property={propertyData}
            />

            {/* About this property */}
            <AboutProperty 
              title={aboutProperty.title || propertyData.title} 
              description={aboutProperty.description || propertyData.description} 
            />

            {/* About the host */}
            <HostSection host={propertyData.host} />

            {/* Reviews */}
            <ReviewsSection 
              rating={propertyData.averageRating} 
              reviewCount={propertyData.totalReviews} 
              reviews={propertyData.reviews || []} 
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
