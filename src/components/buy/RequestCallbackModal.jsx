"use client";

import { useState } from "react";
import { X, PhoneCall, ShieldCheck } from "lucide-react";
import { saleInquiryApi } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function RequestCallbackModal({ isOpen, onClose, listing }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setSubmitting(true);
    try {
      await saleInquiryApi.createInquiry({
        saleListingId: listing.id,
        listingId: listing.id,
        name: name || "Prospective Buyer",
        email: `${phone.replace(/\D/g, '')}@callback.stayr.com`,
        phone,
        message: `Callback requested for "${listing.title}". Please call me back at your earliest convenience.`,
        inquiryType: "Callback",
        consent: true,
        consentShareContact: true,
        preferredContactMethod: 'Phone',
      });
      toast.success("Callback request submitted! The seller will phone you shortly.");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#FF385C] flex items-center justify-center mb-3">
          <PhoneCall size={22} />
        </div>

        <h3 className="text-base font-black text-gray-950 mb-1">Request a Callback</h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Leave your contact number. The verified seller or authorized manager will call you back.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-[10px]">
              Your Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Verma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-[10px]">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm shadow-md transition disabled:opacity-50 mt-2"
          >
            {submitting ? "Submitting..." : "Get a Callback"}
          </button>

          <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 pt-1">
            <ShieldCheck size={11} className="text-emerald-600" />
            <span>Direct seller connect • No broker spam</span>
          </div>
        </form>
      </div>
    </div>
  );
}

