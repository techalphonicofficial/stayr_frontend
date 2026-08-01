"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname() || "";
  const router = useRouter();

  let activeTab = "homes";
  if (pathname.startsWith("/experiences")) {
    activeTab = "experiences";
  } else if (pathname.startsWith("/services")) {
    activeTab = "services";
  }

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!forceCompact) {
      setIsScrolled(latest > 80);
      if (latest > 80 && isSearchOverride) {
        setIsSearchOverride(false);
      }
    }
  });

  const isActuallyScrolled = isScrolled && !isSearchOverride;

  return (
 <motion.div
  layout
  transition={{
    layout: {
      type: "spring",
      stiffness: 180,
      damping: 22,
      mass: 0.9 },
    backgroundColor: { duration: 0.35 },
    borderBottom: { duration: 0.35 },
    boxShadow: { duration: 0.35 } }}
  animate={{
    backgroundColor: "#FFFDF8",
    borderBottom: (isActuallyScrolled && !flat)
      ? "1px solid var(--color-border)"
      : "1px solid transparent",
    boxShadow: (isActuallyScrolled && !flat)
      ? "0 10px 35px rgba(0,0,0,0.06)"
      : "0 0 0 rgba(0,0,0,0)" }}
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
                    className="flex flex-row items-center gap-8 absolute"
                  >
                    {TABS.map((tab) => (
                      <div 
                        key={tab.id}
                        onClick={() => router.push(tab.path)}
                        className={`relative cursor-pointer flex flex-row items-center gap-2 text-base transition ${
                          activeTab === tab.id ? 'text-primary font-bold' : 'text-muted hover:text-primary hover:opacity: 1,y-80'
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
                      </div>
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
        <div className="flex md:hidden flex-col w-full">
          {/* Mobile Search Pill */}
          <div className="flex flex-row items-center gap-3 w-full">
            <div className="flex-1 bg-white border border-[#EFE7D8] rounded-full shadow-md py-3 px-4 flex items-center justify-center gap-3 cursor-pointer">
              <Search size={18} strokeWidth={3} className="text-[#2B2B2B]" />
              <span className="text-[#2B2B2B] font-semibold text-sm">Start your search</span>
            </div>
            <UserMenu />
          </div>

          {/* Mobile Tabs */}
          <div className="flex flex-row justify-center items-end gap-8 mt-4 overflow-hidden">
            {TABS.map((tab) => (
              <div 
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className={`flex flex-col items-center justify-end cursor-pointer transition relative pb-2 ${
                  activeTab === tab.id ? 'text-[#2B2B2B]' : 'text-[#7B7468]'
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
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2B2B2B]"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
