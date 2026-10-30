"use client";

import { ShieldCheck, UserCheck, Mail, Phone, Lock, Sparkles } from "lucide-react";

export default function Step1HostProfile({ user, formData, onChange, onLoginRedirect }) {
  if (!user) {
    return (
      <div className="text-center py-12 px-4 max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-[#FF385C] rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6 text-sm">
          You must be logged in to create and manage property listings on Stayr.
        </p>
        <button
          type="button"
          onClick={onLoginRedirect}
          className="w-full py-3.5 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold rounded-xl shadow-md transition"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Heading */}
      <div className="text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#FF385C] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Step 1: Host Profile Verification
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome, {user.name?.split(" ")[0] || "Host"}!
        </h1>
        <p className="mt-2 text-base text-gray-600">
          Verify your host profile information. This verified profile will appear on your public listing to build trust with guests.
        </p>
      </div>

      {/* Host Verified Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-gray-100">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md flex-shrink-0">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#FF385C] text-white font-bold text-2xl">
                {user.name ? user.name[0].toUpperCase() : "H"}
              </div>
            )}
            <div className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full text-white ring-2 ring-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900 truncate">{user.name}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <UserCheck className="w-3.5 h-3.5" />
                Verified Host Account
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Member since {new Date(user.createdAt || Date.now()).getFullYear()}
            </p>
          </div>
        </div>

        {/* Profile Details Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Full Legal Name
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={user.name || ""}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Retrieved from your verified Stayr account.</p>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Contact Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                disabled
                value={user.email || ""}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Booking inquiries will be sent to this email.</p>
          </div>

          {/* Phone Number */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Host Phone Number <span className="text-[#FF385C]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={formData.hostPhone || user.phone || ""}
                onChange={(e) => onChange("hostPhone", e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium transition"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Required for urgent guest communication and booking verifications.
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Safety Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-gray-900">Host Protection</h4>
            <p className="text-xs text-gray-600 mt-0.5">Every booking includes damage protection and 24/7 support.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
          <UserCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-gray-900">Verified Guests</h4>
            <p className="text-xs text-gray-600 mt-0.5">Guests are identity-verified before reservations are confirmed.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-gray-900">Full Control</h4>
            <p className="text-xs text-gray-600 mt-0.5">You set your house rules, nightly prices, and booking calendars.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
