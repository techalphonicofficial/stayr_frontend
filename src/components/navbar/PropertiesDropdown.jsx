"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, Home, KeyRound, Building2, Store, X, MapPin, 
  Sparkles, Compass, ArrowRight, PlayCircle, Eye, ShieldCheck, Flame
} from "lucide-react";

export default function PropertiesDropdown({ onSelect, isMobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname() || "";

  const isBuyActive = pathname.startsWith("/buy");
  const isSellActive = pathname.startsWith("/sell");
  const isActive = isBuyActive || isSellActive;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
    if (onSelect) onSelect();
  };

  // ==========================================
  // Mobile Mega Drawer (Stayr Warm Theme)
  // ==========================================
  if (isMobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex flex-col items-center justify-end cursor-pointer transition relative pb-2 ${
            isActive ? "text-[#FF385C] font-bold" : "text-muted"
          }`}
        >
          <span className="text-[26px] mb-1">🏢</span>
          <span className="text-[12px] font-semibold flex items-center gap-0.5">
            Properties <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </span>
          {isActive && (
            <motion.div
              layoutId="mobile-active-tab"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF385C]"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            />
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-2 bottom-20 top-20 bg-[#FFFDF8] text-gray-900 rounded-3xl shadow-2xl border border-[#EFE7D8] p-6 z-[9999] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#EFE7D8] mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
                  <span className="text-xs font-bold tracking-widest uppercase text-[#FF385C]">
                    Stayr Real Estate
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-6 text-sm">
                {/* Local */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] mb-2">Local</h4>
                  <Link href="/buy/near-me" onClick={handleLinkClick} className="block py-1.5 text-gray-800 font-medium hover:text-[#FF385C]">
                    Properties Near Me
                  </Link>
                </div>

                {/* Worldwide */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] mb-2">Worldwide</h4>
                  <div className="space-y-2">
                    <Link href="/buy" onClick={handleLinkClick} className="block py-1 text-gray-800 font-medium hover:text-[#FF385C]">
                      View Properties Globally
                    </Link>
                    <Link href="/buy/new-developments" onClick={handleLinkClick} className="block py-1 text-gray-800 font-medium hover:text-[#FF385C]">
                      New Development Projects
                    </Link>
                    <Link href="/buy/lifestyle" onClick={handleLinkClick} className="block py-1 text-[#FF385C] font-bold">
                      Properties by Lifestyle
                    </Link>
                    <Link href="/buy/destinations" onClick={handleLinkClick} className="block py-1 text-gray-800 font-medium hover:text-[#FF385C]">
                      Properties by Destination
                    </Link>
                  </div>
                </div>

                {/* Popular Cities */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] mb-2">Popular Cities</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 font-medium">
                    <Link href="/buy/city/new-york" onClick={handleLinkClick} className="py-1 hover:text-[#FF385C]">New York</Link>
                    <Link href="/buy/city/london" onClick={handleLinkClick} className="py-1 hover:text-[#FF385C]">London</Link>
                    <Link href="/buy/city/dubai" onClick={handleLinkClick} className="py-1 hover:text-[#FF385C]">Dubai</Link>
                    <Link href="/buy/city/paris" onClick={handleLinkClick} className="py-1 hover:text-[#FF385C]">Paris</Link>
                    <Link href="/buy/city/noida" onClick={handleLinkClick} className="py-1 hover:text-[#FF385C]">Noida / NCR</Link>
                    <Link href="/buy/city/mumbai" onClick={handleLinkClick} className="py-1 hover:text-[#FF385C]">Mumbai</Link>
                  </div>
                </div>

                {/* New Developments */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] mb-2">New Developments</h4>
                  <Link href="/buy/new-developments" onClick={handleLinkClick} className="block py-1 text-gray-800 font-medium hover:text-[#FF385C]">
                    Discover Developments
                  </Link>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#EFE7D8] flex gap-2">
                <Link
                  href="/sell"
                  onClick={handleLinkClick}
                  className="flex-1 py-3 text-center bg-[#FF385C] hover:bg-[#E0314F] text-white rounded-xl font-bold text-xs shadow-md"
                >
                  Sell Property
                </Link>
                <Link
                  href="/sell/dashboard"
                  onClick={handleLinkClick}
                  className="py-3 px-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs"
                >
                  Seller Hub
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ==========================================
  // Desktop Luxury Mega Menu (Stayr Dynamic Theme)
  // ==========================================
  return (
    <div
      className="relative z-[100]"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative cursor-pointer flex flex-row items-center gap-1.5 text-base transition-colors duration-200 py-1 ${
          isActive
            ? "text-[#FF385C] font-bold"
            : "text-muted hover:text-[#FF385C] hover:opacity-80"
        }`}
      >
        <span className="text-xl">🏢</span>
        <span className="tracking-wide">PROPERTIES</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 text-gray-400 ${
            isOpen ? "rotate-180 text-[#FF385C]" : ""
          }`}
        />
        {isActive && (
          <motion.div
            layoutId="active-tab-indicator"
            className="absolute -bottom-3 left-0 right-0 h-[2px] bg-[#FF385C] rounded-full"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute -right-32 lg:-right-48 top-full mt-3 w-[880px] bg-white text-gray-900 rounded-3xl shadow-2xl border border-[#EFE7D8] p-8 z-[999] backdrop-blur-2xl ring-1 ring-black/5 before:absolute before:-top-4 before:left-0 before:right-0 before:h-4"
          >
            {/* Top Close Button & Brand Micro-tag */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE7D8] mb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#FF385C] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF385C]">
                  Stayr Real Estate Marketplace
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FF385C]/10 text-[#FF385C] font-bold">
                  Buy & Sell Luxury
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
                title="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            {/* 4-Column Luxury Menu */}
            <div className="grid grid-cols-4 gap-8 text-sm">
              {/* Column 1: LOCAL */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#7B7468] mb-3.5 flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#FF385C]" />
                  <span>Local</span>
                </h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link
                      href="/buy/near-me"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] text-xs font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Properties Near Me
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: WORLDWIDE */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#7B7468] mb-3.5 flex items-center gap-1.5">
                  <Compass size={12} className="text-[#FF385C]" />
                  <span>Worldwide</span>
                </h3>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <Link
                      href="/buy"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      View Properties Globally
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/new-developments"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      New Development Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/coming-soon"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Properties Coming Soon
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/auctions"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Properties for Auction
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/lifestyle"
                      onClick={handleLinkClick}
                      className="text-[#FF385C] font-bold transition flex items-center justify-between hover:translate-x-1 duration-150 group"
                    >
                      <span>Properties by Lifestyle</span>
                      <span className="text-[10px] bg-[#FF385C]/10 text-[#FF385C] px-1.5 py-0.5 rounded-full font-bold">
                        Featured
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/destinations"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Properties by Destination
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/with-videos"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Properties with Videos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/virtual-reality"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Properties with Virtual Reality
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: POPULAR CITIES */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#7B7468] mb-3.5 flex items-center gap-1.5">
                  <Building2 size={12} className="text-[#FF385C]" />
                  <span>Popular Cities</span>
                </h3>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <Link
                      href="/buy/city/new-york"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      New York
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/city/los-angeles"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Los Angeles
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/city/the-hamptons"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      The Hamptons
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/city/london"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      London
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/city/dubai"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Dubai
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/city/paris"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Paris
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/city/noida"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Noida / Delhi NCR
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/city/mumbai"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Mumbai
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: NEW DEVELOPMENTS */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#7B7468] mb-3.5 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-[#FF385C]" />
                  <span>New Developments</span>
                </h3>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <Link
                      href="/buy/new-developments"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Discover Developments
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/buy/new-developments#overview"
                      onClick={handleLinkClick}
                      className="text-gray-700 hover:text-[#FF385C] font-medium transition block hover:translate-x-1 duration-150"
                    >
                      Development Overview
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar: Stayr Warm Accent Callout */}
            <div className="mt-8 pt-5 border-t border-[#EFE7D8] flex items-center justify-between flex-wrap gap-4 bg-[#FAF7F2] -mx-8 -mb-8 p-6 rounded-b-3xl">
              <div>
                <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                  <span>Have real estate to advertise?</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Free Listing
                  </span>
                </div>
                <p className="text-[11px] text-[#7B7468] mt-0.5">
                  Reach verified prospective buyers and receive direct inquiry leads on Stayr.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/sell/dashboard"
                  onClick={handleLinkClick}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:text-gray-900 text-xs font-semibold hover:bg-gray-200/50 transition"
                >
                  Seller Dashboard
                </Link>
                <Link
                  href="/sell"
                  onClick={handleLinkClick}
                  className="px-5 py-2.5 rounded-xl bg-[#FF385C] hover:bg-[#E0314F] text-white text-xs font-bold transition shadow-md flex items-center gap-1.5"
                >
                  <span>Sell With Us</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
