"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function HostLoginCard() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col relative z-10 m-4"
    >
      {/* Close Button */}
      <button 
        onClick={() => router.back()}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-black/5 transition z-20"
      >
        <X size={20} className="text-[#2B2B2B]" />
      </button>

      {/* Body */}
      <div className="px-8 pb-10 pt-12 flex flex-col items-center relative z-10">
        <Image 
          src="/brand-logo.png" 
          alt="Stayr" 
          width={50} 
          height={50} 
          className="w-auto h-12 object-contain mb-4"
        />

        <h2 className="text-[22px] font-bold text-[#2B2B2B] mb-6">
          Log in or sign up
        </h2>

        <div className="w-full flex flex-col gap-4">
          <div className="border border-[#B0A89D] rounded-xl overflow-hidden focus-within:border-[#2B2B2B] focus-within:ring-1 focus-within:ring-[#2B2B2B] transition">
            <input 
              type="text" 
              placeholder="Phone number or email" 
              className="w-full p-4 outline-none text-[#2B2B2B] placeholder:text-[#7B7468]"
            />
          </div>
          
          <button className="w-full py-4 bg-[#E00B41] hover:bg-[#C00032] text-white font-bold rounded-xl transition shadow-sm text-lg">
            Continue
          </button>
        </div>

        <div className="flex flex-row items-center gap-4 w-full my-6">
          <div className="flex-1 h-[1px] bg-[#EFE7D8]"></div>
          <div className="text-sm text-[#7B7468]">or</div>
          <div className="flex-1 h-[1px] bg-[#EFE7D8]"></div>
        </div>

        <div className="flex flex-row items-center justify-center gap-4 w-full">
          <button className="flex-1 flex justify-center py-3 border border-[#B0A89D] rounded-xl hover:bg-black/5 transition">
            <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
          <button className="flex-1 flex justify-center py-3 border border-[#B0A89D] rounded-xl hover:bg-black/5 transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20" height="22">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" fill="#000000"/>
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
