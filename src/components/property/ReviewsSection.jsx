import { Info } from "lucide-react";
import { useState } from "react";
import PropertyModal from "./PropertyModal";

export default function ReviewsSection({ rating, reviewCount, reviews = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-[22px] font-bold text-[#2B2B2B] mb-6">Reviews</h2>
      
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Rating Breakdown */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-[36px] font-bold text-[#128859] leading-none">
              {rating}/10
            </h3>
            <span className="font-bold text-[#2B2B2B] text-[15px]">Exceptional</span>
            <div className="flex items-center gap-1 text-[13px] text-[#7B7468]">
              {reviewCount} verified reviews
              <Info size={14} className="text-[#7B7468]" />
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <span className="font-bold text-[#2B2B2B]">10</span>
              <span className="text-[13px] text-[#7B7468]">Cleanliness</span>
            </div>
            <div className="flex flex-col items-center border-l border-r border-gray-200 px-6">
              <span className="font-bold text-[#2B2B2B]">10</span>
              <span className="text-[13px] text-[#7B7468]">Communication</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-[#2B2B2B]">10</span>
              <span className="text-[13px] text-[#7B7468]">Amenities</span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.slice(0, 2).map((review, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
              <h4 className="font-bold text-[#2B2B2B] text-[15px]">{review.rating}</h4>
              <p className="text-[#2B2B2B] text-[15px] leading-relaxed line-clamp-3">
                {review.text}
              </p>
              
              <div className="mt-auto pt-4 flex justify-between items-end">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-[13px] text-[#2B2B2B]">{review.author}</span>
                  <span className="text-[12px] text-[#7B7468]">{review.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="mt-6 border border-[#2B2B2B] text-[#2B2B2B] bg-white hover:bg-gray-50 font-semibold py-2 px-5 rounded-full transition"
      >
        See all {reviewCount} reviews
      </button>

      <PropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Guest reviews"
      >
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Left Column - Overall Rating */}
          <div className="w-full md:w-1/3 flex flex-col gap-6 sticky top-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-[36px] font-bold text-[#128859] leading-none">
                {rating}/10
              </h3>
              <span className="font-bold text-[#2B2B2B] text-[15px]">Exceptional</span>
              <div className="flex items-center gap-1 text-[13px] text-[#7B7468]">
                {reviewCount} verified review{reviewCount !== 1 ? 's' : ''}
                <Info size={14} className="text-[#7B7468]" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex flex-col">
                <span className="text-[14px] text-[#7B7468]">Cleanliness</span>
                <span className="font-bold text-[#2B2B2B]">10</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-[#7B7468]">Communication</span>
                <span className="font-bold text-[#2B2B2B]">10</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-[#7B7468]">Amenities</span>
                <span className="font-bold text-[#2B2B2B]">10</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-[#7B7468]">Property conditions</span>
                <span className="font-bold text-[#2B2B2B]">10</span>
              </div>
            </div>
          </div>

          {/* Right Column - All Reviews */}
          <div className="w-full md:w-2/3 flex flex-col gap-8">
            <h3 className="text-[18px] font-bold text-[#2B2B2B]">All reviews</h3>
            <div className="flex flex-col gap-8">
              {reviews.map((review, idx) => (
                <div key={idx} className="flex flex-col gap-2 pb-8 border-b border-gray-200 last:border-b-0">
                  <h4 className="font-bold text-[#2B2B2B] text-[15px]">{review.rating}</h4>
                  <p className="text-[#2B2B2B] text-[15px] leading-relaxed">
                    {review.text}
                  </p>
                  
                  <div className="mt-2 flex flex-col gap-1">
                    <span className="font-semibold text-[14px] text-[#2B2B2B]">{review.author}</span>
                    <span className="text-[13px] text-[#7B7468]">{review.date}</span>
                    <span className="text-[13px] text-[#7B7468]">Verified review</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PropertyModal>
    </div>
  );
}
