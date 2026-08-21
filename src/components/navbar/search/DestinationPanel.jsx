"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin } from "lucide-react";

const DESTINATIONS = [
  {
    id: 1,
    name: "Noida",
    desc: "Popular destination",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80" },
  {
    id: 2,
    name: "Goa",
    desc: "Trending now",
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80" },
  {
    id: 3,
    name: "Mumbai",
    desc: "City escapes",
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80" },
  {
    id: 4,
    name: "Manali",
    desc: "Mountain retreats",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80" },
  {
    id: 5,
    name: "Jaipur",
    desc: "Heritage walks",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80" },
  {
    id: 6,
    name: "Kerala",
    desc: "Tropical paradise",
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80" },
  {
    id: 7,
    name: "Udaipur",
    desc: "City of lakes",
    img: "https://loremflickr.com/400/300/udaipur,palace/all" },
  {
    id: 8,
    name: "Rishikesh",
    desc: "Spiritual retreats",
    img: "https://loremflickr.com/400/300/rishikesh,ganges/all" },
  {
    id: 9,
    name: "Shimla",
    desc: "Hill station",
    img: "https://loremflickr.com/400/300/shimla,mountains/all" },
  {
    id: 10,
    name: "Agra",
    desc: "Historical sites",
    img: "https://loremflickr.com/400/300/agra,tajmahal/all" }
];

export default function DestinationPanel({ onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-[120%] left-0 w-[450px] max-h-[60vh] overflow-y-auto bg-white rounded-3xl shadow-[0_12px_28px_rgba(0,0,0,0.15)] border border-[#EFE7D8] p-6 z-50 origin-top-left"
    >
      {/* Recent Searches */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-[#2B2B2B] uppercase mb-3">Recent searches</h3>
        <div 
          onClick={() => onSelect && onSelect("Delhi")}
          className="flex items-center gap-4 p-2 -ml-2 rounded-xl hover:bg-[#F5F5F5] cursor-pointer transition"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <MapPin size={20} className="text-[#2B2B2B]" />
          </div>
          <div>
            <div className="text-[15px] font-semibold text-[#2B2B2B]">Delhi</div>
            <div className="text-[13px] text-[#7B7468]">Any week • Add guests</div>
          </div>
        </div>
      </div>

      {/* Suggested */}
      <div>
        <h3 className="text-xs font-bold text-[#2B2B2B] uppercase mb-4">Suggested destinations</h3>
        <div className="grid grid-cols-2 gap-4">
          {DESTINATIONS.map((dest) => (
            <div 
              key={dest.id}
              onClick={() => onSelect && onSelect(dest.name)}
              className="flex flex-col gap-2 p-2 -ml-2 rounded-xl hover:bg-[#F5F5F5] cursor-pointer transition group"
            >
              <div className="w-full aspect-video rounded-lg overflow-hidden relative border border-transparent group-hover:border-[#E8B65B] group-hover:shadow-md transition-all duration-300">
                <Image 
                  src={dest.img}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[#2B2B2B]">{dest.name}</div>
                <div className="text-[12px] text-[#7B7468]">{dest.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
