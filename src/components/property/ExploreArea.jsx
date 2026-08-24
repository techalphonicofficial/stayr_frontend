import { MapPin } from "lucide-react";
import Image from "next/image";

export default function ExploreArea({ location, nearbyPlaces }) {
  const attractions = nearbyPlaces && nearbyPlaces.length > 0 ? nearbyPlaces : [
    { name: "Scindia Ghat", distance: "14 min walk" },
    { name: "Shant Market", distance: "3 min drive" },
    { name: "Alamgir Mosque", distance: "4 min drive" },
    { name: "Varanasi Junction", distance: "30 min drive" }
  ];

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-[22px] font-bold text-foreground mb-6">Explore the area</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Map Placeholder */}
        <div className="w-full md:w-[60%] h-[250px] relative rounded-xl overflow-hidden bg-[#e5e3df] border border-gray-300">
          <div className="absolute inset-0 opacity-40 mix-blend-multiply" 
               style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          </div>
          {/* Map Pin UI */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center drop-shadow-md">
            <div className="bg-[#0050FF] text-white px-3 py-1.5 rounded-full font-bold text-[13px] shadow-lg">
              Exact location provided after booking
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#0050FF]"></div>
          </div>
          <div className="absolute bottom-3 right-3 bg-white/90 px-2 py-1 text-[10px] rounded text-gray-600 shadow-sm">
            Map data © StaticMap
          </div>
        </div>

        {/* Location Details */}
        <div className="w-full md:w-[40%] flex flex-col gap-5">
          <div className="flex gap-3">
            <MapPin size={20} className="text-foreground flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <h3 className="font-semibold text-foreground text-[15px]">{location || "Varanasi, Uttar Pradesh, India"}</h3>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            {attractions.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-[15px]">
                <span className="text-foreground">{item.name}</span>
                <span className="text-muted">{item.distance}</span>
              </div>
            ))}
          </div>

          <button className="text-[#0050FF] font-semibold text-left text-[15px] hover:underline mt-2">
            See more about this area {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
