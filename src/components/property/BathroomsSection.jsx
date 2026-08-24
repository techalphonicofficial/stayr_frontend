import { Bath } from "lucide-react";

export default function BathroomsSection({ bathroomsList = [], bathroomsCount }) {
  if (!bathroomsList || bathroomsList.length === 0) return null;

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-[22px] font-bold text-foreground mb-6">{bathroomsCount} bathrooms</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6">
        {bathroomsList.map((bathroom, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <h3 className="font-semibold text-foreground text-[15px]">{bathroom.name}</h3>
            <div className="flex flex-col gap-1.5 mt-1">
              <Bath size={24} strokeWidth={1.5} className="text-foreground mb-1" />
              <div className="flex flex-wrap gap-1 text-muted text-[13px]">
                {bathroom.amenities.map((amenity, aIdx) => (
                  <span key={aIdx}>
                    {amenity}{aIdx < bathroom.amenities.length - 1 ? " · " : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
