"use client";

import { useState } from "react";
import {
  Wifi,
  Wind,
  Flame,
  Tv,
  Briefcase,
  Utensils,
  Car,
  Waves,
  Dumbbell,
  ShieldAlert,
  Search,
  Check,
  Sparkles,
  Bath,
  Coffee,
  TreePine,
  ArrowUpDown,
  BellRing,
  HeartPulse,
} from "lucide-react";

const AMENITY_CATEGORIES = [
  {
    category: "Essentials",
    items: [
      { id: "Wi-Fi", name: "Wi-Fi", icon: Wifi, desc: "Fast internet throughout the property" },
      { id: "Air conditioning", name: "Air conditioning", icon: Wind, desc: "Climate control cooling" },
      { id: "Heating", name: "Heating", icon: Flame, desc: "Central or space heating" },
      { id: "Television", name: "Television", icon: Tv, desc: "Smart TV with streaming apps" },
      { id: "Dedicated workspace", name: "Dedicated workspace", icon: Briefcase, desc: "Desk & comfortable ergonomic chair" },
      { id: "Hot water", name: "Hot water", icon: Bath, desc: "24/7 hot water supply" },
    ],
  },
  {
    category: "Kitchen & Dining",
    items: [
      { id: "Kitchen", name: "Kitchen", icon: Utensils, desc: "Space where guests can cook their own meals" },
      { id: "Refrigerator", name: "Refrigerator", icon: Utensils, desc: "Full-size fridge with freezer" },
      { id: "Microwave", name: "Microwave", icon: Coffee, desc: "Microwave oven for quick reheating" },
      { id: "Washing machine", name: "Washing machine", icon: Sparkles, desc: "In-unit laundry washer" },
    ],
  },
  {
    category: "Features & Outdoors",
    items: [
      { id: "Free parking", name: "Free parking", icon: Car, desc: "Free on-premises or street parking" },
      { id: "Swimming pool", name: "Swimming pool", icon: Waves, desc: "Private or shared swimming pool" },
      { id: "Gym", name: "Gym", icon: Dumbbell, desc: "Exercise equipment on premises" },
      { id: "Balcony", name: "Balcony", icon: Sparkles, desc: "Private outdoor terrace or balcony" },
      { id: "Garden", name: "Garden", icon: TreePine, desc: "Lush private or shared garden lawn" },
      { id: "Outdoor seating", name: "Outdoor seating", icon: Coffee, desc: "Patio chairs and outdoor dining table" },
      { id: "Lift", name: "Lift", icon: ArrowUpDown, desc: "Elevator access in the building" },
    ],
  },
  {
    category: "Safety & Security",
    items: [
      { id: "Smoke alarm", name: "Smoke alarm", icon: BellRing, desc: "Functioning smoke detector" },
      { id: "Fire extinguisher", name: "Fire extinguisher", icon: ShieldAlert, desc: "Emergency fire safety equipment" },
      { id: "First aid kit", name: "First aid kit", icon: HeartPulse, desc: "Basic emergency medical supplies" },
    ],
  },
];

export default function Step6Amenities({ selectedAmenities = [], onChange }) {
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAmenity = (name) => {
    let updated;
    if (selectedAmenities.includes(name)) {
      updated = selectedAmenities.filter((a) => a !== name);
    } else {
      updated = [...selectedAmenities, name];
    }
    onChange("amenities", updated);
  };

  const filteredCategories = AMENITY_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Heading */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#FF385C] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Step 6: Amenities & Features
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          What amenities do you offer?
        </h1>
        <p className="mt-2 text-base text-gray-600">
          Guests frequently filter search results by specific amenities. Select all that are provided at your property.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search amenities (e.g., Wi-Fi, Pool, Kitchen)..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium shadow-sm transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Categorized Amenities */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-sm">No amenities found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div key={cat.category} className="space-y-3">
              <h3 className="font-bold text-gray-900 text-lg">{cat.category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const isChecked = selectedAmenities.includes(item.name);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleAmenity(item.name)}
                      className={`p-4 rounded-2xl border-2 text-left transition flex items-start justify-between cursor-pointer group hover:border-[#FF385C]/60 hover:shadow-sm ${
                        isChecked
                          ? "border-[#FF385C] bg-red-50/20 shadow-sm"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-xl transition ${
                            isChecked
                              ? "bg-[#FF385C] text-white"
                              : "bg-gray-100 text-gray-700 group-hover:bg-red-50 group-hover:text-[#FF385C]"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 mt-0.5 ${
                          isChecked ? "border-[#FF385C] bg-[#FF385C]" : "border-gray-300"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Counter */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-sm">
        <span className="text-gray-600 font-medium">
          Total selected amenities: <strong className="text-gray-900">{selectedAmenities.length}</strong>
        </span>
        {selectedAmenities.length > 0 && (
          <button
            type="button"
            onClick={() => onChange("amenities", [])}
            className="text-xs text-[#FF385C] hover:underline font-bold cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
