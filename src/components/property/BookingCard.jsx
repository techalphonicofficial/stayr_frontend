"use client";
import { useState } from "react";
import { Info, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookingCard({ price, nights = 2, guests = 2, rating, reviewCount, taxRate = 0.18 }) {
  const [loading, setLoading] = useState(false);

  // Default dates
  const today = new Date();
  const defaultCheckIn = new Date(today);
  defaultCheckIn.setDate(defaultCheckIn.getDate() + 1);
  const defaultCheckOut = new Date(today);
  defaultCheckOut.setDate(defaultCheckOut.getDate() + nights + 1);

  const [checkIn, setCheckIn] = useState(defaultCheckIn.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(defaultCheckOut.toISOString().split('T')[0]);
  const [localGuests, setLocalGuests] = useState(guests);

  const calculateNights = (start, end) => {
    if (!start || !end) return nights;
    const diffTime = new Date(end) - new Date(start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 1;
  };

  const currentNights = calculateNights(checkIn, checkOut);

  // Price calculation
  const numericPrice = typeof price === 'number' ? price : parseInt((price || "0").toString().replace(/[^\d]/g, ''), 10) || 0;
  const subtotal = numericPrice * currentNights;
  const taxes = Math.round(subtotal * taxRate); 
  const total = subtotal + taxes;
  
  const formattedPrice = "₹" + numericPrice.toLocaleString("en-IN");
  const formattedSubtotal = "₹" + subtotal.toLocaleString("en-IN");
  const formattedTaxes = "₹" + taxes.toLocaleString("en-IN");
  const formattedTotal = "₹" + total.toLocaleString("en-IN");

  const router = useRouter();

  const handleBooking = () => {
    setLoading(true);
    // Simulate booking delay
    setTimeout(() => {
      setLoading(false);
      router.push('/booking-success');
    }, 800);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sticky top-28 flex flex-col gap-6">
      
      {/* Price Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="flex items-end gap-1">
            <span className="text-[22px] font-bold text-[#2B2B2B]">{formattedPrice}</span>
            <span className="text-[#2B2B2B] text-[15px] pb-1">night</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[13px] font-semibold text-[#128859]">
            <div className="bg-[#128859] w-[14px] h-[14px] rounded flex items-center justify-center">
              <span className="text-white text-[10px] pb-[1px]">✓</span>
            </div>
            {rating} Excellent
            <span className="text-[#7B7468] font-normal underline ml-1">({reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Booking Inputs */}
      <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-300">
          <div className="w-1/2 p-3 border-r border-gray-300 flex flex-col justify-center relative hover:bg-gray-50 transition">
            <span className="text-[10px] font-bold uppercase text-[#2B2B2B]">Check-in</span>
            <input 
              type="date" 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="text-[14px] text-[#2B2B2B] bg-transparent outline-none w-full cursor-pointer"
            />
          </div>
          <div className="w-1/2 p-3 flex flex-col justify-center relative hover:bg-gray-50 transition">
            <span className="text-[10px] font-bold uppercase text-[#2B2B2B]">Check-out</span>
            <input 
              type="date" 
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="text-[14px] text-[#2B2B2B] bg-transparent outline-none w-full cursor-pointer"
            />
          </div>
        </div>
        <div className="p-3 flex justify-between items-center hover:bg-gray-50 transition relative">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold uppercase text-[#2B2B2B]">Travelers</span>
            <select 
              value={localGuests}
              onChange={(e) => setLocalGuests(Number(e.target.value))}
              className="text-[14px] text-[#2B2B2B] bg-transparent outline-none w-full appearance-none cursor-pointer"
            >
              {[...Array(16)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1} traveler{i + 1 > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <ChevronDown size={20} className="text-[#2B2B2B] absolute right-3 pointer-events-none" />
        </div>
      </div>

      {/* Total Section */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-[15px]">
          <span className="text-[#2B2B2B] underline">{formattedPrice} x {currentNights} nights</span>
          <span className="text-[#2B2B2B]">{formattedSubtotal}</span>
        </div>
        <div className="flex justify-between items-center text-[15px]">
          <span className="text-[#2B2B2B] underline flex items-center gap-1">Taxes and fees <Info size={12} /></span>
          <span className="text-[#2B2B2B]">{formattedTaxes}</span>
        </div>
        <div className="border-t border-gray-200 my-2 pt-4 flex justify-between items-center text-[15px] font-bold">
          <span className="text-[#2B2B2B]">Total</span>
          <span className="text-[#2B2B2B]">{formattedTotal}</span>
        </div>
      </div>

      {/* Booking Button */}
      <button 
        onClick={handleBooking}
        disabled={loading}
        className="w-full bg-[#E8B65B] hover:bg-[#D89C2B] text-white font-bold py-3.5 rounded-full transition text-[16px] shadow-sm flex justify-center items-center h-12"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Request to book"
        )}
      </button>

      <div className="text-center text-[13px] text-[#7B7468]">
        You won't be charged yet
      </div>
    </div>
  );
}
