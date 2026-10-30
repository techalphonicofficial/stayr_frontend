"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi, propertyApi } from "@/lib/api";
import WizardHeader from "@/components/host/wizard/WizardHeader";
import WizardFooter from "@/components/host/wizard/WizardFooter";
import Step1HostProfile from "@/components/host/wizard/Step1HostProfile";
import Step2PropertyType from "@/components/host/wizard/Step2PropertyType";
import Step3BasicDetails from "@/components/host/wizard/Step3BasicDetails";
import Step4Location from "@/components/host/wizard/Step4Location";
import Step5Photos from "@/components/host/wizard/Step5Photos";
import Step6Amenities from "@/components/host/wizard/Step6Amenities";
import Step7Pricing from "@/components/host/wizard/Step7Pricing";
import Step8Rules from "@/components/host/wizard/Step8Rules";
import Step9Review from "@/components/host/wizard/Step9Review";
import SubmissionSuccessModal from "@/components/host/wizard/SubmissionSuccessModal";
import { Loader2 } from "lucide-react";

function WizardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryDraftId = searchParams.get("draftId");
  const queryStep = parseInt(searchParams.get("step") || "1", 10);

  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(queryStep || 1);
  const [draftId, setDraftId] = useState(queryDraftId || null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Apartment",
    propertyType: "Entire home",
    rentalDuration: "both",
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    sqft: "",
    highlights: [],
    country: "India",
    address: "",
    unitDetails: "",
    city: "",
    state: "",
    postalCode: "",
    latitude: null,
    longitude: null,
    amenities: ["Wi-Fi", "Air conditioning", "Hot water"],
    pricePerNight: 3500,
    cleaningFee: "",
    securityDeposit: "",
    weeklyDiscount: 10,
    monthlyDiscount: 20,
    minStay: 1,
    maxStay: "",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "Flexible",
    houseRules: {
      petsAllowed: false,
      smokingAllowed: false,
      partiesAllowed: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "08:00",
      customRules: [],
    },
    hostOwnershipConfirmed: false,
    hostTermsAccepted: false,
    hostPhone: "",
  });

  const [images, setImages] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved"); // "saved", "saving", "error"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submittedProperty, setSubmittedProperty] = useState(null);
  const [validationError, setValidationError] = useState("");

  // 1. Check Auth & Load Draft
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const profileRes = await authApi.getProfile();
        if (profileRes && profileRes.success && profileRes.data) {
          if (isMounted) {
            setUser(profileRes.data);
            if (profileRes.data.phone && !formData.hostPhone) {
              setFormData((prev) => ({ ...prev, hostPhone: profileRes.data.phone }));
            }
          }

          // If draftId exists in query, load draft
          if (queryDraftId) {
            try {
              const draftRes = await propertyApi.getManageProperty(queryDraftId);
              if (draftRes && draftRes.success && draftRes.data) {
                const d = draftRes.data;
                if (isMounted) {
                  setDraftId(d.id);
                  setImages(d.images || []);
                  setFeaturedImage(d.featuredImage || (d.images?.[0]?.url ?? null));

                  // Restore Form State
                  setFormData((prev) => ({
                    ...prev,
                    title: d.title === "Untitled Property Listing" ? "" : d.title || "",
                    description: d.description?.includes("Draft listing description in progress") ? "" : d.description || "",
                    category: d.category || prev.category,
                    propertyType: d.propertyType || prev.propertyType,
                    rentalDuration: d.bookingSettings?.rentalDuration || d.aboutProperty?.rentalDuration || prev.rentalDuration,
                    maxGuests: d.maxGuests || prev.maxGuests,
                    bedrooms: d.bedrooms ?? prev.bedrooms,
                    beds: d.beds || prev.beds,
                    bathrooms: d.bathrooms || prev.bathrooms,
                    sqft: d.aboutProperty?.sqft || "",
                    highlights: d.aboutProperty?.highlights || [],
                    country: d.country === "Country pending" ? "India" : d.country || prev.country,
                    address: d.address === "Address pending" ? "" : d.address || "",
                    unitDetails: d.aboutProperty?.unitDetails || "",
                    city: d.city === "City pending" ? "" : d.city || "",
                    state: d.state === "State pending" ? "" : d.state || "",
                    postalCode: d.postalCode || "",
                    latitude: d.latitude,
                    longitude: d.longitude,
                    amenities: d.amenities?.map((a) => (typeof a === "string" ? a : a.name)) || prev.amenities,
                    pricePerNight: d.pricePerNight || prev.pricePerNight,
                    cleaningFee: d.cleaningFee || "",
                    securityDeposit: d.damagePolicy?.securityDeposit || "",
                    weeklyDiscount: d.bookingSettings?.weeklyDiscount ?? 10,
                    monthlyDiscount: d.bookingSettings?.monthlyDiscount ?? 20,
                    minStay: d.bookingSettings?.minStay || 1,
                    maxStay: d.bookingSettings?.maxStay || "",
                    checkInTime: d.bookingSettings?.checkInTime || "14:00",
                    checkOutTime: d.bookingSettings?.checkOutTime || "11:00",
                    cancellationPolicy: d.cancellationPolicy?.type || prev.cancellationPolicy,
                    houseRules: d.houseRules || prev.houseRules,
                    hostOwnershipConfirmed: d.aboutProperty?.hostOwnershipConfirmed || false,
                    hostTermsAccepted: d.aboutProperty?.hostTermsAccepted || false,
                    hostPhone: d.aboutProperty?.hostPhone || profileRes.data.phone || "",
                  }));

                  // If draft saved a step, we can resume to it
                  if (d.aboutProperty?.currentStep && !queryStep) {
                    setCurrentStep(d.aboutProperty.currentStep);
                  }
                }
              }
            } catch (err) {
              console.error("Failed to load existing draft", err);
            }
          }
        } else {
          // Not logged in
          if (isMounted) setUser(null);
        }
      } catch (err) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsAuthLoading(false);
      }
    }

    init();
    return () => {
      isMounted = false;
    };
  }, [queryDraftId, queryStep]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveStatus("saving");
  };

  // Helper to construct payload for backend
  const buildPayload = useCallback((targetStep = currentStep) => {
    return {
      title: formData.title || "Untitled Property Listing",
      description: formData.description || "Draft listing description in progress.",
      category: formData.category || "Apartment",
      propertyType: formData.propertyType || "Entire home",
      address: formData.address || "Address pending",
      city: formData.city || "City pending",
      state: formData.state || "State pending",
      country: formData.country || "India",
      postalCode: formData.postalCode || null,
      latitude: formData.latitude,
      longitude: formData.longitude,
      pricePerNight: Number(formData.pricePerNight) || 0,
      cleaningFee: Number(formData.cleaningFee) || 0,
      currency: "INR",
      maxGuests: Number(formData.maxGuests) || 1,
      bedrooms: Number(formData.bedrooms) || 1,
      beds: Number(formData.beds) || 1,
      bathrooms: Number(formData.bathrooms) || 1,
      featuredImage: featuredImage || null,
      amenities: formData.amenities,
      aboutProperty: {
        sqft: formData.sqft ? Number(formData.sqft) : null,
        highlights: formData.highlights || [],
        unitDetails: formData.unitDetails || "",
        currentStep: targetStep,
        rentalDuration: formData.rentalDuration || "both",
        hostOwnershipConfirmed: formData.hostOwnershipConfirmed,
        hostTermsAccepted: formData.hostTermsAccepted,
        hostPhone: formData.hostPhone,
        lastSavedAt: new Date().toISOString(),
      },
      bookingSettings: {
        rentalDuration: formData.rentalDuration || "both",
        minStay: Number(formData.minStay) || 1,
        maxStay: formData.maxStay ? Number(formData.maxStay) : null,
        checkInTime: formData.checkInTime || "14:00",
        checkOutTime: formData.checkOutTime || "11:00",
        weeklyDiscount: Number(formData.weeklyDiscount) || 0,
        monthlyDiscount: Number(formData.monthlyDiscount) || 0,
      },
      houseRules: formData.houseRules,
      cancellationPolicy: {
        type: formData.cancellationPolicy || "Flexible",
      },
      damagePolicy: {
        securityDeposit: Number(formData.securityDeposit) || 0,
      },
    };
  }, [formData, currentStep, featuredImage]);

  // Save draft helper
  const saveDraft = useCallback(async (targetStep = currentStep) => {
    if (!user) return null;
    setIsSaving(true);
    setSaveStatus("saving");

    try {
      const payload = buildPayload(targetStep);

      if (!draftId) {
        // Create initial draft
        const res = await propertyApi.createDraftProperty(payload);
        if (res && res.success && res.data) {
          const newId = res.data.id || res.data._id;
          setDraftId(newId);
          setSaveStatus("saved");
          // Update URL silently
          window.history.replaceState(null, "", `/become-a-host/wizard?draftId=${newId}&step=${targetStep}`);
          return newId;
        }
      } else {
        // Update existing draft
        const res = await propertyApi.updateDraftProperty(draftId, payload);
        if (res && res.success) {
          setSaveStatus("saved");
          window.history.replaceState(null, "", `/become-a-host/wizard?draftId=${draftId}&step=${targetStep}`);
          return draftId;
        }
      }
    } catch (err) {
      console.error("Failed to auto-save draft", err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
    return draftId;
  }, [user, draftId, buildPayload, currentStep]);

  // Validate current step before advancing
  const validateStep = (step) => {
    setValidationError("");
    if (step === 1) {
      if (!user) {
        setValidationError("Please log in to continue.");
        return false;
      }
      if (!formData.hostPhone && !user.phone) {
        setValidationError("Please enter your contact phone number.");
        return false;
      }
    } else if (step === 2) {
      if (!formData.category) {
        setValidationError("Please select a property category.");
        return false;
      }
      if (!formData.propertyType) {
        setValidationError("Please choose a space type.");
        return false;
      }
    } else if (step === 3) {
      if (!formData.title || formData.title.trim().length < 5) {
        setValidationError("Property title must be at least 5 characters.");
        return false;
      }
      if (!formData.description || formData.description.trim().length < 20) {
        setValidationError("Property description must be at least 20 characters.");
        return false;
      }
      if ((formData.maxGuests || 1) < 1) {
        setValidationError("Guest capacity must be at least 1.");
        return false;
      }
    } else if (step === 4) {
      if (!formData.address || !formData.address.trim()) {
        setValidationError("Please enter your street address.");
        return false;
      }
      if (!formData.city || !formData.city.trim()) {
        setValidationError("Please enter the city.");
        return false;
      }
      if (!formData.state || !formData.state.trim()) {
        setValidationError("Please enter the state.");
        return false;
      }
      if (!formData.country) {
        setValidationError("Please select a country.");
        return false;
      }
    } else if (step === 5) {
      if (images.length === 0) {
        setValidationError("Please upload at least 1 photo of your property.");
        return false;
      }
    } else if (step === 6) {
      if (!formData.amenities || formData.amenities.length === 0) {
        setValidationError("Please select at least 1 amenity.");
        return false;
      }
    } else if (step === 7) {
      if (!formData.pricePerNight || Number(formData.pricePerNight) <= 0) {
        setValidationError("Please enter a valid nightly price greater than ₹0.");
        return false;
      }
    } else if (step === 8) {
      if (!formData.hostOwnershipConfirmed) {
        setValidationError("You must confirm property ownership or authorization to list.");
        return false;
      }
      if (!formData.hostTermsAccepted) {
        setValidationError("You must accept the hosting terms and accuracy declaration.");
        return false;
      }
    }
    return true;
  };

  // Step Navigation Handlers
  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    const nextStepNum = currentStep + 1;
    // Auto-save draft before proceeding
    const savedId = await saveDraft(nextStepNum);

    if (currentStep < 9) {
      setCurrentStep(nextStepNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStepNum = currentStep - 1;
      setCurrentStep(prevStepNum);
      saveDraft(prevStepNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGoToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    saveDraft(stepNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveAndExit = async () => {
    await saveDraft(currentStep);
    router.push("/host/dashboard");
  };

  // Submit Final Listing For Review
  const handleSubmitListing = async () => {
    if (!validateStep(currentStep)) return;
    setSubmissionError("");
    setIsSubmitting(true);

    try {
      // 1. Ensure latest changes saved
      let currentDraftId = draftId;
      if (!currentDraftId) {
        currentDraftId = await saveDraft(currentStep);
      } else {
        await saveDraft(currentStep);
      }

      if (!currentDraftId) {
        throw new Error("Could not find or save listing draft.");
      }

      // 2. Submit for review endpoint
      const res = await propertyApi.submitForReview(currentDraftId);
      if (res && res.success) {
        setSubmittedProperty(res.data);
      } else {
        throw new Error(res.message || "Failed to submit property for review.");
      }
    } catch (err) {
      setSubmissionError(err.message || "An unexpected error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#FF385C] animate-spin mb-4" />
        <p className="text-gray-500 font-medium text-sm">Loading listing setup...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFD] flex flex-col text-gray-900 pb-28">
      {/* Wizard Header */}
      <WizardHeader
        currentStep={currentStep}
        totalSteps={9}
        saveStatus={saveStatus}
        onSaveAndExit={handleSaveAndExit}
        isSaving={isSaving}
      />

      {/* Main Form Content Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {validationError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center justify-between">
            <span>{validationError}</span>
            <button
              onClick={() => setValidationError("")}
              className="text-red-500 hover:text-red-700 text-xs uppercase cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Step Views */}
        {currentStep === 1 && (
          <Step1HostProfile
            user={user}
            formData={formData}
            onChange={handleFieldChange}
            onLoginRedirect={() => router.push("/become-a-host")}
          />
        )}

        {currentStep === 2 && (
          <Step2PropertyType
            formData={formData}
            onChange={handleFieldChange}
          />
        )}

        {currentStep === 3 && (
          <Step3BasicDetails
            formData={formData}
            onChange={handleFieldChange}
          />
        )}

        {currentStep === 4 && (
          <Step4Location
            formData={formData}
            onChange={handleFieldChange}
          />
        )}

        {currentStep === 5 && (
          <Step5Photos
            draftId={draftId}
            images={images}
            featuredImage={featuredImage}
            onImagesChange={setImages}
            onFeaturedChange={setFeaturedImage}
          />
        )}

        {currentStep === 6 && (
          <Step6Amenities
            selectedAmenities={formData.amenities || []}
            onChange={handleFieldChange}
          />
        )}

        {currentStep === 7 && (
          <Step7Pricing
            formData={formData}
            onChange={handleFieldChange}
          />
        )}

        {currentStep === 8 && (
          <Step8Rules
            formData={formData}
            onChange={handleFieldChange}
          />
        )}

        {currentStep === 9 && (
          <Step9Review
            user={user}
            formData={formData}
            images={images}
            featuredImage={featuredImage}
            onGoToStep={handleGoToStep}
            onSubmit={handleSubmitListing}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
          />
        )}
      </main>

      {/* Wizard Fixed Footer */}
      <WizardFooter
        currentStep={currentStep}
        totalSteps={9}
        onBack={handleBack}
        onNext={currentStep === 9 ? handleSubmitListing : handleNext}
        isLoading={isSaving || isSubmitting}
        nextLabel={currentStep === 9 ? "Submit for Review" : undefined}
      />

      {/* Success Modal */}
      {submittedProperty && (
        <SubmissionSuccessModal
          property={submittedProperty}
          onClose={() => router.push("/host/dashboard")}
        />
      )}
    </div>
  );
}

export default function WizardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#FF385C] animate-spin mb-4" />
          <p className="text-gray-500 font-medium text-sm">Loading Stayr Host Wizard...</p>
        </div>
      }
    >
      <WizardInner />
    </Suspense>
  );
}
