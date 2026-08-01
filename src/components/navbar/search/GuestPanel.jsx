"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

export default function GuestPanel({ guests, updateGuests }) {
  const increment = (type) => {
    updateGuests(type, guests[type] + 1);
  };

  const decrement = (type) => {
    if (guests[type] > 0) {
      updateGuests(type, guests[type] - 1);
    }
  };

  const categories = [
    { id: "adults", name: "Adults", desc: "Ages 13 or above", min: 0 },
    { id: "children", name: "Children", desc: "Ages 2–12", min: 0 },
    { id: "infants", name: "Infants", desc: "Under 2", min: 0 },
    { id: "pets", name: "Pets", desc: "Bringing a service animal?", min: 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-[120%] right-0 w-[400px] max-h-[60vh] overflow-y-auto bg-white rounded-3xl shadow-[0_12px_28px_rgba(0,0,0,0.15)] border border-[#EFE7D8] p-6 z-50 origin-top-right"
    >
      <div className="flex flex-col gap-6">
        {categories.map((cat, index) => (
          <div key={cat.id} className={`flex items-center justify-between ${index !== categories.length - 1 ? "border-b border-[#EFE7D8] pb-6" : ""}`}>
            <div>
              <div className="font-semibold text-[#2B2B2B] text-[16px]">{cat.name}</div>
              <div className="text-[#7B7468] text-[14px]">{cat.desc}</div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => decrement(cat.id)}
                disabled={guests[cat.id] <= cat.min}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-[#7B7468] hover:border-[#2B2B2B] hover:text-[#2B2B2B] disabled:opacity: 1,y-30 disabled:hover:border-gray-300 transition"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              
              <span className="w-4 text-center font-semibold text-[#2B2B2B]">
                {guests[cat.id]}
              </span>
              
              <button 
                onClick={() => increment(cat.id)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-[#7B7468] hover:border-[#2B2B2B] hover:text-[#2B2B2B] transition"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
