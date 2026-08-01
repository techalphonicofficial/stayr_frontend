"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INTERESTS = [
  "Food", "Culture", "Adventure", "Nature", 
  "Wellness", "Art", "Nightlife", "Photography", "Family"
];

export default function ExperienceSearch() {
  const [activePanel, setActivePanel] = useState(null);
  const searchRef = useRef(null);

  const [where, setWhere] = useState("");
  const [when, setWhen] = useState("");
  const [interests, setInterests] = useState([]);
  const [guests, setGuests] = useState(1);

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

  const toggleInterest = (interest) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-8 relative z-30 px-4 md:px-0" ref={searchRef}>
      <div className="bg-white rounded-full shadow-lg border border-border flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-border relative">
        
        {/* Where */}
        <div 
          className="w-full md:w-1/4 px-8 py-4 cursor-pointer hover:bg-secondary/50 rounded-t-full md:rounded-l-full md:rounded-tr-none transition-colors"
          onClick={() => setActivePanel(activePanel === "where" ? null : "where")}
        >
          <div className="text-xs font-bold text-foreground">Where</div>
          <div className={`text-sm ${where ? 'text-foreground font-medium' : 'text-muted'}`}>
            {where || "Search destinations"}
          </div>
        </div>

        {/* When */}
        <div 
          className="w-full md:w-1/4 px-8 py-4 cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => setActivePanel(activePanel === "when" ? null : "when")}
        >
          <div className="text-xs font-bold text-foreground">When</div>
          <div className={`text-sm ${when ? 'text-foreground font-medium' : 'text-muted'}`}>
            {when || "Add dates"}
          </div>
        </div>

        {/* Interests */}
        <div 
          className="w-full md:w-1/4 px-8 py-4 cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => setActivePanel(activePanel === "interests" ? null : "interests")}
        >
          <div className="text-xs font-bold text-foreground">Interests</div>
          <div className={`text-sm truncate ${interests.length > 0 ? 'text-foreground font-medium' : 'text-muted'}`}>
            {interests.length > 0 ? interests.join(", ") : "Add interests"}
          </div>
        </div>

        {/* Guests & Search Button */}
        <div 
          className="w-full md:w-1/4 pl-8 pr-3 py-3 cursor-pointer hover:bg-secondary/50 rounded-b-full md:rounded-r-full md:rounded-bl-none transition-colors flex items-center justify-between"
          onClick={() => setActivePanel(activePanel === "guests" ? null : "guests")}
        >
          <div>
            <div className="text-xs font-bold text-foreground">Who</div>
            <div className={`text-sm ${guests > 0 ? 'text-foreground font-medium' : 'text-muted'}`}>
              {guests > 0 ? `${guests} guest${guests > 1 ? 's' : ''}` : "Add guests"}
            </div>
          </div>
          
          <button 
            className="bg-primary hover:bg-primary-hover text-white p-4 rounded-full transition flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              // Implement search logic here
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
              {activePanel === "where" && (
                <div>
                  <h3 className="text-lg font-bold mb-4 font-heading">Search destinations</h3>
                  <div className="flex items-center gap-3 border border-border rounded-xl p-3">
                    <MapPin className="text-muted w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="e.g. Goa, New Delhi" 
                      className="w-full outline-none text-foreground"
                      value={where}
                      onChange={(e) => setWhere(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {activePanel === "when" && (
                <div>
                  <h3 className="text-lg font-bold mb-4 font-heading">When are you going?</h3>
                  <div className="flex gap-4">
                    {["Any weekend", "This weekend", "Next weekend", "Anytime"].map((option) => (
                      <button 
                        key={option}
                        onClick={() => { setWhen(option); setActivePanel(null); }}
                        className={`px-4 py-2 border rounded-full text-sm font-medium transition ${
                          when === option 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-border hover:border-primary/50 text-foreground'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === "interests" && (
                <div>
                  <h3 className="text-lg font-bold mb-4 font-heading">What are you looking for?</h3>
                  <div className="flex flex-wrap gap-3">
                    {INTERESTS.map((interest) => (
                      <button 
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition ${
                          interests.includes(interest)
                            ? 'border-primary bg-primary text-foreground' 
                            : 'border-border hover:border-primary/50 text-foreground'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${interests.includes(interest) ? 'fill-foreground' : ''}`} />
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === "guests" && (
                <div>
                  <h3 className="text-lg font-bold mb-4 font-heading">Who&apos;s coming?</h3>
                  <div className="flex items-center justify-between py-4 border-b border-border max-w-sm">
                    <div>
                      <div className="font-bold text-foreground">Guests</div>
                      <div className="text-sm text-muted">Ages 2 or above</div>
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
