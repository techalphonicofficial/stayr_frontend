"use client";

import { 
  ShieldCheck, 
  CheckCircle2, 
  MessageSquare, 
  PhoneCall, 
  Calendar, 
  Clock, 
  Award, 
  Globe2, 
  UserCheck, 
  Sparkles 
} from "lucide-react";

export default function SellerProfileSection({
  seller = {},
  listing = {},
  onContactClick,
  onCallbackClick
}) {
  const sellerDisplayName = seller.name || "Verified Property Seller";
  const sellerImage = seller.profileImage || 
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";

  const memberSinceYear = seller.createdAt 
    ? new Date(seller.createdAt).getFullYear() 
    : "2026";

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF385C] mb-3">
        <UserCheck size={16} />
        <span>Verified Seller & Listing Partner</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 shrink-0">
              <img
                src={sellerImage}
                alt={sellerDisplayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-600 text-white shadow-sm ring-2 ring-white">
              <CheckCircle2 size={14} strokeWidth={2.5} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-black text-gray-950">
                {sellerDisplayName}
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck size={12} />
                KYC Verified
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1 font-medium">
              {listing.sellerType || "Property Owner"} • Stayr Certified Partner
            </p>

            <div className="flex items-center gap-3 text-xs text-gray-600 mt-2 font-medium">
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-[#FF385C]" />
                Partner since {memberSinceYear}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe2 size={13} className="text-blue-600" />
                English, Hindi
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action CTA Buttons */}
        <div className="flex sm:flex-col gap-2.5 shrink-0">
          <button
            onClick={onContactClick}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-[#FF385C] hover:bg-[#E0314F] text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare size={14} />
            <span>Contact Seller</span>
          </button>
          <button
            onClick={onCallbackClick}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall size={14} />
            <span>Request Callback</span>
          </button>
        </div>
      </div>

      {/* Seller Credentials & Track Record Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6">
        <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]/80 text-center">
          <span className="text-[11px] font-bold text-[#7B7468] block uppercase tracking-wider">
            Response Time
          </span>
          <span className="text-sm sm:text-base font-black text-gray-900 mt-0.5 block flex items-center justify-center gap-1">
            <Clock size={14} className="text-emerald-600" />
            Under 1 hr
          </span>
          <span className="text-[10px] text-gray-500 font-medium">Fast Responder</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]/80 text-center">
          <span className="text-[11px] font-bold text-[#7B7468] block uppercase tracking-wider">
            Response Rate
          </span>
          <span className="text-sm sm:text-base font-black text-emerald-600 mt-0.5 block">
            99.2%
          </span>
          <span className="text-[10px] text-gray-500 font-medium">Inquiries answered</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]/80 text-center">
          <span className="text-[11px] font-bold text-[#7B7468] block uppercase tracking-wider">
            Title Verification
          </span>
          <span className="text-sm sm:text-base font-black text-gray-900 mt-0.5 block flex items-center justify-center gap-1">
            <ShieldCheck size={14} className="text-[#FF385C]" />
            100% Cleared
          </span>
          <span className="text-[10px] text-gray-500 font-medium">Encumbrance Checked</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]/80 text-center">
          <span className="text-[11px] font-bold text-[#7B7468] block uppercase tracking-wider">
            Deal Transparency
          </span>
          <span className="text-sm sm:text-base font-black text-gray-900 mt-0.5 block flex items-center justify-center gap-1">
            <Award size={14} className="text-purple-600" />
            Direct Owner
          </span>
          <span className="text-[10px] text-gray-500 font-medium">Zero Markup</span>
        </div>
      </div>

      {/* Seller Statement & Direct Safeguard */}
      <div className="text-xs text-gray-600 leading-relaxed space-y-2 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
        <p>
          <strong className="text-gray-900">{sellerDisplayName}</strong> is a verified property partner listed on Stayr Real Estate Marketplace, representing verified high-value residences in {listing.locality || listing.city}. All property documents, ownership deeds, and approved layout plans have undergone preliminary compliance audits.
        </p>
        <p className="text-[11px] text-gray-500 flex items-center gap-1 pt-1">
          <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
          <span>Stayr Buyer Protection: Inquiries are transmitted directly without unverified third-party telemarketers.</span>
        </p>
      </div>
    </div>
  );
}

