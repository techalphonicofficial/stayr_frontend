"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Calendar, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICE_CATEGORIES } from "@/data/services";

export default function ServiceSearch() {
  const [activePanel, setActivePanel] = useState(null);
  const searchRef = useRef(null);

  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState("");
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setActivePanel(null);
      }
    };
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') setActivePanel(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto relative z-30" ref={searchRef}>
      <div className="bg-white rounded-3xl md:rounded-full shadow-lg border border-border flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-border relative">
        
        {/* Location */}
        <div 
          className="w-full md:w-1/4 px-8 py-4 cursor-pointer hover:bg-secondary/50 rounded-t-3xl md:rounded-t-none md:rounded-l-full transition-colors"
          onClick={() => setActivePanel(activePanel === "location" ? null : "location")}
        >
          <div className="text-xs font-bold text-foreground">Location</div>
          <div className={`text-sm truncate ${location ? 'text-foreground font-medium' : 'text-muted'}`}>
            {location || "Where are you staying?"}
          </div>
        </div>

        {/* Date & Time */}
        <div 
          className="w-full md:w-1/4 px-8 py-4 cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => setActivePanel(activePanel === "datetime" ? null : "datetime")}
        >
          <div className="text-xs font-bold text-foreground">Date & Time</div>
          <div className={`text-sm truncate ${date ? 'text-foreground font-medium' : 'text-muted'}`}>
            {date && time ? `${date}, ${time}` : "When do you need it?"}
          </div>
        </div>

        {/* Service */}
        <div 
          className="w-full md:w-1/4 px-8 py-4 cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => setActivePanel(activePanel === "service" ? null : "service")}
        >
          <div className="text-xs font-bold text-foreground">Service</div>
          <div className={`text-sm truncate ${service ? 'text-foreground font-medium' : 'text-muted'}`}>
            {service || "What do you need?"}
          </div>
        </div>

        {/* Guests & Search Button */}
        <div 
          className="w-full md:w-1/4 pl-8 pr-3 py-3 cursor-pointer hover:bg-secondary/50 rounded-b-3xl md:rounded-b-none md:rounded-r-full transition-colors flex items-center justify-between"
          onClick={() => setActivePanel(activePanel === "guests" ? null : "guests")}
        >
          <div>
            <div className="text-xs font-bold text-foreground">Guests</div>
            <div className={`text-sm ${guests > 0 ? 'text-foreground font-medium' : 'text-muted'}`}>
              {guests > 0 ? `${guests} guest${guests > 1 ? 's' : ''}` : "How many?"}
            </div>
          </div>
          
          <button 
            className="bg-primary hover:bg-primary-hover text-white p-4 rounded-full transition flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              setActivePanel(null);
            }}
          >
            <Search className="w-5 h-5 text-foreground" strokeWidth={3} />
          </button>
        </div>

        {/* Dropdown Panels */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-xl border border-border p-8 z-50 overflow-hidden"
            >
              {activePanel === "location" && (
                <div>
                  <h3 className="text-lg font-bold mb-4 font-heading">Where are you staying?</h3>
                  <div className="flex items-center gap-3 border border-border rounded-xl p-3">
                    <MapPin className="text-muted w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Enter Stayr address or city" 
                      className="w-full outline-none text-foreground"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {activePanel === "datetime" && (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-4 font-heading flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" /> Date
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {["Today", "Tomorrow", "This Weekend", "Next Week"].map((d) => (
                        <button 
                          key={d}
                          onClick={() => setDate(d)}
                          className={`px-4 py-2 border rounded-full text-sm font-medium transition ${
                            date === d 
                              ? 'border-primary bg-primary/10 text-primary' 
                              : 'border-border hover:border-primary/50 text-foreground'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-4 font-heading flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" /> Time
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {["Morning", "Afternoon", "Evening", "Flexible"].map((t) => (
                        <button 
                          key={t}
                          onClick={() => { setTime(t); setActivePanel(null); }}
                          className={`px-4 py-2 border rounded-full text-sm font-medium transition ${
                            time === t 
                              ? 'border-primary bg-primary/10 text-primary' 
                              : 'border-border hover:border-primary/50 text-foreground'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activePanel === "service" && (
                <div>
                  <h3 className="text-lg font-bold mb-4 font-heading">What kind of service?</h3>
                  <div className="flex flex-wrap gap-3">
                    {SERVICE_CATEGORIES.map((cat) => (
                      <button 
                        key={cat.id}
                        onClick={() => { setService(cat.title); setActivePanel(null); }}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition ${
                          service === cat.title
                            ? 'border-primary bg-primary text-foreground' 
                            : 'border-border hover:border-primary/50 text-foreground'
                        }`}
                      >
                        <Sparkles className={`w-4 h-4 ${service === cat.title ? 'fill-foreground' : ''}`} />
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === "guests" && (
                <div>
                  <h3 className="text-lg font-bold mb-4 font-heading">For how many people?</h3>
                  <div className="flex items-center justify-between py-4 border-b border-border max-w-sm">
                    <div>
                      <div className="font-bold text-foreground">Guests</div>
                      <div className="text-sm text-muted">Include everyone needing the service</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted hover:border-foreground hover:text-foreground transition"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-medium">{guests}</span>
                      <button 
                        onClick={() => setGuests(guests + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted hover:border-foreground hover:text-foreground transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
