"use client";

import { motion } from "framer-motion";

export default function SearchSection({
  id,
  title,
  subtitle,
  isActive,
  isHovered,
  onHover,
  onHoverEnd,
  onClick,
  className = "",
  hasSearchButton = false,
  searchButton }) {
  return (
    <motion.div
      layout
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
      className={`relative cursor-pointer transition-colors duration-200 ${className} ${
        isActive 
          ? "bg-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] z-20 rounded-full" 
          : "hover:bg-[#EBEBEB] rounded-full z-10"
      }`}
    >
      <div className={`px-6 py-3 flex flex-row items-center ${hasSearchButton ? "justify-between" : ""}`}>
        <div>
          <motion.div layout className="text-xs font-bold text-[#2B2B2B]">
            {title}
          </motion.div>
          <motion.div layout className={`text-sm ${isActive ? "text-[#2B2B2B]" : "text-[#7B7468]"}`}>
            {subtitle}
          </motion.div>
        </div>
        
        {hasSearchButton && searchButton}
      </div>
    </motion.div>
  );
}
