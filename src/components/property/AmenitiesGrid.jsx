import { Wifi, Tv, Coffee, Wind, Car, Snowflake, MapPin, CheckCircle2, Home } from "lucide-react";

export default function AmenitiesGrid({ amenities = [] }) {
  if (!amenities || amenities.length === 0) return null;

  // Simple icon mapper based on amenity string matching
  const getIcon = (amenity) => {
    const name = typeof amenity === 'string' ? amenity : amenity.name;
    const lower = name.toLowerCase();
    if (lower.includes("wifi") || lower.includes("internet")) return <Wifi size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("tv")) return <Tv size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("kitchen")) return <Coffee size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("air") || lower.includes("ac")) return <Wind size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("park") || lower.includes("car")) return <Car size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("pool")) return <Snowflake size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("bath")) return <Home size={24} strokeWidth={1.5} className="text-foreground" />;
    if (lower.includes("wash") || lower.includes("dry")) return <CheckCircle2 size={24} strokeWidth={1.5} className="text-foreground" />;
    return <CheckCircle2 size={24} strokeWidth={1.5} className="text-foreground" />;
  };

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-[22px] font-bold text-foreground mb-6">Popular amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
        {amenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center gap-4">
            {getIcon(amenity)}
            <span className="text-foreground text-[15px]">
              {typeof amenity === 'string' ? amenity : amenity.name}
            </span>
          </div>
        ))}
      </div>
      {amenities.length > 6 && (
        <button className="mt-8 border border-foreground text-foreground bg-white hover:bg-gray-50 font-semibold py-2.5 px-6 rounded-lg transition">
          See all amenities
        </button>
      )}
    </div>
  );
}
