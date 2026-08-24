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
    <div className="w-full border-b border-border bg-background sticky top-[114px] md:top-[80px] z-40 py-4">
      <Container>
        <div className="flex flex-row items-center gap-4 overflow-x-auto scrollbar-hide">
          {/* Main Filters Button */}
          <button className="flex-shrink-0 flex items-center gap-2 border border-foreground rounded-full px-5 py-2 hover:bg-gray-50 transition">
            <SlidersHorizontal size={16} className="text-foreground" />
            <span className="text-foreground font-semibold text-sm">Filters</span>
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
                    ? "border-foreground bg-foreground text-white font-semibold"
                    : "border-border text-muted hover:border-foreground hover:text-foreground"
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
