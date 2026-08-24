"use client";

import { useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { createBooking, createRazorpayOrder, verifyPayment } from "@/lib/api";

export default function BookingWidget({ propertyId, price = "₹12,000", rating = "4.92", reviews = "128" }) {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(1);
  const [isReserved, setIsReserved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const router = useRouter();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleReserve = async () => {
    if (!checkin || !checkout) {
      setErrorMsg("Please select check-in and checkout dates first!");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      // 1. Create Booking
      const bookingRes = await createBooking(propertyId, checkin, checkout, guests);
      const bookingId = bookingRes.data.id;

      // 2. Create Razorpay Order
      const orderRes = await createRazorpayOrder(bookingId);
      const { orderId, amount, currency } = orderRes.data;

      // 3. Load script
      const res = await loadRazorpayScript();
      if (!res) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // 4. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "STAYR",
        description: "Booking Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            setIsLoading(true);
            await verifyPayment(
              bookingId,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            setIsReserved(true);
            router.push(`/booking-success?bookingId=${bookingId}`);
          } catch (err) {
            setErrorMsg("Payment verification failed: " + err.message);
            setIsLoading(false);
          }
        },
        theme: {
          color: "#2B2B2B",
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        setErrorMsg("Payment failed: " + response.error.description);
        setIsLoading(false);
      });

      paymentObject.open();

    } catch (err) {
      setErrorMsg(err.message || "Failed to initiate booking.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-border rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.12)] p-6 sticky top-[100px]">
      
      {/* Header: Price & Rating */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[22px] font-bold text-foreground">{price}</span>
          <span className="text-[16px] text-foreground"> night</span>
        </div>
        <div className="flex items-center gap-1 text-[14px] font-semibold text-foreground">
          <Star size={14} className="fill-foreground" />
          <span>{rating}</span>
          <span className="text-muted">·</span>
          <span className="underline text-muted hover:text-foreground cursor-pointer">
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
              disabled={isLoading}
              onChange={(e) => setCheckin(e.target.value)}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              className="w-full h-full p-3 pt-6 text-[14px] outline-none bg-transparent hover:bg-gray-50 transition cursor-pointer appearance-none disabled:opacity-50"
              required
            />
          </div>
          <div className="flex-1 relative">
            <label className="absolute top-2 left-3 text-[10px] font-bold uppercase z-10 pointer-events-none">Checkout</label>
            <input 
              type="date"
              value={checkout}
              disabled={isLoading}
              onChange={(e) => setCheckout(e.target.value)}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              className="w-full h-full p-3 pt-6 text-[14px] outline-none bg-transparent hover:bg-gray-50 transition cursor-pointer appearance-none disabled:opacity-50"
              required
            />
          </div>
        </div>
        <div className="relative">
          <label className="absolute top-2 left-3 text-[10px] font-bold uppercase z-10 pointer-events-none">Guests</label>
          <select 
            value={guests}
            disabled={isLoading}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full p-3 pt-6 text-[14px] outline-none bg-transparent hover:bg-gray-50 transition cursor-pointer appearance-none disabled:opacity-50"
          >
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
          <ChevronDown size={20} className="text-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 text-red-600 text-sm font-semibold bg-red-50 p-3 rounded-lg border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Reserve Button */}
      {isReserved ? (
        <div className="w-full bg-[#3FAF75] text-white font-bold text-[16px] py-3.5 rounded-lg text-center shadow-sm transition">
          Reservation Confirmed! 🎉
        </div>
      ) : (
        <button 
          onClick={handleReserve}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-[#D89C2B] text-white font-bold text-[16px] py-3.5 rounded-lg hover:brightness-95 transition shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Check availability"
          )}
        </button>
      )}

      {/* Footer text */}
      <div className="text-center text-[14px] text-muted mt-4">
        You won't be charged yet
      </div>
    </div>
  );
}

