"use client";

import { X, Calendar, MapPin, Receipt, CreditCard, Users, Hotel } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TripDetailsModal({ isOpen, onClose, trip }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!trip) return null;

  const property = trip.property;
  const primaryImage = property?.featuredImage || "/placeholder-image.jpg";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div className="w-8"></div>
              <h2 className="font-bold text-foreground text-[18px]">Trip Details</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition w-8 h-8 flex items-center justify-center">
                <X size={18} className="text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[85vh]">
              
              {/* Property Snapshot */}
              <div className="flex flex-col md:flex-row gap-5 mb-8">
                <div className="relative w-full md:w-40 h-32 rounded-xl overflow-hidden shrink-0">
                  <Image 
                    src={primaryImage}
                    alt={property?.title || "Property"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-foreground mb-1">{property?.title}</h3>
                  <div className="flex items-center text-muted text-sm mb-3">
                    <MapPin size={14} className="mr-1" /> {property?.city}, {property?.country}
                  </div>
                  <span className={`w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    trip.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    trip.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    trip.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {trip.status}
                  </span>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Dates */}
                <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 font-bold text-foreground mb-3">
                    <Calendar className="text-primary" size={18} /> Dates
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-muted mb-1">Check-in</p>
                      <p className="font-semibold">{new Date(trip.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="w-8 border-t border-border mx-2"></div>
                    <div>
                      <p className="text-muted mb-1">Check-out</p>
                      <p className="font-semibold">{new Date(trip.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted mt-3 font-medium">{trip.nights} {trip.nights === 1 ? 'night' : 'nights'}</p>
                </div>

                {/* Guests */}
                <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 font-bold text-foreground mb-3">
                    <Users className="text-primary" size={18} /> Guests
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="font-bold text-lg text-foreground">{trip.guestsCount}</span>
                    </div>
                    <p className="font-semibold text-sm">Total Guests</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border border-border rounded-xl p-5 mb-4">
                <div className="flex items-center gap-2 font-bold text-lg text-foreground mb-4">
                  <Receipt className="text-primary" size={20} /> Payment Details
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">₹{trip.pricePerNight} x {trip.nights} {trip.nights === 1 ? 'night' : 'nights'}</span>
                    <span className="font-medium">₹{trip.pricePerNight * trip.nights}</span>
                  </div>
                  {trip.cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted">Cleaning fee</span>
                      <span className="font-medium">₹{trip.cleaningFee}</span>
                    </div>
                  )}
                  {trip.serviceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted">Stayr service fee</span>
                      <span className="font-medium">₹{trip.serviceFee}</span>
                    </div>
                  )}
                  {trip.taxes > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted">Taxes</span>
                      <span className="font-medium">₹{trip.taxes}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                    <span className="font-bold text-base text-foreground">Total (INR)</span>
                    <span className="font-bold text-lg text-foreground">₹{trip.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
                <CreditCard size={18} className="shrink-0" />
                <p>This payment was securely processed via Stayr payments platform.</p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
