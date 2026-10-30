"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, Building, ArrowUpDown } from "lucide-react";
import SaleFilterModal from "./SaleFilterModal";

export default function SaleSearchBar({ filters, onFilterChange }) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchInput });
  };

  const activeFilterCount = [
    filters.propertyType,
    filters.minPrice,
    filters.maxPrice,
    filters.bedrooms,
    filters.minArea,
    filters.maxArea,
    filters.furnishingStatus,
    filters.possessionStatus,
    filters.isVerified,
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-white rounded-3xl shadow-md border border-gray-100 p-3 sm:p-4 mb-8">
      {/* Top Tabs: All / Residential / Commercial */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
        <div className="flex items-center gap-1 sm:gap-2">
          {[
            { id: "", label: "All Properties" },
            { id: "Residential", label: "Residential" },
            { id: "Commercial", label: "Commercial" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ ...filters, category: cat.id, propertyType: "" })}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                (filters.category || "") === cat.id
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <ArrowUpDown size={14} className="text-gray-400 hidden sm:inline" />
          <span className="hidden sm:inline">Sort:</span>
          <select
            value={filters.sort || "newest"}
            onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
            className="font-semibold text-gray-800 bg-transparent border-0 focus:outline-none cursor-pointer text-xs"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="area_asc">Area: Low to High</option>
            <option value="area_desc">Area: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Search Controls */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-2">
        {/* Keyword / City Search Box */}
        <div className="relative flex-1 w-full flex items-center bg-gray-50 hover:bg-gray-100/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF385C]/20 border border-gray-200/80 rounded-2xl px-3.5 py-2.5 transition">
          <Search size={18} className="text-gray-400 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Search city, locality, project or landmark (e.g. Noida, Sector 150, Gurgaon)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onFilterChange({ ...filters, search: "" });
              }}
              className="text-xs text-gray-400 hover:text-gray-600 px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick BHK Filter (if residential) */}
        {filters.category !== "Commercial" && (
          <div className="hidden lg:flex items-center gap-1 px-1">
            {["1", "2", "3", "4"].map((bhk) => (
              <button
                key={bhk}
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    bedrooms: filters.bedrooms === bhk ? "" : bhk,
                  })
                }
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                  filters.bedrooms === bhk
                    ? "border-[#FF385C] bg-[#FF385C] text-white"
                    : "border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50"
                }`}
              >
                {bhk} BHK
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons: Filter Modal & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition shadow-sm ${
              activeFilterCount > 0
                ? "border-[#FF385C] bg-red-50 text-[#FF385C]"
                : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
            }`}
          >
            <SlidersHorizontal size={15} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FF385C] text-white text-[10px] flex items-center justify-center font-black">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            type="submit"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold shadow-md hover:shadow-lg transition active:scale-95"
          >
            <Search size={15} strokeWidth={2.5} />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Filter Modal */}
      <SaleFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={(updated) => onFilterChange(updated)}
        onReset={(cleared) => {
          setSearchInput("");
          onFilterChange(cleared);
        }}
      />
    </div>
  );
}

