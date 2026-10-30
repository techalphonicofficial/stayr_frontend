"use client";

import { useState, useEffect, use } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import PropertySaleGallery from "@/components/buy/PropertySaleGallery";
import BuyerContactCard from "@/components/buy/BuyerContactCard";
import SellerProfileSection from "@/components/buy/SellerProfileSection";
import PropertyFinancialsSection from "@/components/buy/PropertyFinancialsSection";
import BuildingCommuteSection from "@/components/buy/BuildingCommuteSection";
import SimilarPropertiesSection from "@/components/buy/SimilarPropertiesSection";
import ContactSellerModal from "@/components/buy/ContactSellerModal";
import RequestCallbackModal from "@/components/buy/RequestCallbackModal";
import ReportListingModal from "@/components/buy/ReportListingModal";
import { formatIndianPrice, formatArea, calculatePricePerSqFt } from "@/components/buy/formatters";
import { salePropertyApi } from "@/lib/api";
import { 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Maximize2, 
  Compass, 
  Calendar, 
  Layers, 
  FileText, 
  Home, 
  Car, 
  Armchair,
  Sparkles,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function BuyerPropertyDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slugOrId = unwrappedParams.slug;

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    if (!slugOrId) return;

    setLoading(true);
    salePropertyApi.getSaleListingBySlug(slugOrId)
      .then((res) => {
        if (res && res.success && res.data) {
          setListing(res.data);
        } else {
          setError("Property not found");
        }
      })
      .catch((err) => {
        console.error("Error fetching sale listing:", err);
        setError(err.message || "Failed to load property");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar forceCompact={true} />
        <div className="pt-32 pb-20 max-w-6xl mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded-xl w-2/3 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/3 mb-8 animate-pulse" />
          <div className="aspect-[21/9] bg-gray-200 rounded-3xl mb-8 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar forceCompact={true} />
        <div className="pt-36 pb-20 text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#FF385C] flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} />
          </div>
          <h2 className="text-xl font-black text-gray-950 mb-2">Property Not Found</h2>
          <p className="text-xs text-gray-500 mb-6">
            The property you are looking for may have been sold, withdrawn, or the URL may be incorrect.
          </p>
          <Link
            href="/buy"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#FF385C] text-white text-xs font-bold shadow-md"
          >
            Browse Properties for Sale
          </Link>
        </div>
      </div>
    );
  }

  const amenities = Array.isArray(listing.amenities)
    ? listing.amenities
    : typeof listing.amenities === "string"
    ? JSON.parse(listing.amenities || "[]")
    : [];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar forceCompact={true} />

      <main className="pt-28 pb-20">
        <Container>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 font-semibold">
            <Link href="/" className="hover:text-black">Home</Link>
            <ChevronRight size={12} />
            <Link href="/buy" className="hover:text-black">Buy</Link>
            <ChevronRight size={12} />
            <Link href={`/buy?city=${listing.city}`} className="hover:text-black">{listing.city}</Link>
            <ChevronRight size={12} />
            <span className="text-gray-700 truncate max-w-[200px]">{listing.title}</span>
          </div>

          {/* Header Title & Badges */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-900 text-white uppercase tracking-wider">
                {listing.category || "Residential"}
              </span>
              {listing.isVerified && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white flex items-center gap-1">
                  <CheckCircle2 size={13} strokeWidth={2.5} />
                  Verified Listing
                </span>
              )}
              {listing.reraNumber && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  RERA: {listing.reraNumber}
                </span>
              )}
              {listing.ownershipType && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  {listing.ownershipType}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 tracking-tight leading-tight mb-2">
              {listing.title}
            </h1>

            <p className="text-sm text-gray-600 flex items-center gap-1.5">
              <MapPin size={16} className="text-[#FF385C] shrink-0" />
              <span>
                {listing.address || listing.locality}, {listing.city}, {listing.state} {listing.postalCode ? `- ${listing.postalCode}` : ''}
              </span>
            </p>
          </div>

          {/* Gallery Component */}
          <PropertySaleGallery images={listing.images} title={listing.title} />

          {/* Main 2-Column Layout: Details Left, Sidebar Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Content (2 Columns) */}
            <div className="lg:col-span-2 space-y-10">
              {/* Key Specs Matrix Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-black text-gray-950 mb-5 flex items-center gap-2">
                  <Sparkles size={18} className="text-[#FF385C]" />
                  <span>Property Specifications</span>
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 text-xs">
                  {listing.carpetArea && (
                    <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">Carpet Area</span>
                      <span className="font-black text-gray-900 text-sm">{formatArea(listing.carpetArea, listing.areaUnit)}</span>
                    </div>
                  )}

                  {listing.builtUpArea && (
                    <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">Built-up Area</span>
                      <span className="font-black text-gray-900 text-sm">{formatArea(listing.builtUpArea, listing.areaUnit)}</span>
                    </div>
                  )}

                  {listing.superBuiltUpArea && (
                    <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">Super Built-up Area</span>
                      <span className="font-black text-gray-900 text-sm">{formatArea(listing.superBuiltUpArea, listing.areaUnit)}</span>
                    </div>
                  )}

                  <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                    <span className="text-gray-400 font-bold block mb-1">Configuration</span>
                    <span className="font-black text-gray-900 text-sm">{listing.bhk || listing.propertyType}</span>
                  </div>

                  {listing.bathrooms && (
                    <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">Bathrooms</span>
                      <span className="font-black text-gray-900 text-sm">{listing.bathrooms} Baths</span>
                    </div>
                  )}

                  {listing.balconies && (
                    <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">Balconies</span>
                      <span className="font-black text-gray-900 text-sm">{listing.balconies}</span>
                    </div>
                  )}

                  {listing.floor !== null && listing.floor !== undefined && (
                    <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">Floor Level</span>
                      <span className="font-black text-gray-900 text-sm">
                        {listing.floor} of {listing.totalFloors || 'Multi'}
                      </span>
                    </div>
                  )}

                  {listing.possessionStatus && (
                    <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">Possession</span>
                      <span className="font-black text-emerald-700 text-sm">{listing.possessionStatus}</span>
                    </div>
                  )}

                  {listing.furnishingStatus && (
                    <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">Furnishing</span>
                      <span className="font-black text-gray-900 text-sm">{listing.furnishingStatus}</span>
                    </div>
                  )}

                  {listing.facingDirection && (
                    <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">Facing</span>
                      <span className="font-black text-gray-900 text-sm">{listing.facingDirection}</span>
                    </div>
                  )}

                  {listing.parking && (
                    <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">Parking</span>
                      <span className="font-black text-gray-900 text-sm">{listing.parking}</span>
                    </div>
                  )}

                  {listing.propertyAge && (
                    <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">Property Age</span>
                      <span className="font-black text-gray-900 text-sm">{listing.propertyAge}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description Section with Rich Architectural Highlights */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF385C]">
                    <FileText size={16} />
                    <span>Property Overview & Architectural Narrative</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                    {listing.category || "Residential"} • {listing.propertyType}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-gray-950 mb-4">About this Property</h2>
                
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed font-light space-y-4 whitespace-pre-line">
                  {listing.description}
                </div>

                {/* Structured Architectural Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] block mb-1">
                      Spatial Layout & Flow
                    </span>
                    <p className="text-xs text-gray-800 font-medium leading-relaxed">
                      Expansive {listing.bhk || `${listing.bedrooms || 3} BHK`} layout with designated formal living, family dining, and master suite separation for optimal acoustic privacy.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] block mb-1">
                      Interior Craftsmanship
                    </span>
                    <p className="text-xs text-gray-800 font-medium leading-relaxed">
                      Italian marble living floors, soundproof acoustic double-glazed windows, designer modular kitchen with quartz counter slabs, and premium sanitaryware.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] block mb-1">
                      Natural Light & Orientation
                    </span>
                    <p className="text-xs text-gray-800 font-medium leading-relaxed">
                      {listing.facingDirection || "East"}-facing architectural orientation designed to maximize radiant morning sunlight, cross-ventilation, and open skyline views.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] block mb-1">
                      Outdoor Balconies & Terraces
                    </span>
                    <p className="text-xs text-gray-800 font-medium leading-relaxed">
                      {listing.balconies || 2} private sit-out balconies offering panoramic landscaped perspectives and seamless indoor-outdoor transition.
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities Grid */}
              {amenities.length > 0 && (
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                  <h2 className="text-lg font-black text-gray-950 mb-5">Amenities & Features</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {amenities.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-800"
                      >
                        <CheckCircle2 size={16} className="text-[#FF385C] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seller Profile & Direct Advisory Section */}
              <SellerProfileSection
                seller={listing.seller}
                listing={listing}
                onContactClick={() => setIsContactModalOpen(true)}
                onCallbackClick={() => setIsCallbackModalOpen(true)}
              />

              {/* Investment, Valuation & Financial Insights */}
              <PropertyFinancialsSection listing={listing} />

              {/* Building Specifications, Security & Commute Times */}
              <BuildingCommuteSection listing={listing} />

              {/* Locality & Location Map Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-black text-gray-950 mb-2">Location & Neighborhood</h2>
                <p className="text-xs text-gray-500 mb-6">
                  {listing.locality ? `${listing.locality}, ` : ''}{listing.city}, {listing.state}
                </p>

                {/* Map placeholder */}
                <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-red-100/80 text-[#FF385C] flex items-center justify-center mx-auto mb-2 shadow-sm animate-bounce">
                      <MapPin size={24} />
                    </div>
                    <span className="font-bold text-gray-900 text-sm block">
                      {listing.locality || listing.city}
                    </span>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      Exact address provided upon direct contact with seller
                    </span>
                  </div>
                </div>
              </div>

              {/* Buyer Advisory Notice */}
              <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-2">
                <span className="font-black text-sm block flex items-center gap-1.5 text-amber-950">
                  <ShieldCheck size={18} className="text-amber-700" />
                  Stayr Real Estate Buyer Advisory
                </span>
                <p className="leading-relaxed">
                  Always inspect original property documents, title deed, municipal approvals, and verified encumbrance certificate prior to token transfers. Stayr connects verified buyers and sellers but does not directly hold escrow funds for sale transactions.
                </p>
              </div>
            </div>

            {/* Right Sidebar (1 Column) */}
            <div className="lg:col-span-1">
              <BuyerContactCard
                listing={listing}
                onContactClick={() => setIsContactModalOpen(true)}
                onCallbackClick={() => setIsCallbackModalOpen(true)}
                onReportClick={() => setIsReportModalOpen(true)}
              />
            </div>
          </div>

          {/* Similar Properties Section at Bottom */}
          <SimilarPropertiesSection currentListing={listing} />
        </Container>
      </main>

      {/* Modals */}
      <ContactSellerModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        listing={listing}
      />

      <RequestCallbackModal
        isOpen={isCallbackModalOpen}
        onClose={() => setIsCallbackModalOpen(false)}
        listing={listing}
      />

      <ReportListingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        listing={listing}
      />
    </div>
  );
}

