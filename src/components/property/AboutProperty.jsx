"use client";
import { useState } from "react";

export default function AboutProperty({ title, description }) {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-[22px] font-bold text-[#2B2B2B] mb-4">About this property</h2>
      
      <h3 className="text-[17px] font-bold text-[#2B2B2B] mb-2">{title}</h3>
      
      <div className={`text-[15px] text-[#2B2B2B] leading-relaxed relative ${expanded ? "" : "max-h-[100px] overflow-hidden"}`}>
        <p>{description}</p>
        
        {/* Gradient overlay when collapsed */}
        {!expanded && (
          <div className="absolute bottom-0 left-0 w-full h-[40px] bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      <button 
        onClick={() => setExpanded(!expanded)}
        className="mt-4 text-[#0050FF] font-semibold text-[15px] hover:underline"
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </div>
  );
}
