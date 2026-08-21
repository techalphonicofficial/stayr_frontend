import { BedDouble, Bed } from "lucide-react";

export default function RoomsAndBeds({ rooms = [], bedrooms, guests }) {
  if (!rooms || rooms.length === 0) return null;

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-[22px] font-bold text-[#2B2B2B] mb-2">Rooms & beds</h2>
      <p className="text-[15px] text-[#2B2B2B] font-semibold mb-6">
        {bedrooms} bedrooms <span className="text-[#7B7468] font-normal">(sleeps {guests})</span>
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6">
        {rooms.map((room, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <h3 className="font-semibold text-[#2B2B2B] text-[15px]">{room.name}</h3>
            <div className="flex flex-col gap-1.5 mt-1">
              {room.beds.map((bedItem, bedIdx) => {
                const bed = typeof bedItem === 'string' ? bedItem : `${bedItem.count || 1} ${bedItem.type || 'Bed'}`;
                return (
                  <div key={bedIdx} className="flex items-center gap-2 text-[#7B7468] text-[14px]">
                    {bed.toLowerCase().includes("king") || bed.toLowerCase().includes("queen") ? (
                      <BedDouble size={20} strokeWidth={1.5} className="text-[#2B2B2B]" />
                    ) : (
                      <Bed size={20} strokeWidth={1.5} className="text-[#2B2B2B]" />
                    )}
                    <span>{bed}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
