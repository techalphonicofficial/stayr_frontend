"use client";

import { useState } from "react";
import { X, RotateCcw } from "lucide-react";

export default function SaleFilterModal({ isOpen, onClose, filters, onApply, onReset }) {
  const [localFilters, setLocalFilters] = useState({ ...filters });

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const cleared = {
      category: "",
      propertyType: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      minArea: "",
      maxArea: "",
      furnishingStatus: "",
      possessionStatus: "",
      isVerified: "",
      sort: "newest",
    };
    setLocalFilters(cleared);
    if (onReset) onReset(cleared);
    onClose();
  };

  const propertyTypes = localFilters.category === "Commercial"
    ? ["Office Space", "Shop / Showroom", "Commercial Land", "Warehouse", "Co-working Space"]
    : ["Apartment", "Independent Villa", "Penthouse", "Builder Floor", "Residential Plot", "Studio Apartment"];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Property Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "", label: "All Properties" },
                { id: "Residential", label: "Residential" },
                { id: "Commercial", label: "Commercial" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleChange("category", cat.id)}
                  className={`py-2.5 px-3 rounded-xl font-bold border transition ${
                    localFilters.category === cat.id
                      ? "border-[#FF385C] bg-red-50/70 text-[#FF385C]"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Property Type
            </label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange("propertyType", localFilters.propertyType === type ? "" : type)}
                  className={`py-1.5 px-3 rounded-full text-xs font-semibold border transition ${
                    localFilters.propertyType === type
                      ? "border-[#FF385C] bg-[#FF385C] text-white"
                      : "border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Price Range (₹ INR)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-gray-400 block mb-1">Minimum Price</span>
                <input
                  type="number"
                  placeholder="e.g. 5000000 (50 Lakh)"
                  value={localFilters.minPrice || ""}
                  onChange={(e) => handleChange("minPrice", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-[#FF385C] focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] text-gray-400 block mb-1">Maximum Price</span>
                <input
                  type="number"
                  placeholder="e.g. 50000000 (5 Crore)"
                  value={localFilters.maxPrice || ""}
                  onChange={(e) => handleChange("maxPrice", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-[#FF385C] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms (for residential) */}
          {localFilters.category !== "Commercial" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Bedrooms / Configuration
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "", label: "Any BHK" },
                  { value: "1", label: "1 BHK" },
                  { value: "2", label: "2 BHK" },
                  { value: "3", label: "3 BHK" },
                  { value: "4", label: "4+ BHK" },
                ].map((bhk) => (
                  <button
                    key={bhk.value}
                    type="button"
                    onClick={() => handleChange("bedrooms", bhk.value)}
                    className={`py-2 px-4 rounded-xl font-bold border transition ${
                      (localFilters.bedrooms || "") === bhk.value
                        ? "border-[#FF385C] bg-[#FF385C] text-white"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    {bhk.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Area Range (sq ft) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Super / Built-up Area (sq ft)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="Min Area (sq ft)"
                  value={localFilters.minArea || ""}
                  onChange={(e) => handleChange("minArea", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-[#FF385C] focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max Area (sq ft)"
                  value={localFilters.maxArea || ""}
                  onChange={(e) => handleChange("maxArea", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-[#FF385C] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Possession Status & Furnishing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Possession Status
              </label>
              <select
                value={localFilters.possessionStatus || ""}
                onChange={(e) => handleChange("possessionStatus", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-[#FF385C] focus:outline-none bg-white"
              >
                <option value="">Any Possession</option>
                <option value="Ready to Move">Ready to Move</option>
                <option value="Under Construction">Under Construction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Furnishing
              </label>
              <select
                value={localFilters.furnishingStatus || ""}
                onChange={(e) => handleChange("furnishingStatus", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-[#FF385C] focus:outline-none bg-white"
              >
                <option value="">Any Furnishing</option>
                <option value="Furnished">Fully Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* Verified Only Toggle */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <span className="font-bold text-gray-900 block">Stayr Verified Properties Only</span>
              <span className="text-xs text-gray-500">Only show real estate listings verified by our audit team</span>
            </div>
            <button
              type="button"
              onClick={() => handleChange("isVerified", localFilters.isVerified === "true" ? "" : "true")}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                localFilters.isVerified === "true" ? "bg-emerald-600 justify-end" : "bg-gray-300 justify-start"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-black transition"
          >
            <RotateCcw size={14} />
            Reset all
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#FF385C] hover:bg-[#E00B41] text-white shadow-md transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

