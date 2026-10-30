"use client";

import { useState } from "react";
import { IndianRupee, Clock, Calendar, Percent, Shield, ChevronDown, ChevronUp } from "lucide-react";

const CANCELLATION_POLICIES = [
  {
    id: "Flexible",
    title: "Flexible",
    summary: "Full refund 1 day prior to arrival",
    description: "Guests can cancel up to 24 hours before check-in and get a full refund. Great for attracting more bookings.",
  },
  {
    id: "Moderate",
    title: "Moderate",
    summary: "Full refund 5 days prior to arrival",
    description: "Guests can cancel up to 5 days before check-in for a full refund. A balanced policy for most hosts.",
  },
  {
    id: "Strict",
    title: "Strict",
    summary: "Full refund within 48h of booking if 14+ days before arrival",
    description: "Higher protection against last-minute cancellations for high-demand luxury spaces.",
  },
];

export default function Step7Pricing({ formData, onChange }) {
  const [showAdvancedPricing, setShowAdvancedPricing] = useState(false);

  const pricePerNight = Number(formData.pricePerNight) || 0;
  const cleaningFee = Number(formData.cleaningFee) || 0;
  const securityDeposit = Number(formData.securityDeposit) || 0;

  // Approximate host earning (Stayr service fee standard ~3%)
  const hostEarning = Math.round(pricePerNight * 0.97);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Step Heading */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#FF385C] mb-3">
          <IndianRupee className="w-3.5 h-3.5" />
          Step 7: Pricing & Booking Terms
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Now, set your base nightly price
        </h1>
        <p className="mt-2 text-base text-gray-600">
          You can adjust pricing anytime and offer seasonal discounts.
        </p>
      </div>

      {/* Main Base Price Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center shadow-sm space-y-4 max-w-xl mx-auto">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
          Base Price per Night (INR ₹) <span className="text-[#FF385C]">*</span>
        </label>

        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl sm:text-5xl font-black text-gray-900">₹</span>
          <input
            type="number"
            min={100}
            max={500000}
            value={formData.pricePerNight || ""}
            onChange={(e) => onChange("pricePerNight", e.target.value)}
            placeholder="3500"
            className="w-48 sm:w-64 text-4xl sm:text-5xl font-black text-gray-900 text-center border-b-2 border-gray-300 focus:border-[#FF385C] focus:outline-none transition py-1"
          />
        </div>

        <p className="text-xs text-gray-500">
          Recommended competitive range for your area: ₹2,500 – ₹6,000 / night
        </p>

        {/* Earning Breakdown Card */}
        {pricePerNight > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100 bg-gray-50/70 p-4 rounded-2xl text-left space-y-2 text-xs text-gray-600">
            <div className="flex justify-between font-medium">
              <span>Guest base price:</span>
              <span className="font-bold text-gray-900">₹{pricePerNight.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span>Stayr host service fee (~3%):</span>
              <span className="text-gray-500">- ₹{Math.round(pricePerNight * 0.03).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-emerald-700 pt-2 border-t border-gray-200">
              <span>Your estimated take-home payout:</span>
              <span>₹{hostEarning.toLocaleString("en-IN")} / night</span>
            </div>
          </div>
        )}
      </div>

      {/* Optional Fees & Discounts Accordion */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setShowAdvancedPricing(!showAdvancedPricing)}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition cursor-pointer"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-base">Additional Fees & Long-Stay Discounts</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure cleaning fees, security deposit, weekly/monthly discounts
            </p>
          </div>
          <div className="p-2 text-gray-500">
            {showAdvancedPricing ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showAdvancedPricing && (
          <div className="p-6 pt-0 border-t border-gray-100 space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
              {/* Cleaning Fee */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Cleaning Fee (₹) <span className="text-gray-400 font-normal">(One-time per booking)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={formData.cleaningFee || ""}
                    onChange={(e) => onChange("cleaningFee", e.target.value)}
                    placeholder="500"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Security Deposit */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Security Deposit (₹) <span className="text-gray-400 font-normal">(Refundable)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={formData.securityDeposit || ""}
                    onChange={(e) => onChange("securityDeposit", e.target.value)}
                    placeholder="2000"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Weekly Discount */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Weekly Discount (%) <span className="text-gray-400 font-normal">(For stays 7+ nights)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={formData.weeklyDiscount || ""}
                    onChange={(e) => onChange("weeklyDiscount", e.target.value)}
                    placeholder="10"
                    className="w-full pr-8 pl-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400 font-bold">
                    %
                  </span>
                </div>
              </div>

              {/* Monthly Discount */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Monthly Discount (%) <span className="text-gray-400 font-normal">(For stays 28+ nights)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={formData.monthlyDiscount || ""}
                    onChange={(e) => onChange("monthlyDiscount", e.target.value)}
                    placeholder="20"
                    className="w-full pr-8 pl-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400 font-bold">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stay Duration Limits & Check-in / Checkout Times */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#FF385C]" />
          Stay Limits & Check-in Times
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Minimum Stay
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={365}
                value={formData.minStay || 1}
                onChange={(e) => onChange("minStay", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400">
                nights
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Maximum Stay <span className="text-gray-400 font-normal">(Opt)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={365}
                value={formData.maxStay || ""}
                onChange={(e) => onChange("maxStay", e.target.value)}
                placeholder="No limit"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400">
                nights
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Check-in Window
            </label>
            <select
              value={formData.checkInTime || "14:00"}
              onChange={(e) => onChange("checkInTime", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium bg-white"
            >
              <option value="12:00">From 12:00 PM</option>
              <option value="13:00">From 01:00 PM</option>
              <option value="14:00">From 02:00 PM (Standard)</option>
              <option value="15:00">From 03:00 PM</option>
              <option value="16:00">From 04:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Check-out Time
            </label>
            <select
              value={formData.checkOutTime || "11:00"}
              onChange={(e) => onChange("checkOutTime", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm font-medium bg-white"
            >
              <option value="10:00">By 10:00 AM</option>
              <option value="11:00">By 11:00 AM (Standard)</option>
              <option value="12:00">By 12:00 PM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cancellation Policy Cards */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#FF385C]" />
            Cancellation Policy
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Choose what policy applies when guests cancel their booking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {CANCELLATION_POLICIES.map((policy) => {
            const isSelected = (formData.cancellationPolicy || "Flexible") === policy.id;
            return (
              <button
                key={policy.id}
                type="button"
                onClick={() => onChange("cancellationPolicy", policy.id)}
                className={`p-5 rounded-2xl border-2 text-left transition flex flex-col justify-between cursor-pointer hover:border-[#FF385C]/60 ${
                  isSelected
                    ? "border-[#FF385C] bg-red-50/20 shadow-sm"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div>
                  <h4 className="font-bold text-gray-900 text-base">{policy.title}</h4>
                  <p className="text-xs font-bold text-[#FF385C] mt-1">{policy.summary}</p>
                  <p className="text-xs text-gray-500 mt-2">{policy.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
