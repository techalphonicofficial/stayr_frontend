"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import SearchSection from "./search/SearchSection";
import DestinationPanel from "./search/DestinationPanel";
import DatePanel from "./search/DatePanel";
import GuestPanel from "./search/GuestPanel";

export default function SearchMenu({ isExpanded = false, animateLayout = true, onExpand, onClose, defaultActivePanel = null }) {
  const containerLayoutId = animateLayout ? "search-container" : undefined;
  const buttonLayoutId = animateLayout ? "search-button" : undefined;
  
  const [activePanel, setActivePanel] = useState(defaultActivePanel);
  const [hoveredSection, setHoveredSection] = useState(null);
  
  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0 });

  const menuRef = useRef(null);

  // Close panels on click outside or escape key & handle body scroll lock
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActivePanel(null);
        if (onClose) onClose();
      }
    };
    
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setActivePanel(null);
        if (onClose) onClose();
      }
    };

    if (activePanel) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [activePanel]);

  // If navbar collapses, ensure panels close
  useEffect(() => {
    if (!isExpanded) {
      setActivePanel(null);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded && defaultActivePanel && !activePanel) {
      setActivePanel(defaultActivePanel);
    }
  }, [isExpanded, defaultActivePanel]);

  const updateGuests = (type, value) => {
    setGuests(prev => ({ ...prev, [type]: value }));
  };

  const guestCount = guests.adults + guests.children;
  const guestText = guestCount > 0 
    ? `${guestCount} guest${guestCount > 1 ? 's' : ''}${guests.infants ? `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}` : ''}`
    : "Add guests";

  const morphTransition = { duration: 0.35, ease: "easeInOut" };

  if (isExpanded) {
    return (
      <div ref={menuRef} className="relative z-50">
        {/* Background Overlay (dimmer) when a panel is open */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-[-1]"
              onClick={() => {
                setActivePanel(null);
                if (onClose) onClose();
              }}
            />
          )}
        </AnimatePresence>

        <motion.div 
          layoutId={containerLayoutId}
          transition={morphTransition}
          className={`flex flex-row items-center border rounded-full relative origin-center transition-colors duration-200 ${
            activePanel ? "bg-[#EBEBEB] border-transparent" : "bg-white border-[#EFE7D8] shadow-lg"
          }`}
          style={{ width: "850px", maxWidth: "100%" }}
        >
          {/* Where */}
          <SearchSection 
            id="where"
            title="Where"
            subtitle="Search destinations"
            isActive={activePanel === "where"}
            isHovered={hoveredSection === "where"}
            onHover={() => setHoveredSection("where")}
            onHoverEnd={() => setHoveredSection(null)}
            onClick={() => setActivePanel(activePanel === "where" ? null : "where")}
            className="flex-[1.5]"
          />
          <div className="w-[1px] h-10 bg-[#EFE7D8] z-0"></div>

          {/* Check in */}
          <SearchSection 
            id="checkin"
            title="Check in"
            subtitle="Add dates"
            isActive={activePanel === "checkin"}
            isHovered={hoveredSection === "checkin"}
            onHover={() => setHoveredSection("checkin")}
            onHoverEnd={() => setHoveredSection(null)}
            onClick={() => setActivePanel(activePanel === "checkin" ? null : "checkin")}
            className="flex-1"
          />
          <div className="w-[1px] h-10 bg-[#EFE7D8] z-0"></div>

          {/* Check out */}
          <SearchSection 
            id="checkout"
            title="Check out"
            subtitle="Add dates"
            isActive={activePanel === "checkout"}
            isHovered={hoveredSection === "checkout"}
            onHover={() => setHoveredSection("checkout")}
            onHoverEnd={() => setHoveredSection(null)}
            onClick={() => setActivePanel(activePanel === "checkout" ? null : "checkout")}
            className="flex-1"
          />
          <div className="w-[1px] h-10 bg-[#EFE7D8] z-0"></div>

          {/* Who */}
          <SearchSection 
            id="who"
            title="Who"
            subtitle={guestText}
            isActive={activePanel === "who"}
            isHovered={hoveredSection === "who"}
            onHover={() => setHoveredSection("who")}
            onHoverEnd={() => setHoveredSection(null)}
            onClick={() => setActivePanel(activePanel === "who" ? null : "who")}
            className="flex-[1.5]"
            hasSearchButton={true}
            searchButton={
              <motion.button 
                layoutId={buttonLayoutId}
                layout
                transition={morphTransition}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePanel(null); // Execute search
                  if (onClose) onClose();
                }}
                className={`h-12 bg-[#E8B65B] hover:bg-[#D89C2B] rounded-full text-white transition-all duration-200 flex items-center justify-center shadow-md flex-shrink-0 z-30 overflow-hidden ${
                  activePanel ? "w-[120px]" : "w-12"
                }`}
              >
                <Search size={20} strokeWidth={3} className="flex-shrink-0" />
                <AnimatePresence>
                  {activePanel && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      className="font-bold whitespace-nowrap overflow-hidden"
                    >
                      Search
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            }
          />
        </motion.div>

        {/* Floating Dropdown Panels */}
        <AnimatePresence>
          {activePanel === "where" && <DestinationPanel key="panel-where" />}
          {(activePanel === "checkin" || activePanel === "checkout") && <DatePanel key="panel-date" />}
          {activePanel === "who" && <GuestPanel key="panel-who" guests={guests} updateGuests={updateGuests} />}
        </AnimatePresence>

      </div>
    );
  }

  // Collapsed State
  return (
    <motion.div 
      layoutId={containerLayoutId}
      transition={morphTransition}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="border border-[#EFE7D8] w-full md:w-auto py-2 px-2 rounded-full shadow-sm hover:shadow-md transition-colors transition-shadow cursor-pointer bg-white origin-center relative z-50"
      onClick={onExpand}
    >
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className="flex flex-row items-center justify-between w-full h-full"
      >
        <div className="text-sm font-semibold pl-4 pr-6 text-[#2B2B2B] whitespace-nowrap">
          Anywhere
        </div>
        <div className="hidden sm:block text-sm font-semibold px-6 border-x border-[#EFE7D8] flex-1 text-center text-[#2B2B2B] whitespace-nowrap">
          Any week
        </div>
        <div className="text-sm pl-6 text-[#7B7468] flex flex-row items-center gap-3 whitespace-nowrap">
          <div className="hidden sm:block">{guestText}</div>
          <motion.div 
            layoutId={buttonLayoutId}
            layout
            transition={morphTransition}
            className="w-8 h-8 bg-[#E8B65B] hover:bg-[#D89C2B] rounded-full text-white transition-colors transition-shadow flex items-center justify-center shadow-md origin-center flex-shrink-0"
          >
            <Search size={14} strokeWidth={3} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
