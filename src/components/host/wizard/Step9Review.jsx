"use client";

import {
  MapPin,
  Users,
  Bed,
  Bath,
  IndianRupee,
  ShieldCheck,
  Edit2,
  Check,
  Star,
  Sparkles,
  Home,
  Clock,
  Send,
  Loader2,
} from "lucide-react";

export default function Step9Review({
  user,
  formData,
  images = [],
  featuredImage,
  onGoToStep,
  onSubmit,
  isSubmitting = false,
  submissionError = "",
}) {
  const price = Number(formData.pricePerNight) || 0;
  const coverUrl =
    featuredImage ||
    (images.length > 0 ? images[0].url : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200");

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Step Heading */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#FF385C] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Step 9: Review & Submit
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Review your listing
        </h1>
        <p className="mt-2 text-base text-gray-600">
          Make sure everything looks perfect. You can jump back to edit any section before submitting for review.
        </p>
      </div>

      {submissionError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          <strong>Submission Error:</strong> {submissionError}
        </div>
      )}

      {/* Main Preview Container */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
        {/* Cover & Gallery Preview */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#FF385C]" />
              Photos ({images.length})
            </h2>
            <button
              type="button"
              onClick={() => onGoToStep(5)}
              className="text-xs font-bold text-[#FF385C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Photos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Primary Cover Photo */}
            <div className="md:col-span-2 relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
              <img
                src={coverUrl}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FF385C] text-white text-xs font-bold shadow flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-white" />
                <span>Featured Cover Photo</span>
              </div>
            </div>

            {/* Thumbnail Column */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {images.slice(1, 3).map((img, i) => (
                <div
                  key={img.id || i}
                  className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100"
                >
                  <img
                    src={img.url}
                    alt={`Photo ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {images.length > 3 && (
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
                  +{images.length - 3} more photos
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Property Details & Location */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800 uppercase tracking-wider">
                {formData.category || "Property"}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs font-semibold text-gray-600">
                {formData.propertyType || "Entire home"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="text-xs font-bold text-[#FF385C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          <h3 className="text-2xl font-extrabold text-gray-900 leading-snug">
            {formData.title || "Untitled Property Listing"}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-[#FF385C]" />
            <span>
              {formData.address ? `${formData.address}, ` : ""}
              <strong>{formData.city || "City"}</strong>, {formData.state || "State"},{" "}
              {formData.country || "India"}
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(4)}
              className="text-xs text-[#FF385C] font-semibold hover:underline ml-2 cursor-pointer"
            >
              (Edit Location)
            </button>
          </div>

          {/* Quick Specs Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-3 text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{formData.maxGuests || 1} Guests max</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Home className="w-4 h-4 text-gray-400" />
              <span>{formData.bedrooms || 1} Bedrooms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-gray-400" />
              <span>{formData.beds || 1} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-gray-400" />
              <span>{formData.bathrooms || 1} Baths</span>
            </div>
            {formData.sqft && (
              <div className="text-gray-500 font-normal">
                {formData.sqft} sq. ft.
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed pt-3 border-t border-gray-100">
            {formData.description || "No description provided yet."}
          </p>
        </div>

        {/* Pricing & Booking Policies */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-[#FF385C]" />
              Pricing & Terms
            </h3>
            <button
              type="button"
              onClick={() => onGoToStep(7)}
              className="text-xs font-bold text-[#FF385C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Pricing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nightly Rate</p>
              <p className="text-2xl font-black text-gray-900 mt-1">₹{price.toLocaleString("en-IN")}</p>
              <p className="text-[11px] text-gray-500">per night</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cleaning Fee</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {formData.cleaningFee ? `₹${Number(formData.cleaningFee).toLocaleString("en-IN")}` : "Free / Included"}
              </p>
              <p className="text-[11px] text-gray-500">one-time</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cancellation</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {formData.cancellationPolicy || "Flexible"}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold">Standard Protection</p>
            </div>
          </div>
        </div>

        {/* Amenities Preview */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF385C]" />
              Amenities ({(formData.amenities || []).length})
            </h3>
            <button
              type="button"
              onClick={() => onGoToStep(6)}
              className="text-xs font-bold text-[#FF385C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Amenities</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {(formData.amenities || []).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                <span>{typeof amenity === "string" ? amenity : amenity.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Host Account Details */}
        <div className="p-6 sm:p-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Hosted by {user?.name || "Host"}
            </h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Verified Host Profile
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Contact phone: {formData.hostPhone || user?.phone || "Included in account"} • Email: {user?.email}
          </p>
        </div>
      </div>

      {/* Final Submission Card */}
      <div className="bg-red-50/50 rounded-3xl border-2 border-[#FF385C]/30 p-8 text-center space-y-4 shadow-sm">
        <h3 className="text-2xl font-extrabold text-gray-900">
          Ready to submit your listing for review?
        </h3>
        <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
          Once submitted, our trust and verification team will review your property details. You can track progress anytime from your Host Dashboard.
        </p>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-10 py-4 bg-[#FF385C] hover:bg-[#E00B41] text-white font-extrabold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting for Review...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit Listing for Review</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
