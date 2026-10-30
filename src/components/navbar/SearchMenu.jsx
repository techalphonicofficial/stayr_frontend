"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence, useTransform, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useRouter } from "next/navigation";

import SearchSection from "./search/SearchSection";
import DestinationPanel from "./search/DestinationPanel";
import DatePanel from "./search/DatePanel";
import GuestPanel from "./search/GuestPanel";

export default function SearchMenu({
  progress = null,
  isExpanded = false,
  isSearchOverride = false,
  onExpand,
  onClose,
  defaultActivePanel = null,
}) {
  const fallbackProgress = useMotionValue(0);
  const activeProgress = progress || fallbackProgress;

  const [activePanel, setActivePanel] = useState(defaultActivePanel);
  const [hoveredSection, setHoveredSection] = useState(null);

  const [location, setLocation] = useState("");
  const router = useRouter();

  const [guests, setGuests] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const formatDate = (date) => {
    if (!date) return "Add dates";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const menuRef = useRef(null);

  // Close panels on click outside or escape key & handle body scroll lock
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActivePanel(null);
      }
    };

    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setActivePanel(null);
        if (onClose) onClose();
      }
    };

    if (activePanel) {
      if (!progress) {
        document.body.style.overflow = "hidden";
      }
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
  }, [activePanel, onClose]);

  useEffect(() => {
    if (defaultActivePanel && activePanel !== defaultActivePanel) {
      setActivePanel(defaultActivePanel);
    } else if (!isSearchOverride && progress && progress.get() > 0.3 && activePanel !== null) {
      setActivePanel(null);
    }
  }, [defaultActivePanel, isSearchOverride, progress, activePanel]);

  // When scrolling down in desktop mode, close any open panel
  useMotionValueEvent(activeProgress, "change", (latest) => {
    if (progress && latest > 0.08 && activePanel && !isSearchOverride) {
      setActivePanel(null);
    }
  });

  const updateGuests = (type, value) => {
    setGuests((prev) => ({ ...prev, [type]: value }));
  };

  const guestCount = guests.adults + guests.children;
  const guestText =
    guestCount > 0
      ? `${guestCount} guest${guestCount > 1 ? "s" : ""}${
          guests.infants ? `, ${guests.infants} infant${guests.infants > 1 ? "s" : ""}` : ""
        }`
      : "Add guests";

  // Desktop Scroll-Driven Transforms
  // Interpolating directly from progress (0 = expanded, 1 = compact)
  const searchLeft = useTransform(activeProgress, [0, 1], ["calc(50% + 55px)", "calc(50% + 20px)"]);
  const searchWidth = useTransform(activeProgress, [0, 1], ["850px", "390px"]);
  const searchHeight = useTransform(activeProgress, [0, 1], ["66px", "48px"]);
  const searchTop = useTransform(activeProgress, [0, 1], ["86px", "16px"]);
  const searchShadow = useTransform(
    activeProgress,
    [0, 1],
    ["0 6px 20px rgba(0,0,0,0.08)", "0 2px 8px rgba(0,0,0,0.08)"]
  );

  const expandedOpacity = useTransform(activeProgress, [0, 0.35], [1, 0]);
  const expandedScale = useTransform(activeProgress, [0, 0.35], [1, 0.95]);
  const expandedPointerEvents = useTransform(activeProgress, (p) =>
    p > 0.3 ? "none" : "auto"
  );

  const compactOpacity = useTransform(activeProgress, [0.45, 0.85], [0, 1]);
  const compactScale = useTransform(activeProgress, [0.45, 0.85], [0.92, 1]);
  const compactPointerEvents = useTransform(activeProgress, (p) =>
    p < 0.5 ? "none" : "auto"
  );

  // If used on Mobile (no progress motion value passed)
  if (!progress) {
    if (isExpanded) {
      return (
        <div ref={menuRef} className="relative z-50 p-4 bg-white rounded-3xl">
          <div className="flex flex-col gap-2">
            <SearchSection
              id="where"
              title="Where"
              subtitle={
                activePanel === "where" ? (
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search destinations"
                    className="bg-transparent outline-none w-full text-sm text-foreground placeholder:text-muted"
                    autoFocus
                  />
                ) : (
                  location || "Search destinations"
                )
              }
              isActive={activePanel === "where"}
              onClick={() => setActivePanel("where")}
            />
            <div className="w-full h-[1px] bg-border my-1"></div>
            <SearchSection
              id="when"
              title="When"
              subtitle={
                dateRange.start && dateRange.end
                  ? `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`
                  : dateRange.start
                  ? formatDate(dateRange.start)
                  : "Add dates"
              }
              isActive={activePanel === "when"}
              onClick={() => setActivePanel("when")}
            />
            <div className="w-full h-[1px] bg-border my-1"></div>
            <SearchSection
              id="who"
              title="Who"
              subtitle={guestText}
              isActive={activePanel === "who"}
              onClick={() => setActivePanel("who")}
              hasSearchButton={true}
              searchButton={
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePanel(null);
                    if (onClose) onClose();
                    router.push(`/s/${location || "Anywhere"}/homes`);
                  }}
                  className="h-10 px-4 bg-primary text-white rounded-full font-bold text-sm flex items-center gap-2"
                >
                  <Search size={16} strokeWidth={3} />
                  <span>Search</span>
                </button>
              }
            />
          </div>

          <AnimatePresence>
            {activePanel === "where" && (
              <DestinationPanel
                key="panel-where"
                onSelect={(dest) => {
                  setLocation(dest);
                  setActivePanel("when");
                }}
              />
            )}
            {activePanel === "when" && (
              <DatePanel
                key="panel-date"
                dateRange={dateRange}
                onDateRangeChange={(range) => setDateRange(range)}
              />
            )}
            {activePanel === "who" && (
              <GuestPanel key="panel-who" guests={guests} updateGuests={updateGuests} />
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <div
        className="border border-border w-full py-2 px-3 rounded-full shadow-sm cursor-pointer bg-white"
        onClick={() => onExpand && onExpand("where")}
      >
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-sm font-semibold pl-2 text-foreground">{location || "Anywhere"}</div>
          <div className="w-8 h-8 bg-primary rounded-full text-white flex items-center justify-center">
            <Search size={14} strokeWidth={3} />
          </div>
        </div>
      </div>
    );
  }

  // DESKTOP MORPHING UNIFIED SEARCH BAR
  return (
    <div ref={menuRef} className="contents">
      {/* The Single Physical Morphing Search Pill */}
      <motion.div
        style={{
          left: searchLeft,
          top: searchTop,
          width: searchWidth,
          height: searchHeight,
          boxShadow: searchShadow,
        }}
        onClick={(e) => {
          if (progress && progress.get() > 0.4) {
            e.stopPropagation();
            if (onExpand) onExpand("where");
          }
        }}
        className={`absolute -translate-x-1/2 z-50 rounded-full border bg-white transition-colors duration-200 cursor-pointer ${
          activePanel
            ? "bg-[#F5F5F5] md:bg-[#EBEBEB] border-transparent"
            : "bg-white border-border hover:shadow-md"
        } ${activePanel ? "overflow-visible" : "overflow-hidden"}`}
      >
        {/* Layer 1: Expanded Search Bar (Where | When | Who + Big Button) */}
        <motion.div
          style={{
            opacity: expandedOpacity,
            scale: expandedScale,
            pointerEvents: expandedPointerEvents,
          }}
          className="absolute inset-0 flex items-center justify-between w-full h-full cursor-default"
        >
          <SearchSection
            id="where"
            title="Where"
            subtitle={
              activePanel === "where" ? (
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setActivePanel(null);
                      if (onClose) onClose();
                      router.push(`/s/${encodeURIComponent(location || "Anywhere")}/homes`);
                    }
                  }}
                  placeholder="Search destinations, villas, pool, vibes..."
                  className="bg-transparent outline-none w-full text-sm text-foreground placeholder:text-muted"
                  autoFocus
                />
              ) : (
                location || "Search destinations"
              )
            }
            isActive={activePanel === "where"}
            isHovered={hoveredSection === "where"}
            onHover={() => setHoveredSection("where")}
            onHoverEnd={() => setHoveredSection(null)}
            onClick={(e) => {
              e.stopPropagation();
              setActivePanel("where");
            }}
            className="flex-[1.5] h-full flex items-center"
          />
          <div className="w-[1px] h-8 bg-border z-0 flex-shrink-0"></div>

          <SearchSection
            id="when"
            title="When"
            subtitle={
              dateRange.start && dateRange.end
                ? `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`
                : dateRange.start
                ? formatDate(dateRange.start)
                : "Add dates"
            }
            isActive={activePanel === "when"}
            isHovered={hoveredSection === "when"}
            onHover={() => setHoveredSection("when")}
            onHoverEnd={() => setHoveredSection(null)}
            onClick={(e) => {
              e.stopPropagation();
              setActivePanel("when");
            }}
            className="flex-[2] h-full flex items-center"
          />
          <div className="w-[1px] h-8 bg-border z-0 flex-shrink-0"></div>

          <SearchSection
            id="who"
            title="Who"
            subtitle={guestText}
            isActive={activePanel === "who"}
            isHovered={hoveredSection === "who"}
            onHover={() => setHoveredSection("who")}
            onHoverEnd={() => setHoveredSection(null)}
            onClick={(e) => {
              e.stopPropagation();
              setActivePanel("who");
            }}
            className="flex-[1.5] h-full flex items-center"
            hasSearchButton={true}
            searchButton={
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePanel(null);
                  if (onClose) onClose();
                  router.push(`/s/${location || "Anywhere"}/homes`);
                }}
                className={`h-12 bg-primary hover:bg-[#D89C2B] rounded-full text-white transition-all duration-300 flex items-center justify-center shadow-md flex-shrink-0 z-30 overflow-hidden ml-4 mr-1 ${
                  activePanel ? "w-[120px] px-4 gap-2" : "w-12"
                }`}
              >
                <Search size={20} strokeWidth={3} className="flex-shrink-0" />
                {activePanel && (
                  <span className="font-bold whitespace-nowrap overflow-hidden text-sm">
                    Search
                  </span>
                )}
              </button>
            }
          />
        </motion.div>

        {/* Layer 2: Compact Search Pill (Anywhere | Any week | Add guests + Small Button) */}
        <motion.div
          style={{
            opacity: compactOpacity,
            scale: compactScale,
            pointerEvents: compactPointerEvents,
          }}
          className="absolute inset-0 flex items-center justify-between w-full h-full cursor-pointer px-2 select-none"
          onClick={(e) => {
            e.stopPropagation();
            if (onExpand) onExpand("where");
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onExpand) onExpand("where");
            }}
            className="text-sm font-semibold pl-4 pr-3 text-foreground whitespace-nowrap truncate max-w-[120px] hover:text-primary transition-colors"
          >
            {location || "Anywhere"}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onExpand) onExpand("when");
            }}
            className="text-sm font-semibold px-4 border-x border-border text-center text-foreground whitespace-nowrap hover:text-primary transition-colors"
          >
            Any week
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onExpand) onExpand("who");
            }}
            className="text-sm pl-3 pr-2 text-muted flex items-center gap-3 whitespace-nowrap hover:text-primary transition-colors"
          >
            <span className="truncate max-w-[90px]">{guestText}</span>
            <div className="w-8 h-8 bg-primary hover:bg-[#D89C2B] rounded-full text-white flex items-center justify-center shadow-md flex-shrink-0 transition-colors">
              <Search size={14} strokeWidth={3} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Dropdown Panels rendered directly underneath the expanded search bar */}
      <AnimatePresence>
        {activePanel === "where" && (
          <motion.div
            className="absolute -translate-x-1/2 w-[850px] max-w-[95vw] pointer-events-none z-50"
            style={{ top: "158px", left: searchLeft }}
          >
            <div className="pointer-events-auto">
              <DestinationPanel
                key="panel-where"
                searchQuery={location}
                onSelect={(dest) => {
                  setLocation(dest);
                  setActivePanel("when");
                }}
                onPropertySelect={(property) => {
                  setActivePanel(null);
                  if (onClose) onClose();
                  router.push(`/property/${property.id}`);
                }}
                onSearchAll={(term) => {
                  setActivePanel(null);
                  if (onClose) onClose();
                  router.push(`/s/${encodeURIComponent(term || location || "Anywhere")}/homes`);
                }}
              />
            </div>
          </motion.div>
        )}
        {activePanel === "when" && (
          <motion.div
            className="absolute -translate-x-1/2 w-[850px] max-w-[95vw] pointer-events-none z-50"
            style={{ top: "158px", left: searchLeft }}
          >
            <div className="pointer-events-auto flex justify-center">
              <DatePanel
                key="panel-date"
                dateRange={dateRange}
                onDateRangeChange={(range) => setDateRange(range)}
              />
            </div>
          </motion.div>
        )}
        {activePanel === "who" && (
          <motion.div
            className="absolute -translate-x-1/2 w-[850px] max-w-[95vw] pointer-events-none z-50"
            style={{ top: "158px", left: searchLeft }}
          >
            <div className="pointer-events-auto flex justify-end">
              <GuestPanel key="panel-who" guests={guests} updateGuests={updateGuests} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
