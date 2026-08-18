import { Utensils, Monitor, Wind, Coffee, TreePine, Sun, BedDouble, Bed } from "lucide-react";
import { useState } from "react";
import PropertyModal from "./PropertyModal";

export default function SpacesSection({ spaces = [], property }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!spaces || spaces.length === 0) return null;

  const getSpaceIcon = (space) => {
    const s = space.toLowerCase();
    if (s.includes("kitchen")) return <Coffee size={20} strokeWidth={1.5} className="text-[#2B2B2B]" />;
    if (s.includes("dining")) return <Utensils size={20} strokeWidth={1.5} className="text-[#2B2B2B]" />;
    if (s.includes("living")) return <Monitor size={20} strokeWidth={1.5} className="text-[#2B2B2B]" />;
    if (s.includes("balcony")) return <Wind size={20} strokeWidth={1.5} className="text-[#2B2B2B]" />;
    if (s.includes("garden")) return <TreePine size={20} strokeWidth={1.5} className="text-[#2B2B2B]" />;
    if (s.includes("patio")) return <Sun size={20} strokeWidth={1.5} className="text-[#2B2B2B]" />;
    return <Utensils size={20} strokeWidth={1.5} className="text-[#2B2B2B]" />;
  };

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-[22px] font-bold text-[#2B2B2B] mb-6">Spaces</h2>

      <div className="flex flex-col gap-4 mb-4">
        {spaces.map((space, idx) => (
          <div key={idx} className="flex items-center gap-3 text-[#2B2B2B] text-[15px]">
            {getSpaceIcon(space)}
            <span>{space}</span>
          </div>
        ))}
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
          {property?.rooms && (
            <div className="py-6 border-b border-gray-200 first:pt-0">
              <h3 className="font-semibold text-[#2B2B2B] text-[15px] mb-4">
                {property.bedrooms} bedrooms <span className="font-normal text-[#7B7468]">(sleeps {property.guests})</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {property.rooms.map((room, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <span className="font-semibold text-[#2B2B2B] text-[14px]">{room.name}</span>
                    {room.beds.map((bed, bedIdx) => (
                      <div key={bedIdx} className="flex items-center gap-2 text-[#7B7468] text-[13px]">
                        {bed.toLowerCase().includes("king") || bed.toLowerCase().includes("queen") ? (
                          <BedDouble size={18} strokeWidth={1.5} className="text-[#2B2B2B]" />
                        ) : (
                          <Bed size={18} strokeWidth={1.5} className="text-[#2B2B2B]" />
                        )}
                        <span>{bed}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bathrooms */}
          {property?.bathroomsList && (
            <div className="py-6 border-b border-gray-200">
              <h3 className="font-semibold text-[#2B2B2B] text-[15px] mb-4">
                {property.bathrooms} bathrooms
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {property.bathroomsList.map((bath, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <span className="font-semibold text-[#2B2B2B] text-[14px]">{bath.name}</span>
                    <div className="flex flex-col text-[#7B7468] text-[13px]">
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
            <h3 className="font-semibold text-[#2B2B2B] text-[15px] mb-4">
              Spaces
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              {spaces.map((space, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[#2B2B2B] text-[14px]">
                  <span>{space}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </PropertyModal>
    </div>
  );
}
