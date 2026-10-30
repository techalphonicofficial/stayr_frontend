"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function WizardHeader({
  currentStep,
  totalSteps = 9,
  saveStatus = "saved", // "saved", "saving", "error"
  onSaveAndExit,
  isSaving = false,
}) {
  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/brand-logo.png"
            alt="Stayr"
            width={140}
            height={48}
            className="w-auto h-8 object-contain"
          />
        </Link>

        {/* Step Counter Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
              Listing Setup
            </span>
            <span className="text-sm font-bold text-gray-900">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          {/* Auto-save Status Badge */}
          <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
            {saveStatus === "saving" && (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span className="hidden md:inline">Saving draft...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden md:inline">Draft saved</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden md:inline text-red-600">Save failed</span>
              </>
            )}
          </div>
        </div>

        {/* Save and Exit Action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSaveAndExit}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-150 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save & Exit"}
          </button>
        </div>
      </div>
    </header>
  );
}
