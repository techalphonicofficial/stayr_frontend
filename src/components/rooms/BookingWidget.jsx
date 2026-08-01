"use client";

import { useState } from "react";
import { ChevronDown, Star } from "lucide-react";

export default function BookingWidget({ price = "₹12,000", rating = "4.92", reviews = "128" }) {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);
  const [isReserved, setIsReserved] = useState(false);

  const handleReserve = () => {
    if (!checkin || !checkout) {
      alert("Please select check-in and checkout dates first!");
      return;
    }
    setIsReserved(true);
    setTimeout(() => {
      setIsReserved(false);
      setCheckin("");
      setCheckout("");
      setGuests(1);
    }, 5000);
  };

  return (
    <div className="w-full bg-white border border-[#EFE7D8] rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.12)] p-6 sticky top-[100px]">
      
      {/* Header: Price & Rating */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[22px] font-bold text-[#2B2B2B]">{price}</span>
          <span className="text-[16px] text-[#2B2B2B]"> night</span>
        </div>
        <div className="flex items-center gap-1 text-[14px] font-semibold text-[#2B2B2B]">
          <Star size={14} className="fill-[#2B2B2B]" />
          <span>{rating}</span>
          <span className="text-[#7B7468]">·</span>
          <span className="underline text-[#7B7468] hover:text-[#2B2B2B] cursor-pointer">
            {reviews} reviews
          </span>
        </div>
      </div>

      {/* Date & Guest Picker */}
      <div className="border border-gray-400 rounded-xl overflow-hidden mb-4 bg-white relative">
        <div className="flex flex-row border-b border-gray-400">
          <div className="flex-1 border-r border-gray-400 relative">
            <label className="absolute top-2 left-3 text-[10px] font-bold uppercase z-10 pointer-events-none">Check-in</label>
            <input 
              type="date"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              className="w-full h-full p-3 pt-6 text-[14px] outline-none bg-transparent hover:bg-gray-50 transition cursor-pointer appearance-none"
              required
            />
          </div>
          <div className="flex-1 relative">
            <label className="absolute top-2 left-3 text-[10px] font-bold uppercase z-10 pointer-events-none">Checkout</label>
            <input 
              type="date"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              className="w-full h-full p-3 pt-6 text-[14px] outline-none bg-transparent hover:bg-gray-50 transition cursor-pointer appearance-none"
              required
            />
          </div>
        </div>
        <div className="relative">
          <label className="absolute top-2 left-3 text-[10px] font-bold uppercase z-10 pointer-events-none">Guests</label>
          <select 
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full p-3 pt-6 text-[14px] outline-none bg-transparent hover:bg-gray-50 transition cursor-pointer appearance-none"
          >
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
          <ChevronDown size={20} className="text-[#2B2B2B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Reserve Button */}
      {isReserved ? (
        <div className="w-full bg-[#3FAF75] text-white font-bold text-[16px] py-3.5 rounded-lg text-center shadow-sm transition">
          Reservation Confirmed! 🎉
        </div>
      ) : (
        <button 
          onClick={handleReserve}
          className="w-full bg-gradient-to-r from-[#E8B65B] to-[#D89C2B] text-white font-bold text-[16px] py-3.5 rounded-lg hover:brightness-95 transition shadow-sm active:scale-[0.98]"
        >
          Check availability
        </button>
      )}

      {/* Footer text */}
      <div className="text-center text-[14px] text-[#7B7468] mt-4">
        You won't be charged yet
      </div>
    </div>
  );
}
