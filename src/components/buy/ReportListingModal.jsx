"use client";

import { useState } from "react";
import { X, AlertTriangle, ShieldAlert } from "lucide-react";
import { saleInquiryApi } from "@/lib/api";
import { toast } from "react-hot-toast";

const REPORT_REASONS = [
  "Incorrect or Misleading Price",
  "Property Already Sold or Unavailable",
  "Fake Photos or Misleading Location",
  "Suspected Fraud or Scam",
  "Inappropriate Content",
  "Other Issue",
];

export default function ReportListingModal({ isOpen, onClose, listing }) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await saleInquiryApi.reportListing(listing.id, { reason, details });
      toast.success("Thank you. Our Trust & Safety team will review this listing.");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
          <ShieldAlert size={22} />
        </div>

        <h3 className="text-base font-black text-gray-950 mb-1">Report This Listing</h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Help us keep Stayr Real Estate reliable and authentic for everyone.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-[10px]">
              Reason for Reporting
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-xs bg-white"
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-[10px]">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Please provide any helpful context..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-xs resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            {submitting ? "Submitting Report..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}

