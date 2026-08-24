"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import Container from "../common/Container";
import Logo from "./Logo";
import SearchMenu from "./SearchMenu";
import UserMenu from "./UserMenu";

const TABS = [
  { id: "homes", label: "Homes", icon: "🏠", path: "/" },
  { id: "experiences", label: "Experiences", icon: "🎈", path: "/experiences" },
  { id: "services", label: "Services", icon: "🛎", path: "/services" },
];

export default function Navbar({ forceCompact = false, flat = false }) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(forceCompact);
  const [isSearchOverride, setIsSearchOverride] = useState(false);
  const openScrollY = useRef(0);
  const pathname = usePathname() || "";
  const router = useRouter();

  let activeTab = "homes";
  if (pathname.startsWith("/experiences")) {
    activeTab = "experiences";
  } else if (pathname.startsWith("/services")) {
    activeTab = "services";
  }

  useEffect(() => {
    if (isSearchOverride) {
      openScrollY.current = window.scrollY;
    }
  }, [isSearchOverride]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!forceCompact) {
      setIsScrolled(latest > 80);
      if (latest > 80 && isSearchOverride) {
        if (Math.abs(latest - openScrollY.current) > 50) {
          setIsSearchOverride(false);
        }
      }
    }
  });

  const isActuallyScrolled = isScrolled && !isSearchOverride;

  return (
    <>
      <AnimatePresence>
        {isSearchOverride && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsSearchOverride(false)}
            className="fixed inset-0 bg-black/25 z-40"
          />
        )}
      </AnimatePresence>
      <motion.div
        layout
        transition={{
          layout: {
            type: "spring",
            stiffness: 180,
            damping: 22,
            mass: 0.9
          },
          backgroundColor: { duration: 0.35 },
          borderBottom: { duration: 0.35 },
          boxShadow: { duration: 0.35 }
        }}
        animate={{
          backgroundColor: "#FFFDF8",
          borderBottom: (isActuallyScrolled && !flat)
            ? "1px solid var(--color-border)"
            : "1px solid transparent",
          boxShadow: (isActuallyScrolled && !flat)
            ? "0 10px 35px rgba(0,0,0,0.06)"
            : "0 0 0 rgba(0,0,0,0)"
        }}
        className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl"
      >
        <Container>
          {/* Desktop View */}
          <div className="hidden md:flex flex-col">
            {/* Row 1 */}
            <div className="flex flex-row items-center justify-between relative h-16 z-[60]">
              <div className="flex-1 flex justify-start">
                <Logo />
              </div>

              {/* Center Area: Tabs (Expanded) or Compact Search (Scrolled) */}
              <div className="flex-1 flex justify-center items-center relative">
                <AnimatePresence>
                  {!isActuallyScrolled && (
                    <motion.div
                      key="tabs"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: "easeInOut" }}
                      className="flex flex-row items-center gap-8 absolute z-[70]"
                    >
                      {TABS.map((tab) => (
                        <Link
                          key={tab.id}
                          href={tab.path}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsSearchOverride(false);
                          }}
                          className={`relative cursor-pointer flex flex-row items-center gap-2 text-base transition ${activeTab === tab.id ? 'text-primary font-bold' : 'text-muted hover:text-primary hover:opacity-80'
                            }`}
                        >
                          <span className="text-xl">{tab.icon}</span>
                          <span>{tab.label}</span>
                          {activeTab === tab.id && (
                            <motion.div
                              layoutId="active-tab-indicator"
                              className="absolute -bottom-3 left-0 right-0 h-[2px] bg-primary rounded-full"
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            />
                          )}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isActuallyScrolled && (
                    <motion.div
                      className="absolute z-10 w-full flex justify-center"
                    >
                      <SearchMenu isExpanded={false} animateLayout={true} onExpand={() => setIsSearchOverride(true)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 flex justify-end">
                <UserMenu />
              </div>
            </div>

            {/* Row 2: Large Search Box */}
            <AnimatePresence>
              {!isActuallyScrolled && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 80, marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, overflow: "hidden" }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="flex justify-center origin-top"
                >
                  <SearchMenu
                    isExpanded={true}
                    animateLayout={true}
                    onClose={() => setIsSearchOverride(false)}
                    defaultActivePanel={isSearchOverride ? "where" : null}
                  />
                </motion.div>
              )}
            </AnimatePresence>
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
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                        animateLayout={false} 
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
              <div className="flex flex-row justify-center items-end gap-8 mt-4 overflow-hidden relative z-[70]">
                {TABS.map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.path}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSearchOverride(false);
                    }}
                    className={`flex flex-col items-center justify-end cursor-pointer transition relative pb-2 ${activeTab === tab.id ? 'text-foreground' : 'text-muted'
                      }`}
                  >
                    <AnimatePresence>
                      {!isActuallyScrolled && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, scale: 0.8 }}
                          animate={{ height: "auto", opacity: 1, scale: 1 }}
                          exit={{ height: 0, opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="text-[28px] mb-1"
                        >
                          {tab.icon}
                        </motion.div>
                      )}
                    </AnimatePresence>
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
              </div>
            )}
          </div>
        </Container>
      </motion.div>
    </>
  );
}

