"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Eye, LayoutDashboard, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SubmissionSuccessModal({ property, onClose }) {
  if (!property) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 relative border border-gray-100"
      >
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-3">
            <Clock className="w-3.5 h-3.5" />
            Status: Pending Review
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Listing Submitted!
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Congratulations! <strong>{property.title}</strong> has been submitted to Stayr's verification team.
          </p>
        </div>

        {/* What Happens Next Card */}
        <div className="bg-gray-50 rounded-2xl p-5 text-left text-xs space-y-3 border border-gray-200">
          <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            What happens next:
          </h4>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-white border border-gray-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </span>
              <span>Our trust & safety team reviews your property details within 24 hours.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-white border border-gray-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <span>Once approved, your listing becomes live and visible in Stayr search.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-white border border-gray-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <span>You will receive email notifications when travelers request bookings.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/host/dashboard"
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Host Dashboard</span>
          </Link>

          <Link
            href={`/property/${property.id}`}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-sm transition flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Listing</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
