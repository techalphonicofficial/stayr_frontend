import { Utensils, Monitor, Wind, Coffee, TreePine, Sun, BedDouble, Bed } from "lucide-react";
import { useState } from "react";
import PropertyModal from "./PropertyModal";

export default function SpacesSection({ spaces = [], property }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!spaces || spaces.length === 0) return null;

  const getSpaceName = (space) => typeof space === 'string' ? space : (space?.name || '');

  const getSpaceIcon = (spaceName) => {
    const s = spaceName.toLowerCase();
    if (s.includes("kitchen")) return <Coffee size={20} strokeWidth={1.5} className="text-foreground" />;
    if (s.includes("dining")) return <Utensils size={20} strokeWidth={1.5} className="text-foreground" />;
    if (s.includes("living")) return <Monitor size={20} strokeWidth={1.5} className="text-foreground" />;
    if (s.includes("balcony")) return <Wind size={20} strokeWidth={1.5} className="text-foreground" />;
    if (s.includes("garden")) return <TreePine size={20} strokeWidth={1.5} className="text-foreground" />;
    if (s.includes("patio")) return <Sun size={20} strokeWidth={1.5} className="text-foreground" />;
    return <Utensils size={20} strokeWidth={1.5} className="text-foreground" />;
  };

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-[22px] font-bold text-foreground mb-6">Spaces</h2>

      <div className="flex flex-col gap-4 mb-4">
        {spaces.map((space, idx) => {
          const spaceName = getSpaceName(space);
          return (
            <div key={idx} className="flex items-center gap-3 text-foreground text-[15px]">
              {getSpaceIcon(spaceName)}
              <span>{spaceName}</span>
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="text-[#0050FF] font-semibold text-[15px] hover:underline"
      >
        See all rooms and beds details {">"}
      </button>

      <PropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Rooms & beds"
      >
        <div className="flex flex-col">
          {/* Bedrooms */}
          {property?.roomsAndBeds?.bedrooms && (
            <div className="py-6 border-b border-gray-200 first:pt-0">
              <h3 className="font-semibold text-foreground text-[15px] mb-4">
                {property.bedrooms} bedrooms <span className="font-normal text-muted">(sleeps {property.guests || property.maxGuests})</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {property.roomsAndBeds.bedrooms.map((room, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <span className="font-semibold text-foreground text-[14px]">{room.name}</span>
                    {room.beds.map((bedItem, bedIdx) => {
                      const bed = typeof bedItem === 'string' ? bedItem : `${bedItem.count || 1} ${bedItem.type || 'Bed'}`;
                      return (
                        <div key={bedIdx} className="flex items-center gap-2 text-muted text-[13px]">
                          {bed.toLowerCase().includes("king") || bed.toLowerCase().includes("queen") ? (
                            <BedDouble size={18} strokeWidth={1.5} className="text-foreground" />
                          ) : (
                            <Bed size={18} strokeWidth={1.5} className="text-foreground" />
                          )}
                          <span>{bed}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bathrooms */}
          {property?.roomsAndBeds?.bathrooms && (
            <div className="py-6 border-b border-gray-200">
              <h3 className="font-semibold text-foreground text-[15px] mb-4">
                {property.bathrooms} bathrooms
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {property.roomsAndBeds.bathrooms.map((bath, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <span className="font-semibold text-foreground text-[14px]">{bath.name}</span>
                    <div className="flex flex-col text-muted text-[13px]">
                      {bath.amenities.map((amenity, aIdx) => (
                        <span key={aIdx}>{amenity}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spaces */}
          <div className="py-6 border-b border-gray-200 border-b-0 pb-0">
            <h3 className="font-semibold text-foreground text-[15px] mb-4">
              Spaces
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              {spaces.map((space, idx) => {
                const spaceName = getSpaceName(space);
                return (
                  <div key={idx} className="flex items-center gap-3 text-foreground text-[14px]">
                    {getSpaceIcon(spaceName)}
                    <span className="font-medium">{spaceName}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </PropertyModal>
    </div>
  );
}
