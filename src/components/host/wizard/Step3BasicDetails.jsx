"use client";

import { Plus, Minus, FileText, Check, Sparkles } from "lucide-react";

const HIGHLIGHT_TAGS = [
  "Peaceful",
  "Unique space",
  "Family-friendly",
  "Scenic views",
  "Central location",
  "Spacious",
  "Luxury finishes",
  "Pet-friendly",
  "Work-friendly",
  "Beach access",
  "Mountain view",
  "Private pool",
];

export default function Step3BasicDetails({ formData, onChange }) {
  const updateCounter = (field, delta, min = 0, max = 50) => {
    const current = Number(formData[field] ?? (min || 1));
    const nextVal = Math.max(min, Math.min(max, current + delta));
    onChange(field, nextVal);
  };

  const toggleHighlight = (tag) => {
    const currentList = Array.isArray(formData.highlights) ? [...formData.highlights] : [];
    if (currentList.includes(tag)) {
      onChange("highlights", currentList.filter((t) => t !== tag));
    } else {
      onChange("highlights", [...currentList, tag]);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Step Heading */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#FF385C] mb-3">
          <FileText className="w-3.5 h-3.5" />
          Step 3: Basic Property Details
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Tell us about your property
        </h1>
        <p className="mt-2 text-base text-gray-600">
          Give your listing a standout title, captivating description, and basic capacity details.
        </p>
      </div>

      {/* Property Title Input */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-gray-900">
            Property Title <span className="text-[#FF385C]">*</span>
          </label>
          <span className="text-xs text-gray-400 font-medium">
            {(formData.title || "").length} / 100
          </span>
        </div>
        <input
          type="text"
          maxLength={100}
          value={formData.title || ""}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="e.g., Waterfront Luxury Villa with Private Infinity Pool"
          className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-base transition font-medium"
        />
        <p className="text-xs text-gray-500">
          Catch guests' attention with what makes your place special. Keep it concise and descriptive.
        </p>
      </div>

      {/* Property Description Textarea */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-gray-900">
            Property Description <span className="text-[#FF385C]">*</span>
          </label>
          <span
            className={`text-xs font-medium ${
              (formData.description || "").length < 20 ? "text-amber-600" : "text-gray-400"
            }`}
          >
            {(formData.description || "").length} characters (min 20)
          </span>
        </div>
        <textarea
          rows={5}
          value={formData.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Describe the atmosphere, unique features, layout, and what guests will love most about staying here..."
          className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm transition leading-relaxed resize-y"
        />
        <p className="text-xs text-gray-500">
          Share details about what makes your space special, nearby attractions, and great amenities.
        </p>
      </div>

      {/* Capacity & Floor Plan Counters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Rooms & Capacity</h2>

        <div className="divide-y divide-gray-100">
          {/* Max Guests */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 text-base">Guests Capacity</p>
              <p className="text-xs text-gray-500">Maximum number of adults & children</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateCounter("maxGuests", -1, 1, 50)}
                disabled={(formData.maxGuests || 1) <= 1}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-500 flex items-center justify-center text-gray-600 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-lg text-gray-900">
                {formData.maxGuests || 1}
              </span>
              <button
                type="button"
                onClick={() => updateCounter("maxGuests", 1, 1, 50)}
                disabled={(formData.maxGuests || 1) >= 50}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-500 flex items-center justify-center text-gray-600 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bedrooms */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 text-base">Bedrooms</p>
              <p className="text-xs text-gray-500">Private or dedicated sleeping rooms</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateCounter("bedrooms", -1, 0, 20)}
                disabled={(formData.bedrooms ?? 1) <= 0}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-500 flex items-center justify-center text-gray-600 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-lg text-gray-900">
                {formData.bedrooms ?? 1}
              </span>
              <button
                type="button"
                onClick={() => updateCounter("bedrooms", 1, 0, 20)}
                disabled={(formData.bedrooms ?? 1) >= 20}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-500 flex items-center justify-center text-gray-600 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Beds */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 text-base">Beds</p>
              <p className="text-xs text-gray-500">Total sleeping beds available for guests</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateCounter("beds", -1, 1, 30)}
                disabled={(formData.beds || 1) <= 1}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-500 flex items-center justify-center text-gray-600 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-lg text-gray-900">
                {formData.beds || 1}
              </span>
              <button
                type="button"
                onClick={() => updateCounter("beds", 1, 1, 30)}
                disabled={(formData.beds || 1) >= 30}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-500 flex items-center justify-center text-gray-600 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bathrooms */}
          <div className="py-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 text-base">Bathrooms</p>
              <p className="text-xs text-gray-500">Full or half bathrooms</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateCounter("bathrooms", -1, 1, 15)}
                disabled={(formData.bathrooms || 1) <= 1}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-500 flex items-center justify-center text-gray-600 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-lg text-gray-900">
                {formData.bathrooms || 1}
              </span>
              <button
                type="button"
                onClick={() => updateCounter("bathrooms", 1, 1, 15)}
                disabled={(formData.bathrooms || 1) >= 15}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-500 flex items-center justify-center text-gray-600 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Property Size (sq ft) */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Property Area (Square Feet) <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="relative max-w-xs">
            <input
              type="number"
              min={0}
              max={100000}
              value={formData.sqft || ""}
              onChange={(e) => onChange("sqft", e.target.value)}
              placeholder="e.g., 1850"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium"
            />
            <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs text-gray-400 font-semibold">
              sq. ft.
            </span>
          </div>
        </div>
      </div>

      {/* Property Highlights Pills */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF385C]" />
            Distinctive Property Highlights
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Select tags that best highlight the character of your property.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {HIGHLIGHT_TAGS.map((tag) => {
            const isSelected = Array.isArray(formData.highlights) && formData.highlights.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleHighlight(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#FF385C] text-white shadow-sm ring-2 ring-[#FF385C]/20"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
