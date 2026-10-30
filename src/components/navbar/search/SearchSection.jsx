"use client";

export default function SearchSection({
  title,
  subtitle,
  isActive,
  onHover,
  onHoverEnd,
  onClick,
  className = "",
  hasSearchButton = false,
  searchButton }) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-200 ${className} ${
        isActive 
          ? "bg-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] z-20 rounded-full" 
          : "hover:bg-[#EBEBEB] rounded-full z-10"
      }`}
    >
      <div className={`w-full py-3 flex flex-row items-center justify-between ${hasSearchButton ? "pl-6 pr-2" : "px-6"}`}>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-foreground">
            {title}
          </div>
          <div className={`text-sm ${isActive ? "text-foreground" : "text-muted"} truncate`}>
            {subtitle}
          </div>
        </div>
        
        {hasSearchButton && (
          <div className="ml-6 sm:ml-8 shrink-0 flex items-center">
            {searchButton}
          </div>
        )}
      </div>
    </div>
  );
}
