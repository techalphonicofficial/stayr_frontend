import { SlidersHorizontal } from "lucide-react";
import Container from "../common/Container";

export const FILTERS = [
  "Free parking",
  "Self check-in",
  "Wifi",
  "Air conditioning",
  "1+ bathrooms",
  "TV",
  "Kitchen",
  "Washing machine",
  "Allows pets",
];

export default function FilterBar({ activeFilters = [], onToggleFilter }) {
  return (
    <div className="w-full border-b border-[#EFE7D8] bg-[#FFFDF8] sticky top-[72px] md:top-[64px] z-40 py-4">
      <Container>
        <div className="flex flex-row items-center gap-4 overflow-x-auto scrollbar-hide">
          {/* Main Filters Button */}
          <button className="flex-shrink-0 flex items-center gap-2 border border-[#2B2B2B] rounded-full px-5 py-2 hover:bg-gray-50 transition">
            <SlidersHorizontal size={16} className="text-[#2B2B2B]" />
            <span className="text-[#2B2B2B] font-semibold text-sm">Filters</span>
          </button>

          {/* Individual Filter Pills */}
          {FILTERS.map((filter, index) => {
            const isActive = activeFilters.includes(filter);
            return (
              <button
                key={index}
                onClick={() => onToggleFilter && onToggleFilter(filter)}
                className={`flex-shrink-0 border rounded-full px-5 py-2 transition text-sm ${
                  isActive 
                    ? "border-[#2B2B2B] bg-[#2B2B2B] text-white font-semibold"
                    : "border-[#EFE7D8] text-[#7B7468] hover:border-[#2B2B2B] hover:text-[#2B2B2B]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
