"use client";
import { useRouter } from "next/navigation";

export default function PropertyDetailLayout({ children, sidebar }) {
  const router = useRouter();
  return (
    <div className="flex flex-col lg:flex-row gap-12 mt-10 pb-16">
      {/* Left Column - Main Content */}
      <div className="w-full lg:w-2/3">
        {children}
      </div>

      {/* Right Column - Sticky Sidebar */}
      <div className="w-full lg:w-1/3 relative hidden md:block">
        {sidebar}
      </div>
      
      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="max-w-[400px] mx-auto w-full">
           {/* Assuming sidebar is the BookingCard, we don't render the whole card here, just a mobile summary usually, but for simplicity we can just render the button or tell the user to scroll up. */}
           <button 
             onClick={() => router.push('/booking-success')}
             className="w-full bg-[#E8B65B] hover:bg-[#D89C2B] transition text-white font-bold py-3.5 rounded-full shadow-sm"
           >
             Book now
           </button>
        </div>
      </div>
    </div>
  );
}
