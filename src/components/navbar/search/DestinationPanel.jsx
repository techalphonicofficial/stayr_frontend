"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Sparkles, Building2, Search, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { propertyApi } from "@/lib/api";

const POPULAR_DESTINATIONS = [
  {
    id: 1,
    name: "Noida",
    desc: "Popular destination",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Goa",
    desc: "Trending now",
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Mumbai",
    desc: "City escapes",
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Manali",
    desc: "Mountain retreats",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "Jaipur",
    desc: "Heritage walks",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 6,
    name: "Kerala",
    desc: "Tropical paradise",
    img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 7,
    name: "Udaipur",
    desc: "City of lakes",
    img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 8,
    name: "Lonavala",
    desc: "Nature & hills",
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80"
  }
];

export default function DestinationPanel({
  searchQuery = "",
  onSelect,
  onPropertySelect,
  onSearchAll
}) {
  const [liveData, setLiveData] = useState({ suggestions: [], properties: [] });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const q = (searchQuery || "").trim();
    if (!q || q.length < 2) {
      setLiveData({ suggestions: [], properties: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await propertyApi.getLiveSuggestions(q, 4);
        if (res && res.success) {
          setLiveData({
            suggestions: res.suggestions || [],
            properties: res.properties || []
          });
        }
      } catch (err) {
        console.error("Live vector search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const hasLiveResults = liveData.suggestions.length > 0 || liveData.properties.length > 0;
  const isTyping = (searchQuery || "").trim().length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`absolute top-[120%] left-0 bg-white rounded-3xl shadow-[0_16px_36px_rgba(0,0,0,0.18)] border border-border z-50 origin-top-left overflow-hidden transition-all duration-300 ${
        isTyping ? "w-full md:w-[500px]" : "w-full md:w-[340px]"
      }`}
    >
      <div className="max-h-[65vh] overflow-y-auto p-4 md:p-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* ============================================================= */}
        {/* VIEW 1: LIVE AI VECTOR SEARCH RESULTS (When typing)           */}
        {/* ============================================================= */}
        {isTyping ? (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF385C] flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>AI Vector Search Results</span>
              </span>
              {isSearching && (
                <span className="text-[10px] text-gray-400 animate-pulse font-medium">
                  Semantic matching...
                </span>
              )}
            </div>

            {/* Smart Semantic Query Suggestions */}
            {liveData.suggestions.length > 0 && (
              <div className="mb-4 space-y-1">
                {liveData.suggestions.map((sug, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (onSearchAll) onSearchAll(sug.query);
                      else if (onSelect) onSelect(sug.query);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-50 cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#EFE7D8] text-[#FF385C] flex items-center justify-center shrink-0">
                        <Search size={14} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900 group-hover:text-[#FF385C] transition">
                          {sug.title}
                        </span>
                        <span className="text-[10px] text-gray-500 block">
                          {sug.subtitle}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={13} className="text-gray-400 group-hover:text-[#FF385C] transition group-hover:translate-x-0.5" />
                  </div>
                ))}
              </div>
            )}

            {/* Live Matched Property Previews */}
            {liveData.properties.length > 0 ? (
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1">
                  Top Matched Properties
                </span>
                {liveData.properties.map((prop) => (
                  <div
                    key={prop.id}
                    onClick={() => {
                      if (onPropertySelect) onPropertySelect(prop);
                      else if (onSelect) onSelect(prop.city);
                    }}
                    className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer transition group"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-gray-900 truncate group-hover:text-[#FF385C] transition">
                          {prop.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 shrink-0 border border-emerald-200">
                          {prop.matchConfidence || "99% Match"}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 block truncate">
                        {prop.city} • {prop.category}
                      </span>
                      <span className="text-xs font-bold text-gray-900 block mt-0.5">
                        ₹{Number(prop.pricePerNight).toLocaleString("en-IN")}{" "}
                        <span className="text-[10px] font-normal text-gray-500">/ night</span>
                      </span>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => onSearchAll && onSearchAll(searchQuery)}
                  className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>View all matching results for &ldquo;{searchQuery}&rdquo;</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : !isSearching ? (
              <div className="py-6 text-center text-xs text-gray-500">
                <p className="font-semibold text-gray-800">
                  Search &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-[11px] mt-1 text-gray-400">
                  Press Enter or click Search to explore all matching stays
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          /* ============================================================= */
          /* VIEW 2: RECENT & SUGGESTED (When input is empty)              */
          /* ============================================================= */
          <div>
            {/* Recent Searches */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-foreground uppercase mb-2">
                Recent searches
              </h3>
              <div
                onClick={() => onSelect && onSelect("Noida")}
                className="flex items-center gap-3.5 p-2 -ml-2 rounded-xl hover:bg-[#F5F5F5] cursor-pointer transition"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Noida / NCR</div>
                  <div className="text-[11px] text-muted">Any week • Stays & villas</div>
                </div>
              </div>
            </div>

            {/* Suggested Destinations */}
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase mb-3">
                Suggested destinations
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <div
                    key={dest.id}
                    onClick={() => onSelect && onSelect(dest.name)}
                    className="flex flex-col gap-1.5 p-1.5 -ml-1 rounded-xl hover:bg-[#F5F5F5] cursor-pointer transition group"
                  >
                    <div className="w-full aspect-[16/10] rounded-xl overflow-hidden relative border border-transparent group-hover:border-[#FF385C] group-hover:shadow-sm transition-all duration-300">
                      <Image
                        src={dest.img}
                        alt={dest.name}
                        fill
                        sizes="(max-width: 768px) 150px, 160px"
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-[#FF385C] transition">
                        {dest.name}
                      </div>
                      <div className="text-[10px] text-muted">{dest.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
