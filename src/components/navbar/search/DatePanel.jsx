"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export default function DatePanel() {
  const [activeTab, setActiveTab] = useState("dates"); // "dates" | "months" | "flexible"
  const [selectedStayLength, setSelectedStayLength] = useState("Weekend"); // Weekend | Week | Month
  const [selectedMonths, setSelectedMonths] = useState([]); // array of month names

  // Mock calendar structure for August 2026
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const flexibleMonths = [
    { name: "August", year: "2026" },
    { name: "September", year: "2026" },
    { name: "October", year: "2026" },
    { name: "November", year: "2026" },
    { name: "December", year: "2026" },
    { name: "January", year: "2027" },
  ];

  const toggleMonth = (monthName) => {
    if (selectedMonths.includes(monthName)) {
      setSelectedMonths(selectedMonths.filter(m => m !== monthName));
    } else {
      setSelectedMonths([...selectedMonths, monthName]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-[120%] left-1/2 -translate-x-1/2 w-[850px] max-w-[95vw] max-h-[60vh] overflow-y-auto overflow-x-hidden bg-white rounded-3xl shadow-[0_12px_28px_rgba(0,0,0,0.15)] border border-[#EFE7D8] p-8 z-50 origin-top"
    >
      
      {/* Quick Select Tabs */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-[#F5F5F5] rounded-full p-1 flex shadow-inner">
          <button 
            onClick={() => setActiveTab("dates")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === "dates" 
                ? "bg-white shadow-sm text-[#2B2B2B]" 
                : "text-[#7B7468] hover:text-[#2B2B2B]"
            }`}
          >
            Dates
          </button>
          <button 
            onClick={() => setActiveTab("months")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === "months" 
                ? "bg-white shadow-sm text-[#2B2B2B]" 
                : "text-[#7B7468] hover:text-[#2B2B2B]"
            }`}
          >
            Months
          </button>
          <button 
            onClick={() => setActiveTab("flexible")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === "flexible" 
                ? "bg-white shadow-sm text-[#2B2B2B]" 
                : "text-[#7B7468] hover:text-[#2B2B2B]"
            }`}
          >
            Flexible
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "dates" && (
          <motion.div 
            key="dates-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-row gap-12"
          >
            {/* Left Calendar */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <button className="p-2 hover:bg-gray-100 rounded-full text-[#7B7468]">
                  <ChevronLeft size={20} />
                </button>
                <div className="font-semibold text-[#2B2B2B]">August 2026</div>
                <div className="w-8"></div> {/* Spacer to center title */}
              </div>
              
              <div className="grid grid-cols-7 mb-2">
                {days.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-[#7B7468]">{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-y-1">
                {Array.from({length: 6}).map((_, i) => <div key={`empty-${i}`} />)}
                {dates.map(d => (
                  <div key={d} className="aspect-square flex items-center justify-center">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:border hover:border-[#2B2B2B] text-[#2B2B2B] font-semibold text-sm transition">
                      {d}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Calendar */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="w-8"></div> {/* Spacer */}
                <div className="font-semibold text-[#2B2B2B]">September 2026</div>
                <button className="p-2 hover:bg-gray-100 rounded-full text-[#7B7468]">
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-7 mb-2">
                {days.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-[#7B7468]">{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-y-1">
                {Array.from({length: 2}).map((_, i) => <div key={`empty-sept-${i}`} />)}
                {dates.slice(0, 30).map(d => (
                  <div key={d} className="aspect-square flex items-center justify-center">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full hover:border hover:border-[#2B2B2B] text-[#2B2B2B] font-semibold text-sm transition">
                      {d}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "flexible" && (
          <motion.div 
            key="flexible-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center pb-4"
          >
            <h3 className="text-[18px] font-semibold text-[#2B2B2B] mb-6">How long would you like to stay?</h3>
            <div className="flex gap-3 mb-10">
              {["Weekend", "Week", "Month"].map((length) => (
                <button
                  key={length}
                  onClick={() => setSelectedStayLength(length)}
                  className={`px-5 py-2 rounded-full border transition text-sm font-semibold ${
                    selectedStayLength === length
                      ? "border-black bg-gray-50 text-black"
                      : "border-[#EFE7D8] bg-white text-[#7B7468] hover:border-black hover:text-black"
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>

            <h3 className="text-[18px] font-semibold text-[#2B2B2B] mb-6">When do you want to go?</h3>
            
            {/* Horizontal scroll container with hidden scrollbar */}
            <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex gap-4 min-w-max px-2 pb-4">
                {flexibleMonths.map((month) => (
                  <button
                    key={month.name}
                    onClick={() => toggleMonth(month.name)}
                    className={`flex flex-col items-center justify-center w-[120px] h-[130px] rounded-2xl border transition-all ${
                      selectedMonths.includes(month.name)
                        ? "border-black border-2 bg-gray-50 shadow-sm"
                        : "border-[#EFE7D8] bg-white hover:border-black"
                    }`}
                  >
                    <CalendarIcon size={32} strokeWidth={1.5} className="mb-3 text-[#2B2B2B]" />
                    <span className="font-semibold text-[14px] text-[#2B2B2B]">{month.name}</span>
                    <span className="text-[12px] text-[#7B7468]">{month.year}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === "months" && (
          <motion.div 
            key="months-view"
            initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center h-48 text-[#7B7468]"
          >
            Months view coming soon...
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
