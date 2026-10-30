"use client";

import {
  Building,
  Home,
  Sparkles,
  Mountain,
  Building2,
  Palmtree,
  Tractor,
  DoorClosed,
  Check,
  Calendar,
  Layers,
  Users,
} from "lucide-react";

const PROPERTY_CATEGORIES = [
  { id: "Apartment", label: "Apartment", description: "Rented unit in a multi-unit residential building or complex.", icon: Building },
  { id: "House", label: "House", description: "Stand-alone single-family home or residential dwelling.", icon: Home },
  { id: "Villa", label: "Villa", description: "Upscale luxury residence with private amenities and gardens.", icon: Sparkles },
  { id: "Cabin", label: "Cabin", description: "Rustic retreat built in natural surroundings, woods or mountains.", icon: Mountain },
  { id: "Hotel", label: "Hotel", description: "Boutique or commercial hospitality room with managed services.", icon: Building2 },
  { id: "Resort", label: "Resort", description: "Full-service vacation property with recreation facilities.", icon: Palmtree },
  { id: "Farmhouse", label: "Farmhouse", description: "Rural escape set on farmland or agricultural estate.", icon: Tractor },
  { id: "Cottage", label: "Cottage", description: "Cozy small dwelling, countryside or beachfront haven.", icon: DoorClosed },
];

const SPACE_TYPES = [
  {
    id: "Entire home",
    title: "An entire place",
    description: "Guests have the whole property to themselves, including private entrance, bedrooms, bathrooms, and kitchen.",
    icon: Home,
  },
  {
    id: "Private room",
    title: "A private room",
    description: "Guests have their own private bedroom for sleeping. Common areas like living room or kitchen may be shared.",
    icon: DoorClosed,
  },
  {
    id: "Shared room",
    title: "A shared room",
    description: "Guests sleep in a bedroom or common area that may be shared with you or other guests.",
    icon: Users,
  },
];

const RENTAL_DURATIONS = [
  {
    id: "both",
    title: "Both short & long stays",
    description: "Maximum booking flexibility (1 day to several months). Recommended.",
    badge: "Popular",
  },
  {
    id: "short",
    title: "Short stays only",
    description: "Ideal for weekenders, vacationers, and tourists (under 30 days).",
  },
  {
    id: "long",
    title: "Long stays only",
    description: "Ideal for digital nomads, relocations, and students (30+ days).",
  },
];

export default function Step2PropertyType({ formData, onChange }) {
  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Step Heading */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#FF385C] mb-3">
          <Layers className="w-3.5 h-3.5" />
          Step 2: Property Category & Type
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Which of these best describes your place?
        </h1>
        <p className="mt-2 text-base text-gray-600">
          Pick the category that most accurately captures your property.
        </p>
      </div>

      {/* 8 Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {PROPERTY_CATEGORIES.map((item) => {
          const Icon = item.icon;
          const isSelected = formData.category === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange("category", item.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:border-[#FF385C]/60 hover:shadow-md ${
                isSelected
                  ? "border-[#FF385C] bg-red-50/20 shadow-sm"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div
                  className={`p-2.5 rounded-xl transition ${
                    isSelected
                      ? "bg-[#FF385C] text-white"
                      : "bg-gray-100 text-gray-700 group-hover:bg-red-50 group-hover:text-[#FF385C]"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#FF385C] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{item.label}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Space Types */}
      <div className="pt-4 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What type of space will guests have?
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Guests look for spaces that match their privacy needs.
        </p>

        <div className="space-y-3">
          {SPACE_TYPES.map((space) => {
            const Icon = space.icon;
            const isSelected = formData.propertyType === space.id;
            return (
              <button
                key={space.id}
                type="button"
                onClick={() => onChange("propertyType", space.id)}
                className={`w-full p-5 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer group hover:border-[#FF385C]/60 hover:shadow-sm ${
                  isSelected
                    ? "border-[#FF385C] bg-red-50/20 shadow-sm"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl transition mt-0.5 ${
                      isSelected
                        ? "bg-[#FF385C] text-white"
                        : "bg-gray-100 text-gray-700 group-hover:bg-red-50 group-hover:text-[#FF385C]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{space.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5 max-w-xl">
                      {space.description}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
                    isSelected ? "border-[#FF385C] bg-[#FF385C]" : "border-gray-300"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rental Duration */}
      <div className="pt-4 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What rental duration will you accept?
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Choose whether your property accommodates vacationers, long-term guests, or both.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {RENTAL_DURATIONS.map((dur) => {
            const isSelected = (formData.rentalDuration || "both") === dur.id;
            return (
              <button
                key={dur.id}
                type="button"
                onClick={() => onChange("rentalDuration", dur.id)}
                className={`p-5 rounded-2xl border-2 text-left transition flex flex-col justify-between cursor-pointer hover:border-[#FF385C]/60 ${
                  isSelected
                    ? "border-[#FF385C] bg-red-50/20 shadow-sm"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Calendar className={`w-5 h-5 ${isSelected ? "text-[#FF385C]" : "text-gray-400"}`} />
                  {dur.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#FF385C]">
                      {dur.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{dur.title}</h3>
                  <p className="text-xs text-gray-500">{dur.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
