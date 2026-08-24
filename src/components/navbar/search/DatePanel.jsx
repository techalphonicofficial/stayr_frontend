"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export default function DatePanel({ dateRange, onDateRangeChange }) {
  const [activeTab, setActiveTab] = useState("dates"); // "dates" | "months" | "flexible"
  const [selectedStayLength, setSelectedStayLength] = useState("Weekend"); // Weekend | Week | Month
  const [selectedMonths, setSelectedMonths] = useState([]); // array of month names

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const [currentDate, setCurrentDate] = useState(() => {
    return new Date(todayMidnight.getFullYear(), todayMidnight.getMonth(), 1);
  });

  const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  const currentMonthStart = new Date(todayMidnight.getFullYear(), todayMidnight.getMonth(), 1);
  const isLeftButtonDisabled = currentDate.getTime() <= currentMonthStart.getTime();

  const handlePrevMonth = () => {
    if (!isLeftButtonDisabled) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getStartingDay = (year, month) => new Date(year, month, 1).getDay();

  // Use props if available, otherwise local state for fallback
  const start = dateRange?.start || null;
  const end = dateRange?.end || null;

  const handleDateClick = (year, month, day) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0, 0, 0, 0);

    if (!start || (start && end)) {
      onDateRangeChange?.({ start: clickedDate, end: null });
    } else {
      if (clickedDate < start) {
        onDateRangeChange?.({ start: clickedDate, end: null });
      } else {
        onDateRangeChange?.({ start, end: clickedDate });
      }
    }
  };

  const isStartOrEnd = (year, month, day) => {
    const current = new Date(year, month, day).getTime();
    const startTime = start?.getTime();
    const endTime = end?.getTime();
    return (startTime && current === startTime) || (endTime && current === endTime);
  };

  const isInBetween = (year, month, day) => {
    const current = new Date(year, month, day).getTime();
    const startTime = start?.getTime();
    const endTime = end?.getTime();
    return startTime && endTime && current > startTime && current < endTime;
  };

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const renderCalendar = (dateObj, isLeft) => {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const monthName = dateObj.toLocaleString("default", { month: "long" });
    const numDays = getDaysInMonth(year, month);
    const startDay = getStartingDay(year, month);

    const datesArray = Array.from({ length: numDays }, (_, i) => i + 1);

    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          {isLeft ? (
            <button
              onClick={handlePrevMonth}
              disabled={isLeftButtonDisabled}
              className={`p-1.5 rounded-full transition ${
                isLeftButtonDisabled 
                  ? "text-gray-300 cursor-not-allowed" 
                  : "hover:bg-gray-100 text-muted"
              }`}
            >
              <ChevronLeft size={16} />
            </button>
          ) : (
            <div className="w-6"></div>
          )}
          
          <div className="font-semibold text-sm text-foreground">
            {monthName} {year}
          </div>
          
          {!isLeft ? (
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-gray-100 rounded-full text-muted transition"
            >
              <ChevronRight size={16} />
            </button>
          ) : (
            <div className="w-6"></div>
          )}
        </div>

        <div className="grid grid-cols-7 mb-1">
          {days.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-muted">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1 relative">
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          
          {datesArray.map((d) => {
            const isSelected = isStartOrEnd(year, month, d);
            const isBetween = isInBetween(year, month, d);
            const buttonDate = new Date(year, month, d);
            const isPast = buttonDate.getTime() < todayMidnight.getTime();
            
            return (
              <div key={d} className="aspect-square flex items-center justify-center relative">
                {isBetween && !isPast && (
                  <div className="absolute inset-y-0 -inset-x-[2px] bg-[#F7F7F7] -z-10" />
                )}
                {/* Special case for connecting start and end dates */}
                {isSelected && start && end && start.getTime() !== end.getTime() && !isPast && (
                  <div className={`absolute inset-y-0 ${start.getTime() === buttonDate.getTime() ? "right-0 left-1/2" : "left-0 right-1/2"} bg-[#F7F7F7] -z-10`} />
                )}
                <button
                  onClick={() => {
                    if (!isPast) handleDateClick(year, month, d);
                  }}
                  disabled={isPast}
                  className={`w-7 h-7 flex items-center justify-center rounded-full font-semibold text-xs transition-all z-10 ${
                    isPast
                      ? "text-gray-300 cursor-not-allowed"
                      : isSelected
                        ? "bg-black text-white"
                        : "hover:border hover:border-foreground text-foreground"
                  } ${isBetween && !isSelected && !isPast ? "bg-[#F7F7F7] w-full rounded-none" : ""}`}
                >
                  {d}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
      setSelectedMonths(selectedMonths.filter((m) => m !== monthName));
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
      className="absolute top-[120%] left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-[550px] bg-white rounded-3xl shadow-[0_12px_28px_rgba(0,0,0,0.15)] border border-border z-50 origin-top overflow-hidden"
    >
      <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden p-4 md:p-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* Quick Select Tabs */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-[#F5F5F5] rounded-full p-1 flex shadow-inner">
            <button
              onClick={() => setActiveTab("dates")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === "dates"
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Dates
            </button>

            <button
              onClick={() => setActiveTab("flexible")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                activeTab === "flexible"
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted hover:text-foreground"
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
              className="flex flex-col md:flex-row gap-8 md:gap-6 justify-center"
            >
              {renderCalendar(currentDate, true)}
              {renderCalendar(nextMonthDate, false)}
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
              <h3 className="text-[18px] font-semibold text-foreground mb-6">
                How long would you like to stay?
              </h3>
              <div className="flex gap-3 mb-10">
                {["Weekend", "Week", "Month"].map((length) => (
                  <button
                    key={length}
                    onClick={() => setSelectedStayLength(length)}
                    className={`px-5 py-2 rounded-full border transition text-sm font-semibold ${
                      selectedStayLength === length
                        ? "border-black bg-gray-50 text-black"
                        : "border-border bg-white text-muted hover:border-black hover:text-black"
                    }`}
                  >
                    {length}
                  </button>
                ))}
              </div>

              <h3 className="text-[18px] font-semibold text-foreground mb-6">
                When do you want to go?
              </h3>

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
                          : "border-border bg-white hover:border-black"
                      }`}
                    >
                      <CalendarIcon
                        size={32}
                        strokeWidth={1.5}
                        className="mb-3 text-foreground"
                      />
                      <span className="font-semibold text-[14px] text-foreground">
                        {month.name}
                      </span>
                      <span className="text-[12px] text-muted">
                        {month.year}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}


        </AnimatePresence>
      </div>
    </motion.div>
  );
}
