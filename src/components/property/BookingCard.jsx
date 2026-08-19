"use client";
import { useState, useEffect } from "react";
import { Info, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { bookingApi, paymentApi, settingsApi } from "@/lib/api";

export default function BookingCard({ property }) {
  const router = useRouter();

  // The authoritative tax rate from backend settings
  const [globalTaxRate, setGlobalTaxRate] = useState(0);

  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [localGuests, setLocalGuests] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);

  // Destructure property values
  const numericPrice = typeof property?.pricePerNight === 'number' ? property.pricePerNight : parseInt((property?.pricePerNight || "0").toString().replace(/[^\d]/g, ''), 10) || 0;
  const maxGuests = property?.maxGuests || 1;
  const rating = property?.averageRating ? property.averageRating.toFixed(2) : "New";
  const reviewCount = property?.totalReviews || 0;
  
  // Format helpers
  const todayStr = new Date().toISOString().split('T')[0];
  
  const calculateNights = (start, end) => {
    if (!start || !end) return 0;
    const diffTime = new Date(end) - new Date(start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 0;
  };

  const currentNights = calculateNights(checkIn, checkOut);

  // Price calculations matching backend pricingCalculator.js
  const roomSubtotal = numericPrice * currentNights;
  const subtotal = roomSubtotal > 0 ? roomSubtotal + (property?.cleaningFee || 0) + (property?.serviceFee || 0) : 0;
  const taxes = subtotal > 0 ? (subtotal * globalTaxRate) / 100 : 0; 
  const total = subtotal + taxes;
  
  const formattedPrice = "₹" + numericPrice.toLocaleString("en-IN");
  const formattedTaxes = "₹" + taxes.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const formattedTotal = "₹" + total.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  // Fetch taxes on mount
  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const res = await settingsApi.getTaxes();
        if (res && res.success && res.data && res.data.length > 0) {
          // Find active tax or just take the first one
          const activeTax = res.data.find(t => t.active);
          setGlobalTaxRate(activeTax ? activeTax.defaultPercentage : 0);
        }
      } catch (err) {
        console.error("Failed to fetch tax settings", err);
      }
    };
    fetchTaxes();
  }, []);

  // Handle Date Selection and Availability
  useEffect(() => {
    // Validate checkout constraints when checkIn changes
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
       setCheckOut("");
       setIsAvailable(null);
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    const checkPropertyAvailability = async () => {
      if (!checkIn || !checkOut) {
        setIsAvailable(null);
        setErrorMsg("");
        return;
      }
      
      setCheckingAvailability(true);
      setErrorMsg("");
      try {
        const res = await bookingApi.checkAvailability(property.id, checkIn, checkOut);
        if (res && res.success) {
          setIsAvailable(res.available);
          if (!res.available) {
             setErrorMsg("This property is no longer available for these dates.");
          }
        }
      } catch (err) {
        setErrorMsg(err.message || "Failed to check availability");
        setIsAvailable(false);
      } finally {
        setCheckingAvailability(false);
      }
    };

    // Debounce slightly to avoid aggressive checking while typing/clicking
    const timer = setTimeout(() => {
      checkPropertyAvailability();
    }, 300);

    return () => clearTimeout(timer);
  }, [checkIn, checkOut, property?.id]);

  const getButtonState = () => {
    if (!checkIn || !checkOut) return { text: "Select dates", disabled: true };
    if (!localGuests) return { text: "Add guests", disabled: true };
    if (checkingAvailability) return { text: "Checking availability...", disabled: true };
    if (isAvailable === false) return { text: "Dates unavailable", disabled: true };
    return { text: "Request to book", disabled: loading };
  };

  const buttonState = getButtonState();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async () => {
    if (buttonState.disabled) return;
    
    setErrorMsg("");
    setLoading(true);
    
    try {
      // 1. Create booking (Backend authoritative check)
      const bookingRes = await bookingApi.createBooking(property.id, checkIn, checkOut, Number(localGuests));
      if (!bookingRes || !bookingRes.data) throw new Error("Failed to create booking");
      const bookingId = bookingRes.data.id;

      // 2. Create Razorpay order using the backend-calculated final total
      const orderRes = await paymentApi.createRazorpayOrder(bookingId);
      if (!orderRes || !orderRes.data) throw new Error("Failed to create payment order");
      const { orderId, amount, currency } = orderRes.data;

      // 3. Load Razorpay
      const res = await loadRazorpayScript();
      if (!res) throw new Error("Razorpay SDK failed to load");

      // 4. Fire Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount,
        currency,
        name: "STAYR",
        description: "Booking Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            setLoading(true);
            await paymentApi.verifyPayment(
              bookingId,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            router.push(`/booking-success?bookingId=${bookingId}`);
          } catch (err) {
            setErrorMsg("Payment verification failed: " + err.message);
            setLoading(false);
          }
        },
        theme: { color: "#2B2B2B" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        setErrorMsg("Payment failed: " + response.error.description);
        setLoading(false);
      });
      paymentObject.open();

    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('unauthorized')) {
        setErrorMsg("Please log in to book this property.");
      } else {
        setErrorMsg(err.message || "Booking failed");
      }
      setLoading(false);
    }
  };

  if (!property) return null;

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
            {rating} {rating !== "New" && "Excellent"}
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
              min={todayStr}
              onChange={(e) => setCheckIn(e.target.value)}
              className="text-[14px] text-[#2B2B2B] bg-transparent outline-none w-full cursor-pointer mt-1"
            />
          </div>
          <div className="w-1/2 p-3 flex flex-col justify-center relative hover:bg-gray-50 transition">
            <span className="text-[10px] font-bold uppercase text-[#2B2B2B]">Check-out</span>
            <input 
              type="date" 
              value={checkOut}
              min={checkIn || todayStr}
              onChange={(e) => setCheckOut(e.target.value)}
              className="text-[14px] text-[#2B2B2B] bg-transparent outline-none w-full cursor-pointer mt-1"
            />
          </div>
        </div>
        <div className="p-3 flex justify-between items-center hover:bg-gray-50 transition relative">
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold uppercase text-[#2B2B2B]">Travelers</span>
            <select 
              value={localGuests}
              onChange={(e) => setLocalGuests(e.target.value)}
              className="text-[14px] text-[#2B2B2B] bg-transparent outline-none w-full appearance-none cursor-pointer mt-1"
            >
              <option value="" disabled>Add guests</option>
              {[...Array(maxGuests)].map((_, i) => (
                <option key={i} value={i + 1}>{i + 1} traveler{i + 1 > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <ChevronDown size={20} className="text-[#2B2B2B] absolute right-3 pointer-events-none" />
        </div>
      </div>

      {/* Total Section */}
      {checkIn && checkOut && currentNights > 0 ? (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#2B2B2B] underline">{formattedPrice} x {currentNights} nights</span>
            <span className="text-[#2B2B2B]">₹{(numericPrice * currentNights).toLocaleString("en-IN")}</span>
          </div>
          {property?.cleaningFee > 0 && (
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-[#2B2B2B] underline">Cleaning fee</span>
              <span className="text-[#2B2B2B]">₹{property.cleaningFee.toLocaleString("en-IN")}</span>
            </div>
          )}
          {property?.serviceFee > 0 && (
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-[#2B2B2B] underline">Service fee</span>
              <span className="text-[#2B2B2B]">₹{property.serviceFee.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#2B2B2B] underline flex items-center gap-1">Taxes ({globalTaxRate}%) <Info size={12} /></span>
            <span className="text-[#2B2B2B]">{formattedTaxes}</span>
          </div>
          <div className="border-t border-gray-200 my-2 pt-4 flex justify-between items-center text-[15px] font-bold">
            <span className="text-[#2B2B2B]">Total</span>
            <span className="text-[#2B2B2B]">{formattedTotal}</span>
          </div>
        </div>
      ) : (
        <div className="h-0 opacity-0 overflow-hidden pointer-events-none"></div>
      )}
      
      {errorMsg && (
        <div className="text-red-500 text-sm font-semibold">{errorMsg}</div>
      )}

      {/* Booking Button */}
      <button 
        onClick={handleBooking}
        disabled={buttonState.disabled}
        className={`w-full font-bold py-3.5 rounded-full transition text-[16px] shadow-sm flex justify-center items-center h-12 
          ${buttonState.disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#E8B65B] hover:bg-[#D89C2B] text-white'}`}
      >
        {loading || checkingAvailability ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          buttonState.text
        )}
      </button>

      <div className="text-center text-[13px] text-[#7B7468]">
        You won't be charged yet
      </div>
    </div>
  );
}
