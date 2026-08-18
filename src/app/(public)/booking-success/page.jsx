"use client";

import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <div className="flex flex-col items-center text-center mt-20 p-8 bg-white border border-[#EFE7D8] rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.12)] max-w-2xl mx-auto">
      <CheckCircle size={64} className="text-[#3FAF75] mb-6" />
      <h1 className="text-[32px] md:text-[40px] font-bold text-[#2B2B2B] leading-tight mb-4">
        Payment Successful!
      </h1>
      <p className="text-[18px] text-[#7B7468] mb-8">
        Your booking has been confirmed. You will receive an email shortly with your reservation details.
      </p>
      
      {bookingId && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg w-full">
          <p className="text-[#7B7468] text-sm">Booking Reference ID</p>
          <p className="text-[#2B2B2B] font-mono font-medium">{bookingId}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link href="/" className="flex-1 bg-gradient-to-r from-[#E8B65B] to-[#D89C2B] text-white font-bold text-[16px] py-4 rounded-lg hover:brightness-95 transition shadow-sm active:scale-[0.98]">
          Explore More Places
        </Link>
        <Link href="/dashboard" className="flex-1 bg-white text-[#2B2B2B] border-2 border-[#E8B65B] font-bold text-[16px] py-4 rounded-lg hover:bg-gray-50 transition shadow-sm active:scale-[0.98]">
          View My Bookings
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] pb-24">
      <Navbar forceCompact={true} />
      
      <motion.div 
        className="pt-[140px] md:pt-[180px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Container>
          <Suspense fallback={<div className="text-center mt-20 text-lg">Loading...</div>}>
            <SuccessContent />
          </Suspense>
        </Container>
      </motion.div>
    </div>
  );
}
