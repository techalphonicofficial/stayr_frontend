"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Container from "../common/Container";
import Logo from "./Logo";
import SearchMenu from "./SearchMenu";
import UserMenu from "./UserMenu";
import PropertiesDropdown from "./PropertiesDropdown";

const TABS = [
  { id: "homes", label: "Homes", icon: "🏠", path: "/" },
  { id: "experiences", label: "Experiences", icon: "🎈", path: "/experiences" },
  { id: "services", label: "Services", icon: "🛎", path: "/services" },
];

export default function Navbar({ forceCompact = false, flat = false }) {
  const { scrollY } = useScroll();
  const [isSearchOverride, setIsSearchOverride] = useState(false);
  const [activePanelOverride, setActivePanelOverride] = useState(null);
  const openScrollY = useRef(0);
  const pathname = usePathname() || "";

  let activeTab = "homes";
  if (pathname.startsWith("/experiences")) {
    activeTab = "experiences";
  } else if (pathname.startsWith("/services")) {
    activeTab = "services";
  }

  // Motion value for progress: 0 = fully expanded, 1 = fully compact
  const progress = useMotionValue(forceCompact ? 1 : 0);

  const expandNavbar = (panel = "where") => {
    setActivePanelOverride(panel);
    setIsSearchOverride(true);
    openScrollY.current = window.scrollY;
    animate(progress, 0, { duration: 0.28, ease: [0.16, 1, 0.3, 1] });
  };

  const collapseNavbar = () => {
    setIsSearchOverride(false);
    setActivePanelOverride(null);
    const target = forceCompact ? 1 : Math.min(1, Math.max(0, window.scrollY / 80));
    animate(progress, target, { duration: 0.24, ease: [0.16, 1, 0.3, 1] });
  };

  useEffect(() => {
    if (forceCompact && !isSearchOverride) {
      progress.set(1);
    } else if (!isSearchOverride) {
      const initialProgress = Math.min(1, Math.max(0, window.scrollY / 80));
      progress.set(initialProgress);
    }

    // Always keep scroll listener active
    const unsubscribe = scrollY.on("change", (latest) => {
      if (!isSearchOverride) {
        const p = forceCompact ? 1 : Math.min(1, Math.max(0, latest / 80));
        progress.set(p);
      } else {
        // As soon as the user scrolls down (or moves away > 5px), collapse immediately
        if (Math.abs(latest - openScrollY.current) > 5) {
          collapseNavbar();
        }
      }
    });

    return () => unsubscribe();
  }, [forceCompact, isSearchOverride, progress, scrollY]);

  // When search override is active, scrolling mousewheel or trackpad collapses it instantly
  useEffect(() => {
    if (!isSearchOverride) return;

    const handleWheel = (e) => {
      // If cursor is inside an internally scrollable dropdown panel (e.g. destinations list), don't collapse
      const scrollable = e.target.closest(".overflow-y-auto, .overflow-auto");
      if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) {
        return;
      }
      if (Math.abs(e.deltaY) > 4) {
        collapseNavbar();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isSearchOverride, forceCompact]);

  // Transformed values for the Navbar container
  const navHeight = useTransform(progress, [0, 1], ["168px", "80px"]);
  const navBorder = useTransform(
    progress,
    [0.3, 0.9],
    ["rgba(239, 231, 216, 0)", "rgba(239, 231, 216, 1)"]
  );
  const navShadow = useTransform(
    progress,
    [0.3, 0.9],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 20px rgba(0,0,0,0.06)"]
  );

  // Transformed values for Category Tabs (glide up and fade out)
  const tabsOpacity = useTransform(progress, [0, 0.45], [1, 0]);
  const tabsY = useTransform(progress, [0, 0.6], [0, -14]);
  const tabsScale = useTransform(progress, [0, 0.6], [1, 0.92]);
  const tabsPointerEvents = useTransform(progress, (p) => (p > 0.4 ? "none" : "auto"));

  return (
    <>
      {/* Dimmer Backdrop overlay when search override is active */}
      <AnimatePresence>
        {isSearchOverride && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={collapseNavbar}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-[1px]"
          />
        )}
      </AnimatePresence>

      <motion.div
        style={{
          height: navHeight,
          backgroundColor: "#FFFDF8",
          borderBottomWidth: flat ? 0 : 1,
          borderBottomStyle: "solid",
          borderBottomColor: flat ? "transparent" : navBorder,
          boxShadow: flat ? "none" : navShadow,
        }}
        className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl will-change-[height,box-shadow]"
      >
        <Container>
          {/* Desktop View (Single Continuous Morphing Architecture) */}
          <div className="hidden md:block relative w-full h-full">
            {/* Top Bar Row (Logo, Tabs, UserMenu) */}
            <div className="flex flex-row items-center justify-between relative h-20 z-[70] pointer-events-none">
              <div className="flex-1 flex justify-start pointer-events-auto">
                <Logo />
              </div>

              {/* Center Area: Tabs */}
              <div className="flex-1 flex justify-center items-center relative h-full">
                <motion.div
                  style={{
                    opacity: tabsOpacity,
                    y: tabsY,
                    scale: tabsScale,
                    pointerEvents: tabsPointerEvents,
                  }}
                  className="flex flex-row items-center gap-8 absolute z-[70] pointer-events-auto"
                >
                  {TABS.map((tab) => (
                    <Link
                      key={tab.id}
                      href={tab.path}
                      onClick={(e) => {
                        e.stopPropagation();
                        collapseNavbar();
                      }}
                      className={`relative cursor-pointer flex flex-row items-center gap-2 text-base transition-colors duration-200 ${
                        activeTab === tab.id
                          ? "text-primary font-bold"
                          : "text-muted hover:text-primary hover:opacity-80"
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <span>{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="active-tab-indicator"
                          className="absolute -bottom-3 left-0 right-0 h-[2px] bg-primary rounded-full"
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        />
                      )}
                    </Link>
                  ))}
                  <PropertiesDropdown onSelect={collapseNavbar} />
                </motion.div>
              </div>

              <div className="flex-1 flex justify-end pointer-events-auto">
                <UserMenu />
              </div>
            </div>

            {/* The Unified Morphing Search Element */}
            <SearchMenu
              progress={progress}
              isSearchOverride={isSearchOverride}
              onExpand={expandNavbar}
              onClose={collapseNavbar}
              defaultActivePanel={isSearchOverride ? activePanelOverride : null}
            />
          </div>

          {/* Mobile View */}
          <div className="flex md:hidden flex-col w-full pt-4">
            {/* Mobile Search Pill */}
            <div className="flex flex-row items-start gap-3 w-full relative z-[70]">
              <div className="flex-1 w-full relative">
                <AnimatePresence mode="wait">
                  {!isSearchOverride ? (
                    <motion.div
                      key="pill"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white border border-border rounded-full shadow-md py-3 px-4 flex items-center justify-center gap-3 cursor-pointer"
                      onClick={() => setIsSearchOverride(true)}
                    >
                      <Search size={18} strokeWidth={3} className="text-foreground" />
                      <span className="text-foreground font-semibold text-sm">Start your search</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-0 left-0 w-full z-50 bg-white shadow-xl rounded-3xl"
                    >
                      <SearchMenu
                        isExpanded={true}
                        onClose={() => setIsSearchOverride(false)}
                        defaultActivePanel="where"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {!isSearchOverride && <UserMenu />}
            </div>

            {/* Mobile Tabs */}
            {!isSearchOverride && (
              <div className="flex flex-row justify-center items-end gap-8 mt-4 overflow-visible relative z-[70]">
                {TABS.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.path}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSearchOverride(false);
                    }}
                    className={`flex flex-col items-center justify-end cursor-pointer transition relative pb-2 ${
                      activeTab === tab.id ? "text-foreground" : "text-muted"
                    }`}
                  >
                    <span className="text-[28px] mb-1">{tab.icon}</span>
                    <span className="text-[13px] font-semibold">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="mobile-active-tab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground"
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      />
                    )}
                  </Link>
                ))}
                <PropertiesDropdown isMobile={true} onSelect={() => setIsSearchOverride(false)} />
              </div>
            )}
          </div>
        </Container>
      </motion.div>
    </>
  );
}
