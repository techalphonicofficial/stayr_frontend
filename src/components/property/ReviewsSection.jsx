import { Info } from "lucide-react";
import { useState } from "react";
import PropertyModal from "./PropertyModal";

export default function ReviewsSection({ rating, reviewCount, reviews = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!reviews || reviews.length === 0) return null;

  return (
    <div id="reviews-section" className="py-8 border-b border-gray-200">
      <h2 className="text-[22px] font-bold text-foreground mb-6">Reviews</h2>
      
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Rating Breakdown */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-[36px] font-bold text-success leading-none">
              {rating ? Number(rating).toFixed(2) : 0}/5
            </h3>
            <span className="font-bold text-foreground text-[15px]">Exceptional</span>
            <div className="flex items-center gap-1 text-[13px] text-muted">
              {reviewCount} verified reviews
              <Info size={14} className="text-muted" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 divide-x divide-gray-200 mt-2">
            <div className="flex flex-col items-center">
              <span className="font-bold text-foreground">{rating ? Number(rating).toFixed(1) : 5}</span>
              <span className="text-[11px] lg:text-[13px] text-muted truncate w-full text-center px-1">Cleanliness</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-foreground">{rating ? Number(rating).toFixed(1) : 5}</span>
              <span className="text-[11px] lg:text-[13px] text-muted truncate w-full text-center px-1">Communication</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-foreground">{rating ? Number(rating).toFixed(1) : 5}</span>
              <span className="text-[11px] lg:text-[13px] text-muted truncate w-full text-center px-1">Amenities</span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.slice(0, 2).map((review, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
              <h4 className="font-bold text-foreground text-[15px]">{review.rating}</h4>
              <p className="text-foreground text-[15px] leading-relaxed line-clamp-3">
                {review.text}
              </p>
              

              
              <div className="mt-auto pt-4 flex items-center gap-3">
                {review.avatar ? (
                  <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {review.author?.charAt(0) || 'A'}
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-[13px] text-foreground">{review.author}</span>
                  <span className="text-[12px] text-muted">{review.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="mt-6 border border-foreground text-foreground bg-white hover:bg-gray-50 font-semibold py-2 px-5 rounded-full transition"
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
          <div className="w-full md:w-1/3 flex flex-col gap-6 md:sticky md:top-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-[36px] font-bold text-success leading-none">
                {rating ? Number(rating).toFixed(2) : 0}/5
              </h3>
              <span className="font-bold text-foreground text-[15px]">Exceptional</span>
              <div className="flex items-center gap-1 text-[13px] text-muted">
                {reviewCount} verified review{reviewCount !== 1 ? 's' : ''}
                <Info size={14} className="text-muted" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex flex-col">
                <span className="text-[14px] text-muted">Cleanliness</span>
                <span className="font-bold text-foreground">{rating ? Number(rating).toFixed(1) : 5}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-muted">Communication</span>
                <span className="font-bold text-foreground">{rating ? Number(rating).toFixed(1) : 5}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-muted">Amenities</span>
                <span className="font-bold text-foreground">{rating ? Number(rating).toFixed(1) : 5}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-muted">Property conditions</span>
                <span className="font-bold text-foreground">{rating ? Number(rating).toFixed(1) : 5}</span>
              </div>
            </div>
          </div>

          {/* Right Column - All Reviews */}
          <div className="w-full md:w-2/3 flex flex-col gap-8">
            <h3 className="text-[18px] font-bold text-foreground">All reviews</h3>
            <div className="flex flex-col gap-8">
              {reviews.map((review, idx) => (
                <div key={idx} className="flex flex-col gap-2 pb-8 border-b border-gray-200 last:border-b-0">
                  <h4 className="font-bold text-foreground text-[15px]">{review.rating}</h4>
                  <p className="text-foreground text-[15px] leading-relaxed">
                    {review.text}
                  </p>
                  

                  
                  <div className="mt-2 flex items-center gap-3">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.author} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                        {review.author?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-[14px] text-foreground">{review.author}</span>
                      <span className="text-[13px] text-muted">{review.date}</span>
                      <span className="text-[13px] text-muted">Verified review</span>
                    </div>
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
