"use client";

import { ChevronLeft, ArrowRight, Loader2 } from "lucide-react";

export default function WizardFooter({
  currentStep,
  totalSteps = 9,
  onBack,
  onNext,
  isNextDisabled = false,
  isLoading = false,
  nextLabel,
}) {
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
      {/* Visual Progress Bar */}
      <div className="w-full h-1.5 bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-[#FF385C] transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          disabled={currentStep <= 1 || isLoading}
          className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl transition cursor-pointer ${
            currentStep <= 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-black"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Next / Continue Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          className="flex items-center justify-center gap-2 px-7 py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-[130px]"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>{nextLabel || (currentStep === totalSteps ? "Review & Submit" : "Continue")}</span>
              {currentStep < totalSteps && <ArrowRight className="w-4 h-4" />}
            </>
          )}
        </button>
      </div>
    </footer>
  );
}
