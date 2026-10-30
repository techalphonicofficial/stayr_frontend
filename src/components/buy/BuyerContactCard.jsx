"use client";

import { useState } from "react";
import { 
  Heart, 
  Share2, 
  MessageSquare, 
  PhoneCall, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { formatIndianPrice, calculatePricePerSqFt, formatFullPrice } from "./formatters";
import { salePropertyApi } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function BuyerContactCard({ 
  listing, 
  onContactClick, 
  onCallbackClick, 
  onReportClick,
  isSavedInitially = false 
}) {
  const [isSaved, setIsSaved] = useState(isSavedInitially);
  const [isSaving, setIsSaving] = useState(false);

  if (!listing) return null;

  const pricePerSqFt = listing.pricePerSqFt
    ? `₹${Number(listing.pricePerSqFt).toLocaleString('en-IN')}/sq ft`
    : calculatePricePerSqFt(listing.price, listing.area);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    try {
      const res = await salePropertyApi.toggleSave(listing.id);
      if (res && res.saved !== undefined) {
        setIsSaved(res.saved);
        toast.success(res.saved ? "Saved to favorites" : "Removed from favorites");
      }
    } catch (err) {
      setIsSaved(!nextSavedState);
      toast.error(err.message || "Please sign in to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Listing link copied to clipboard!");
    }
  };

  const seller = listing.seller || {};
  const sellerDisplayName = seller.name || "Verified Property Seller";

  return (
    <div className="sticky top-28 bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-7 space-y-6">
      {/* Price Header */}
      <div>
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-3xl font-black text-gray-950 tracking-tight">
            {formatIndianPrice(listing.price)}
          </span>
          {listing.priceNegotiable && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Price Negotiable
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span>{pricePerSqFt ? `${pricePerSqFt}` : ''}</span>
          <span className="font-semibold text-gray-700">{formatFullPrice(listing.price)}</span>
        </div>
      </div>

      {/* Seller Brief Section */}
      <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0 border-2 border-white shadow-sm flex items-center justify-center font-black text-gray-600 text-lg">
          {seller.profileImage ? (
            <img src={seller.profileImage} alt={sellerDisplayName} className="w-full h-full object-cover" />
          ) : (
            sellerDisplayName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-900 text-sm truncate">{sellerDisplayName}</span>
            {seller.isVerified && (
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-500 capitalize">
            {listing.sellerType || "Property Owner"} • Stayr Partner
          </p>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
            <Clock size={11} />
            <span>Replies in ~2 hours</span>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onContactClick}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#FF385C] hover:bg-[#E00B41] text-white font-black text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <MessageSquare size={17} />
          <span>Contact Seller</span>
        </button>

        <button
          type="button"
          onClick={onCallbackClick}
          className="w-full py-3.5 px-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2"
        >
          <PhoneCall size={16} />
          <span>Request Callback</span>
        </button>

        {/* Save & Share Secondary Bar */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              isSaved
                ? "border-red-200 bg-red-50 text-[#FF385C]"
                : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
            }`}
          >
            <Heart size={15} className={isSaved ? "fill-[#FF385C] text-[#FF385C]" : ""} />
            <span>{isSaved ? "Saved" : "Save Property"}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-2.5 px-3 rounded-2xl border border-gray-200 hover:border-gray-300 text-gray-700 bg-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Buyer Protection Guarantee */}
      <div className="pt-2 border-t border-gray-100 space-y-2">
        <div className="flex items-start gap-2.5 text-xs text-gray-600">
          <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-gray-900 block">Stayr Buyer Safeguard</span>
            <span className="text-[11px] text-gray-500 leading-snug block">
              Verified legal titles, authentic photography and zero spam policy.
            </span>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onReportClick}
            className="text-[11px] font-semibold text-gray-400 hover:text-red-500 transition inline-flex items-center gap-1"
          >
            <AlertCircle size={12} />
            <span>Report this listing</span>
          </button>
        </div>
      </div>
    </div>
  );
}

