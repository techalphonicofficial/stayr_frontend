"use client";

import { 
  Building2, 
  ShieldCheck, 
  Train, 
  Plane, 
  GraduationCap, 
  HeartPulse, 
  ShoppingBag, 
  Car, 
  Zap, 
  Droplet, 
  Layers, 
  Compass, 
  CheckCircle2 
} from "lucide-react";

export default function BuildingCommuteSection({ listing = {} }) {
  const city = listing.city || "Noida";
  const locality = listing.locality || listing.city;

  const commutePoints = [
    {
      title: "Metro / Rapid Transit Station",
      distance: "800 m - 1.5 km",
      time: "3 - 5 mins drive",
      icon: Train,
      badge: "Walkable / Near"
    },
    {
      title: "Expressway / Arterial Highway",
      distance: "1.2 km",
      time: "4 - 6 mins drive",
      icon: Car,
      badge: "Direct Access"
    },
    {
      title: "International Airport",
      distance: "32 km - 45 km",
      time: "30 - 40 mins via express link",
      icon: Plane,
      badge: "Fast Corridor"
    },
    {
      title: "Multi-Speciality Hospital",
      distance: "2.5 km",
      time: "8 - 10 mins drive",
      icon: HeartPulse,
      badge: "24/7 Trauma"
    },
    {
      title: "Top International School / University",
      distance: "2.8 km",
      time: "7 - 12 mins drive",
      icon: GraduationCap,
      badge: "IB / CBSE"
    },
    {
      title: "Premium Mall & High-Street Retail",
      distance: "3.5 km",
      time: "10 - 15 mins drive",
      icon: ShoppingBag,
      badge: "Luxury Retail"
    }
  ];

  const structuralSpecs = [
    {
      title: "Earthquake-Resistant RCC Structure",
      desc: "Built to Seismic Zone IV/V specifications with high-grade Fe-500D steel and ready-mix concrete framing."
    },
    {
      title: "3-Tier Gated Security Protocol",
      desc: "Boom barrier RFID vehicle entry, round-the-clock IP CCTV monitoring, and digital video door phones."
    },
    {
      title: "100% Silent DG Power Backup",
      desc: "Uninterrupted 24/7 electrical supply for all internal lights, fans, climate control, and common lifts."
    },
    {
      title: "Eco-Friendly Water & Energy",
      desc: "Rainwater harvesting percolation pits, solar perimeter illumination, and dedicated EV charging stations."
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF385C] mb-3">
        <Building2 size={16} />
        <span>Building Specifications & Neighborhood Matrix</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-gray-950 mb-2">
        Infrastructure, Security & Commute Times
      </h2>
      <p className="text-xs text-gray-500 mb-6 font-light leading-relaxed">
        Engineered construction durability paired with seamless proximity to civic essentials in {locality}.
      </p>

      {/* Structural Standards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {structuralSpecs.map((spec, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]/80 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-white border border-[#EFE7D8] text-[#FF385C] flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-gray-900 mb-1">{spec.title}</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed font-light">{spec.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Commute Time Matrix */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
          Neighborhood Commute Matrix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {commutePoints.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-800 flex items-center justify-center shrink-0 shadow-xs">
                  <Icon size={18} className="text-[#FF385C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-gray-900 truncate">{pt.title}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                    <span className="font-semibold text-gray-800">{pt.time}</span>
                    <span>•</span>
                    <span>{pt.distance}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

