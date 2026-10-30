"use client";

import { useState } from "react";
import { ShieldCheck, Plus, X, Moon, Volume2, Flame, PawPrint, Users, Sparkles } from "lucide-react";

export default function Step8Rules({ formData, onChange }) {
  const [customRuleInput, setCustomRuleInput] = useState("");

  const houseRules = formData.houseRules || {
    petsAllowed: false,
    smokingAllowed: false,
    partiesAllowed: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    customRules: [],
  };

  const updateRule = (key, val) => {
    onChange("houseRules", {
      ...houseRules,
      [key]: val,
    });
  };

  const addCustomRule = () => {
    if (!customRuleInput.trim()) return;
    const current = houseRules.customRules || [];
    updateRule("customRules", [...current, customRuleInput.trim()]);
    setCustomRuleInput("");
  };

  const removeCustomRule = (index) => {
    const current = houseRules.customRules || [];
    updateRule(
      "customRules",
      current.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Step Heading */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#FF385C] mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          Step 8: House Rules & Declarations
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          House rules & host confirmation
        </h1>
        <p className="mt-2 text-base text-gray-600">
          Guests must agree to your rules before completing a booking reservation.
        </p>
      </div>

      {/* Standard Rules Toggles */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Standard House Rules</h2>

        <div className="divide-y divide-gray-100">
          {/* Pets Allowed */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gray-100 text-gray-700">
                <PawPrint className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">Pets allowed</p>
                <p className="text-xs text-gray-500">Allow guests to bring their pets</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={houseRules.petsAllowed || false}
                onChange={(e) => updateRule("petsAllowed", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF385C]"></div>
            </label>
          </div>

          {/* Smoking Allowed */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gray-100 text-gray-700">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">Smoking allowed</p>
                <p className="text-xs text-gray-500">Smoking permitted inside or balcony</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={houseRules.smokingAllowed || false}
                onChange={(e) => updateRule("smokingAllowed", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF385C]"></div>
            </label>
          </div>

          {/* Events/Parties */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gray-100 text-gray-700">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">Events & parties allowed</p>
                <p className="text-xs text-gray-500">Gatherings and celebrations allowed</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={houseRules.partiesAllowed || false}
                onChange={(e) => updateRule("partiesAllowed", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF385C]"></div>
            </label>
          </div>

          {/* Quiet Hours */}
          <div className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gray-100 text-gray-700">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">Quiet Hours</p>
                <p className="text-xs text-gray-500">Keep noise down for neighbors</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <input
                type="time"
                value={houseRules.quietHoursStart || "22:00"}
                onChange={(e) => updateRule("quietHoursStart", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-800"
              />
              <span className="text-gray-400">to</span>
              <input
                type="time"
                value={houseRules.quietHoursEnd || "08:00"}
                onChange={(e) => updateRule("quietHoursEnd", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Additional Custom House Rules */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Additional Custom Rules
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customRuleInput}
              onChange={(e) => setCustomRuleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomRule())}
              placeholder="e.g., Please remove footwear inside the villa"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 text-gray-900 text-sm"
            />
            <button
              type="button"
              onClick={addCustomRule}
              className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* List of Custom Rules */}
          {houseRules.customRules?.length > 0 && (
            <div className="space-y-2 pt-2">
              {houseRules.customRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800"
                >
                  <span>{rule}</span>
                  <button
                    type="button"
                    onClick={() => removeCustomRule(idx)}
                    className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Host Legal & Ownership Declaration */}
      <div className="bg-red-50/40 rounded-2xl border-2 border-red-200/80 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#FF385C]" />
          <h2 className="text-xl font-bold text-gray-900">Host Declarations & Confirmation</h2>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          To maintain trust and safety on Stayr, all hosts must confirm legal authorization to list their property.
        </p>

        <div className="space-y-4 pt-1">
          {/* Declaration 1 */}
          <label className="flex items-start gap-3.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.hostOwnershipConfirmed || false}
              onChange={(e) => onChange("hostOwnershipConfirmed", e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-[#FF385C] focus:ring-[#FF385C] cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-800 leading-snug">
              I certify that I am the legal owner of this property, or have explicit written authorization from the property owner to list and host guests at this property.
              <span className="text-[#FF385C] font-bold ml-1">*</span>
            </span>
          </label>

          {/* Declaration 2 */}
          <label className="flex items-start gap-3.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.hostTermsAccepted || false}
              onChange={(e) => onChange("hostTermsAccepted", e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-[#FF385C] focus:ring-[#FF385C] cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-800 leading-snug">
              I agree to Stayr's Host Standards, non-discrimination policies, and declare that all uploaded property photos and descriptions accurately reflect the current condition of the property.
              <span className="text-[#FF385C] font-bold ml-1">*</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
