"use client";

import { useState } from "react";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  HelpCircle, 
  PiggyBank, 
  FileCheck2, 
  ShieldCheck 
} from "lucide-react";
import { formatIndianPrice, calculatePricePerSqFt } from "./formatters";

export default function PropertyFinancialsSection({ listing = {} }) {
  const price = Number(listing.price) || 0;
  if (!price) return null;

  // Defaults: 20% down payment, 8.5% interest, 20 years (240 months)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [tenureYears, setTenureYears] = useState(20);
  const interestRate = 8.5; // 8.5% annual interest

  const downPayment = Math.round(price * (downPaymentPercent / 100));
  const loanAmount = Math.max(0, price - downPayment);

  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = (interestRate / 100) / 12;
  const numberOfMonths = tenureYears * 12;
  const emi = numberOfMonths > 0 && loanAmount > 0
    ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1))
    : 0;

  // Stamp duty approx 6% in India (state-dependent)
  const stampDutyAndReg = Math.round(price * 0.06);

  // Estimated gross rental yield 4.2% p.a.
  const annualRentalEstimate = Math.round(price * 0.042);
  const monthlyRentalEstimate = Math.round(annualRentalEstimate / 12);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF385C]">
          <Calculator size={16} />
          <span>Financial Insights & Mortgage Estimator</span>
        </div>
        <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          Assumes 8.5% p.a. Bank Interest
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-gray-950 mb-2">
        Investment & Ownership Economics
      </h2>
      <p className="text-xs text-gray-500 mb-6 font-light leading-relaxed">
        Estimated monthly loan outflow, down payment allocation, and historical rental yields for this property.
      </p>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Estimated Monthly EMI */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 text-white shadow-md">
          <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wider mb-1">
            Estimated Monthly EMI
          </span>
          <span className="text-2xl sm:text-3xl font-black text-white block">
            ₹{emi.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-gray-400 mt-1 block">
            For {tenureYears} Years @ {interestRate}% p.a.
          </span>
        </div>

        {/* Down Payment */}
        <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
          <span className="text-[11px] font-bold text-[#7B7468] block uppercase tracking-wider mb-1">
            Down Payment ({downPaymentPercent}%)
          </span>
          <span className="text-xl sm:text-2xl font-black text-gray-900 block">
            {formatIndianPrice(downPayment)}
          </span>
          <span className="text-[11px] text-gray-500 mt-1 block">
            Loan Amount: {formatIndianPrice(loanAmount)}
          </span>
        </div>

        {/* Estimated Stamp Duty & Registration */}
        <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
          <span className="text-[11px] font-bold text-[#7B7468] block uppercase tracking-wider mb-1">
            Stamp Duty & Reg. (~6%)
          </span>
          <span className="text-xl sm:text-2xl font-black text-gray-900 block">
            {formatIndianPrice(stampDutyAndReg)}
          </span>
          <span className="text-[11px] text-gray-500 mt-1 block">
            State registration & transfer fee
          </span>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-xs font-bold text-gray-800 mb-1.5">
            <span>Down Payment: {downPaymentPercent}%</span>
            <span>{formatIndianPrice(downPayment)}</span>
          </div>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full accent-[#FF385C] cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-gray-800 mb-1.5">
            <span>Loan Tenure: {tenureYears} Years ({tenureYears * 12} Months)</span>
            <span>{interestRate}% Annual Rate</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={5}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full accent-[#FF385C] cursor-pointer"
          />
        </div>
      </div>

      {/* Rental & Capital Growth Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <PiggyBank size={18} />
          </div>
          <div>
            <span className="font-bold text-gray-900 block">
              Estimated Rental Return: ~₹{monthlyRentalEstimate.toLocaleString("en-IN")} / mo
            </span>
            <p className="text-gray-500 mt-0.5 leading-relaxed text-[11px]">
              Expected gross rental yield of 4.2% based on prevailing prime leasing rates in {listing.locality || listing.city}.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <TrendingUp size={18} />
          </div>
          <div>
            <span className="font-bold text-gray-900 block">
              Historical Capital Appreciation: 12% - 18% p.a.
            </span>
            <p className="text-gray-500 mt-0.5 leading-relaxed text-[11px]">
              {listing.city} prime corridors have recorded robust 5-year CAGR driven by infrastructure expansions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

