"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function ExperienceReservationWidget({ experience }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [isReserved, setIsReserved] = useState(false);

  const handleReserve = () => {
    if (!date || !time) {
      alert("Please select a date and time first!");
      return;
    }
    setIsReserved(true);
    // Reset after 5 seconds to show it works
    setTimeout(() => {
      setIsReserved(false);
      setDate("");
      setTime("");
      setGuests(1);
    }, 5000);
  };

  return (
    <>
      {/* Desktop Widget */}
      <div className="hidden lg:block relative">
        <div className="sticky top-32 bg-white border border-border shadow-2xl rounded-3xl p-8 flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-foreground">
              ₹{experience.price.toLocaleString("en-IN")}
              <span className="text-base font-normal text-muted"> / guest</span>
            </div>
            {experience.rating && (
              <div className="flex items-center gap-1 font-semibold text-sm">
                <Star className="w-4 h-4 fill-foreground" />
                <span>{experience.rating} · <span className="text-muted underline">{experience.reviewCount} reviews</span></span>
              </div>
            )}
          </div>

          <div className="border border-border rounded-2xl overflow-hidden bg-white">
            <div className="flex border-b border-border relative">
              <div className="w-1/2 border-r border-border relative">
                <label className="absolute top-2 left-4 text-[10px] font-bold uppercase tracking-wider text-muted z-10 pointer-events-none">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  className="w-full h-full p-4 pt-7 text-sm font-medium outline-none bg-transparent hover:bg-secondary/50 transition cursor-pointer appearance-none"
                  required
                />
              </div>
              <div className="w-1/2 relative">
                <label className="absolute top-2 left-4 text-[10px] font-bold uppercase tracking-wider text-muted z-10 pointer-events-none">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  className="w-full h-full p-4 pt-7 text-sm font-medium outline-none bg-transparent hover:bg-secondary/50 transition cursor-pointer appearance-none"
                  required
                />
              </div>
            </div>
            <div className="relative">
              <label className="absolute top-2 left-4 text-[10px] font-bold uppercase tracking-wider text-muted z-10 pointer-events-none">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full p-4 pt-7 text-sm font-medium outline-none bg-transparent hover:bg-secondary/50 transition cursor-pointer appearance-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                ))}
              </select>
            </div>
          </div>

          {isReserved ? (
            <div className="w-full bg-[#3FAF75] text-white font-bold py-4 rounded-xl text-center shadow-lg transition">
              Reservation Confirmed! 🎉
            </div>
          ) : (
            <button
              onClick={handleReserve}
              className="w-full bg-primary hover:bg-primary-hover text-foreground font-bold py-4 rounded-xl transition shadow-lg shadow-primary/20"
            >
              Reserve Experience
            </button>
          )}
          <div className="text-center text-sm text-muted">
            You won't be charged yet
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 px-6 flex justify-between items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div>
          <div className="text-lg font-bold text-foreground">
            ₹{experience.price.toLocaleString("en-IN")} <span className="text-sm font-normal text-muted">/ guest</span>
          </div>
          <div className="text-sm font-medium text-primary underline">
            {date ? new Date(date).toLocaleDateString() : "Select dates"}
          </div>
        </div>
        <button
          onClick={() => {
            if (!date || !time) alert("Please select a date & time above first!");
            else handleReserve();
          }}
          className={`${isReserved ? 'bg-[#3FAF75] text-white' : 'bg-primary hover:bg-primary-hover text-foreground'} font-bold px-8 py-3 rounded-xl transition`}
        >
          {isReserved ? 'Confirmed!' : 'Reserve'}
        </button>
      </div>
    </>
  );
}
