"use client";

import { MapPin, Navigation, Compass, Shield } from "lucide-react";

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "United Arab Emirates",
  "France",
  "Germany",
  "Singapore",
  "Thailand",
  "Indonesia",
  "Italy",
  "Spain",
];

const POPULAR_CITY_PRESETS = [
  { city: "Goa", state: "Goa", country: "India", lat: 15.2993, lng: 74.124 },
  { city: "Delhi", state: "Delhi", country: "India", lat: 28.6139, lng: 77.209 },
  { city: "Mumbai", state: "Maharashtra", country: "India", lat: 19.076, lng: 72.8777 },
  { city: "Gurgaon", state: "Haryana", country: "India", lat: 28.4595, lng: 77.0266 },
  { city: "Noida", state: "Uttar Pradesh", country: "India", lat: 28.5355, lng: 77.391 },
  { city: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lng: 77.5946 },
  { city: "Jaipur", state: "Rajasthan", country: "India", lat: 26.9124, lng: 75.7873 },
  { city: "Manali", state: "Himachal Pradesh", country: "India", lat: 32.2432, lng: 77.1892 },
];

export default function Step4Location({ formData, onChange }) {
  const selectCityPreset = (preset) => {
    onChange("city", preset.city);
    onChange("state", preset.state);
    onChange("country", preset.country);
    if (preset.lat) onChange("latitude", preset.lat);
    if (preset.lng) onChange("longitude", preset.lng);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Step Heading */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#FF385C] mb-3">
          <MapPin className="w-3.5 h-3.5" />
          Step 4: Property Location
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Where is your property located?
        </h1>
        <p className="mt-2 text-base text-gray-600">
          Your street address is only shared with guests after a reservation is confirmed.
        </p>
      </div>

      {/* Quick City Presets */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
          Quick Fill Popular Destinations
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CITY_PRESETS.map((preset) => (
            <button
              key={preset.city}
              type="button"
              onClick={() => selectCityPreset(preset)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-red-50 hover:text-[#FF385C] border border-gray-200 transition cursor-pointer"
            >
              {preset.city}, {preset.state}
            </button>
          ))}
        </div>
      </div>

      {/* Address Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-5">
        {/* Country */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Country / Region <span className="text-[#FF385C]">*</span>
          </label>
          <select
            value={formData.country || "India"}
            onChange={(e) => onChange("country", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium bg-white"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Street Address */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Street Address <span className="text-[#FF385C]">*</span>
          </label>
          <input
            type="text"
            value={formData.address || ""}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="e.g., 42 Calangute Beach Road, Villa #3"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium"
          />
        </div>

        {/* Apartment / Suite Details */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Apt, suite, building details <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.unitDetails || ""}
            onChange={(e) => onChange("unitDetails", e.target.value)}
            placeholder="e.g., Tower B, 4th Floor, Suite 402"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium"
          />
        </div>

        {/* City, State, PIN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              City <span className="text-[#FF385C]">*</span>
            </label>
            <input
              type="text"
              value={formData.city || ""}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="e.g., Goa"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              State / Province <span className="text-[#FF385C]">*</span>
            </label>
            <input
              type="text"
              value={formData.state || ""}
              onChange={(e) => onChange("state", e.target.value)}
              placeholder="e.g., Goa"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              PIN / Postal Code
            </label>
            <input
              type="text"
              value={formData.postalCode || ""}
              onChange={(e) => onChange("postalCode", e.target.value)}
              placeholder="e.g., 403516"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Visual Map Pin & Privacy Guarantee */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#FF385C] text-white rounded-xl shadow-md">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              Location Privacy Protection
              <Shield className="w-4 h-4 text-emerald-600" />
            </h3>
            <p className="text-xs text-gray-600 mt-1 max-w-xl leading-relaxed">
              Before a reservation is confirmed, guests only see an approximate neighborhood map pin
              in <strong>{formData.city || "your city"}</strong>. Your exact street address is guarded
              and never revealed publicly.
            </p>
            {formData.city && formData.country && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#FF385C] bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <Navigation className="w-3.5 h-3.5" />
                <span>
                  Map display: {formData.city}, {formData.state ? `${formData.state}, ` : ""}{formData.country}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
