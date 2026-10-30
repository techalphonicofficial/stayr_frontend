"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import { 
  Building2, 
  MapPin, 
  Camera, 
  IndianRupee, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Trash2, 
  Upload, 
  Sparkles,
  Info
} from "lucide-react";
import { salePropertyApi } from "@/lib/api";
import { formatIndianPrice } from "@/components/buy/formatters";
import { toast } from "react-hot-toast";

const STEPS = [
  { id: 1, title: "Category", desc: "Type of Property" },
  { id: 2, title: "Specifications", desc: "Area & Rooms" },
  { id: 3, title: "Location", desc: "City & Address" },
  { id: 4, title: "Photos", desc: "Upload Images" },
  { id: 5, title: "Pricing", desc: "Price & Terms" },
  { id: 6, title: "Legal & RERA", desc: "Ownership Details" },
  { id: 7, title: "Review", desc: "Publish Listing" },
];

const AMENITY_OPTIONS = [
  "Swimming Pool", "Gym", "Clubhouse", "24/7 Security", "Power Backup",
  "Covered Parking", "Lift / Elevator", "Kids Play Area", "Park / Garden",
  "EV Charging Station", "Piped Gas", "Visitor Parking", "Gated Community",
  "Air Conditioning", "CCTV Surveillance", "Rainwater Harvesting", "Private Terrace"
];

export const normalizePrice = (val) => {
  const num = parseFloat(val);
  if (!num || isNaN(num)) return 0;
  if (num > 0 && num <= 100) return Math.round(num * 10000000); // 2.5 -> ₹2.5 Cr
  if (num > 100 && num < 1000) return Math.round(num * 100000); // 85 -> ₹85 Lakh
  return Math.round(num);
};

export default function SellPropertyWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [draftId, setDraftId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmAccuracy, setConfirmAccuracy] = useState(true);

  // Form State
  const [form, setForm] = useState({
    category: "Residential",
    propertyType: "Apartment",
    title: "",
    description: "",
    // Specifications
    area: "",
    areaUnit: "sq ft",
    carpetArea: "",
    builtUpArea: "",
    superBuiltUpArea: "",
    plotArea: "",
    bedrooms: "3",
    bathrooms: "2",
    balconies: "2",
    floor: "5",
    totalFloors: "18",
    possessionStatus: "Ready to Move",
    furnishingStatus: "Semi-Furnished",
    propertyAge: "1-3 Years",
    facingDirection: "North-East",
    parking: "1 Covered Slot",
    // Location
    address: "",
    locality: "",
    city: "Noida",
    state: "Uttar Pradesh",
    postalCode: "",
    // Pricing
    price: "",
    priceNegotiable: true,
    additionalCharges: "",
    // Legal & Ownership
    ownershipType: "Freehold",
    sellerType: "Owner",
    reraApproved: true,
    reraNumber: "",
    // Amenities & Media
    amenities: ["24/7 Security", "Power Backup", "Lift / Elevator", "Covered Parking"],
    images: [],
  });

  const updateField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const toggleAmenity = (name) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(name);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== name)
          : [...prev.amenities, name],
      };
    });
  };

  // Save / Update Draft
  const saveDraft = async (showToast = true) => {
    setSaving(true);
    try {
      const calculatedPrice = normalizePrice(form.price);
      const payload = {
        ...form,
        price: calculatedPrice,
        area: form.area ? parseFloat(form.area) : (form.builtUpArea ? parseFloat(form.builtUpArea) : (form.carpetArea ? parseFloat(form.carpetArea) : 1000)),
        carpetArea: form.carpetArea ? parseFloat(form.carpetArea) : undefined,
        builtUpArea: form.builtUpArea ? parseFloat(form.builtUpArea) : undefined,
        superBuiltUpArea: form.superBuiltUpArea ? parseFloat(form.superBuiltUpArea) : undefined,
        bedrooms: form.category === "Commercial" ? undefined : (form.bedrooms ? parseInt(form.bedrooms, 10) : undefined),
        bathrooms: form.category === "Commercial" ? undefined : (form.bathrooms ? parseInt(form.bathrooms, 10) : undefined),
        balconies: form.category === "Commercial" ? undefined : (form.balconies ? parseInt(form.balconies, 10) : undefined),
        floor: form.floor !== "" ? parseInt(form.floor, 10) : undefined,
        totalFloors: form.totalFloors !== "" ? parseInt(form.totalFloors, 10) : undefined,
      };

      if (!draftId) {
        const res = await salePropertyApi.createDraft(payload);
        if (res && res.success && res.data) {
          setDraftId(res.data.id);
          if (showToast) toast.success("Draft created & saved!");
          return res.data.id;
        }
      } else {
        await salePropertyApi.updateDraft(draftId, payload);
        if (showToast) toast.success("Draft saved!");
        return draftId;
      }
    } catch (err) {
      if (showToast) toast.error(err.message || "Could not save draft. Please sign in.");
    } finally {
      setSaving(false);
    }
    return null;
  };

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    let targetId = draftId;
    if (!targetId) {
      targetId = await saveDraft(false);
      if (!targetId) {
        toast.error("Please sign in or save property basic details first.");
        return;
      }
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await salePropertyApi.uploadImages(targetId, formData);
      if (res && res.success && res.data) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...res.data],
        }));
        toast.success(`${files.length} photo(s) uploaded successfully!`);
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload images. Check file size (max 5MB each).");
    } finally {
      setUploading(false);
    }
  };

  // Image Delete
  const handleDeleteImage = async (imageId) => {
    if (!draftId) {
      setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img.id !== imageId) }));
      return;
    }
    try {
      await salePropertyApi.deleteImage(draftId, imageId);
      setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img.id !== imageId) }));
      toast.success("Image removed");
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  // Submit for Verification
  const handleSubmitForReview = async () => {
    if (!confirmAccuracy) {
      toast.error("Please confirm the listing is accurate and that you are authorised to advertise this property");
      return;
    }
    setSaving(true);
    try {
      let targetId = draftId;
      if (!targetId) {
        targetId = await saveDraft(false);
      } else {
        await saveDraft(false);
      }

      if (!targetId) {
        throw new Error("Please ensure draft is saved before submitting.");
      }

      await salePropertyApi.submitForReview(targetId, { confirmAccuracy: true });
      toast.success("Listing submitted for verification! Our team will review within 24 hours.");
      router.push("/sell/dashboard");
    } catch (err) {
      toast.error(err.message || "Submission failed. Please check required fields.");
    } finally {
      setSaving(false);
    }
  };

  // Validation before going to next step
  const handleNext = async () => {
    if (currentStep === 1) {
      if (!form.category || !form.propertyType) {
        toast.error("Please choose category and property type.");
        return;
      }
    }
    if (currentStep === 2) {
      if (!form.area && !form.builtUpArea && !form.carpetArea) {
        toast.error("Please enter at least built-up or carpet area.");
        return;
      }
    }
    if (currentStep === 3) {
      if (!form.city || !form.address) {
        toast.error("Please enter address and city.");
        return;
      }
    }
    if (currentStep === 5) {
      if (!form.price || parseFloat(form.price) <= 0) {
        toast.error("Please enter a valid sale price.");
        return;
      }
    }

    // Auto-save on next
    await saveDraft(false);
    setCurrentStep((prev) => Math.min(STEPS.length, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Auto-generate title if blank
  useEffect(() => {
    if (!form.title && form.city) {
      const bhkText = form.category === "Commercial" ? form.propertyType : `${form.bedrooms} BHK ${form.propertyType}`;
      const locText = form.locality ? `in ${form.locality}, ${form.city}` : `in ${form.city}`;
      updateField("title", `Luxurious ${bhkText} ${locText}`);
    }
  }, [form.category, form.propertyType, form.bedrooms, form.locality, form.city]);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar forceCompact={true} />

      <main className="pt-28 pb-24">
        <Container>
          {/* Progress Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-[#FF385C] uppercase tracking-wider">
                  Step {currentStep} of {STEPS.length}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-gray-950">
                  {STEPS[currentStep - 1].title} — {STEPS[currentStep - 1].desc}
                </h1>
              </div>

              <button
                type="button"
                onClick={() => saveDraft(true)}
                disabled={saving}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 hover:border-gray-400 bg-white text-xs font-bold text-gray-700 shadow-sm transition"
              >
                <Save size={14} />
                <span>{saving ? "Saving..." : "Save Draft"}</span>
              </button>
            </div>

            {/* Stepper Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#FF385C] h-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Wizard Card Body */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10">
            {/* STEP 1: CATEGORY & TYPE */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                    Choose Property Category
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "Residential", title: "Residential", desc: "Apartments, Villas, Builder Floors, Penthouses, Plots" },
                      { id: "Commercial", title: "Commercial", desc: "Office Spaces, Retail Shops, Showrooms, Warehouses" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => updateField("category", c.id)}
                        className={`p-5 rounded-2xl text-left border-2 transition ${
                          form.category === c.id
                            ? "border-[#FF385C] bg-red-50/50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="font-black text-gray-950 text-base block mb-1">{c.title}</span>
                        <span className="text-xs text-gray-500 leading-relaxed block">{c.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                    Select Property Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(form.category === "Commercial"
                      ? ["Office Space", "Shop / Showroom", "Commercial Land", "Warehouse", "Co-working Space"]
                      : ["Apartment", "Independent Villa", "Penthouse", "Builder Floor", "Residential Plot", "Studio Apartment"]
                    ).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateField("propertyType", type)}
                        className={`p-3.5 rounded-xl text-xs font-bold border transition ${
                          form.propertyType === type
                            ? "border-[#FF385C] bg-[#FF385C] text-white shadow-sm"
                            : "border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SPECIFICATIONS */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Area Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Carpet Area (sq ft)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1450"
                      value={form.carpetArea}
                      onChange={(e) => updateField("carpetArea", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Super Built-up Area (sq ft)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1850"
                      value={form.superBuiltUpArea || form.area}
                      onChange={(e) => {
                        updateField("superBuiltUpArea", e.target.value);
                        updateField("area", e.target.value);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Built-up Area (sq ft)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1650"
                      value={form.builtUpArea}
                      onChange={(e) => updateField("builtUpArea", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Configuration (Residential) */}
                {form.category !== "Commercial" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <select
                        value={form.bedrooms}
                        onChange={(e) => updateField("bedrooms", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>{num} BHK ({num} Beds)</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Bathrooms
                      </label>
                      <select
                        value={form.bathrooms}
                        onChange={(e) => updateField("bathrooms", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>{num} Baths</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Balconies
                      </label>
                      <select
                        value={form.balconies}
                        onChange={(e) => updateField("balconies", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm bg-white"
                      >
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>{num} Balconies</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Floor details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Property Floor
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      value={form.floor}
                      onChange={(e) => updateField("floor", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Total Floors in Building
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 24"
                      value={form.totalFloors}
                      onChange={(e) => updateField("totalFloors", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Facing Direction
                    </label>
                    <select
                      value={form.facingDirection}
                      onChange={(e) => updateField("facingDirection", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm bg-white"
                    >
                      {["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Furnishing & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Possession Status
                    </label>
                    <select
                      value={form.possessionStatus}
                      onChange={(e) => updateField("possessionStatus", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm bg-white"
                    >
                      <option value="Ready to Move">Ready to Move</option>
                      <option value="Under Construction">Under Construction</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Furnishing Status
                    </label>
                    <select
                      value={form.furnishingStatus}
                      onChange={(e) => updateField("furnishingStatus", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm bg-white"
                    >
                      <option value="Fully Furnished">Fully Furnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Age of Property
                    </label>
                    <select
                      value={form.propertyAge}
                      onChange={(e) => updateField("propertyAge", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm bg-white"
                    >
                      <option value="0-1 Year (New)">0-1 Year (New)</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5-10 Years">5-10 Years</option>
                      <option value="10+ Years">10+ Years</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: LOCATION */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Street Address & Tower / House No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tower 3, Flat 1204, Green Heights"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Locality / Sector *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sector 150, Noida Expressway"
                      value={form.locality}
                      onChange={(e) => updateField("locality", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Noida, Gurgaon, Mumbai"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Uttar Pradesh"
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Pincode / Postal Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 201310"
                      value={form.postalCode}
                      onChange={(e) => updateField("postalCode", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PHOTOS */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Upload Real Estate Photos</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    High quality photos increase buyer inquiries by over 300%. Add front facade, living room, bedrooms, kitchen, views & clubhouse. (Max 5MB each, JPG/PNG/WEBP).
                  </p>

                  {/* Upload Box */}
                  <label className="border-2 border-dashed border-gray-300 hover:border-[#FF385C] rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 hover:bg-red-50/20 transition group">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#FF385C] group-hover:scale-110 transition mb-3">
                      <Upload size={24} />
                    </div>
                    <span className="font-bold text-gray-900 text-sm mb-1">
                      {uploading ? "Uploading to Cloudinary..." : "Click to browse or drop photos"}
                    </span>
                    <span className="text-xs text-gray-400">
                      Supports up to 10 photos simultaneously
                    </span>
                  </label>
                </div>

                {/* Uploaded Gallery Grid */}
                {form.images && form.images.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                      Uploaded Images ({form.images.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {form.images.map((img, idx) => (
                        <div key={img.id || idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group border border-gray-200">
                          <img
                            src={typeof img === "string" ? img : img.url}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold">
                              Cover Photo
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(img.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md opacity-0 group-hover:opacity-100 transition hover:scale-110"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: PRICING */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Asking Sale Price (₹ INR) *
                  </label>
                  <div className="relative">
                    <IndianRupee size={18} className="absolute left-3.5 top-3.5 text-gray-500" />
                    <input
                      type="number"
                      required
                      placeholder="e.g. 18500000 (1.85 Crore)"
                      value={form.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-base font-bold text-gray-950"
                    />
                  </div>
                  {form.price && (
                    <div className="mt-2 text-sm font-extrabold text-[#FF385C]">
                      Expected Display: {formatIndianPrice(normalizePrice(form.price))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] text-gray-400">Quick set:</span>
                    {[
                      { label: "₹50 L", val: "5000000" },
                      { label: "₹1 Cr", val: "10000000" },
                      { label: "₹2.5 Cr", val: "25000000" },
                      { label: "₹5 Cr", val: "50000000" },
                    ].map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => updateField("price", chip.val)}
                        className="px-2.5 py-1 rounded-lg border border-gray-200 text-[11px] font-bold text-gray-600 hover:bg-gray-100 transition"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div>
                    <span className="font-bold text-gray-900 block text-xs">Price is Negotiable</span>
                    <span className="text-[11px] text-gray-500">Allow buyers to submit realistic counter offers</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.priceNegotiable}
                    onChange={(e) => updateField("priceNegotiable", e.target.checked)}
                    className="w-5 h-5 rounded text-[#FF385C] focus:ring-[#FF385C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Maintenance or Society Charges (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹4,500 / month"
                    value={form.additionalCharges}
                    onChange={(e) => updateField("additionalCharges", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: OWNERSHIP & LEGAL */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Ownership Type
                    </label>
                    <select
                      value={form.ownershipType}
                      onChange={(e) => updateField("ownershipType", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm bg-white"
                    >
                      <option value="Freehold">Freehold</option>
                      <option value="Leasehold">Leasehold</option>
                      <option value="Co-operative Society">Co-operative Society</option>
                      <option value="Power of Attorney">Power of Attorney</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Listed By (Seller Persona)
                    </label>
                    <select
                      value={form.sellerType}
                      onChange={(e) => updateField("sellerType", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm bg-white"
                    >
                      <option value="Owner">Owner</option>
                      <option value="Agent">Agent / Broker</option>
                      <option value="Builder">Builder / Developer</option>
                    </select>
                  </div>
                </div>

                {/* RERA */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block text-xs">RERA Approved Property</span>
                      <span className="text-[11px] text-gray-500">Government Real Estate Regulatory Authority compliance</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={form.reraApproved}
                      onChange={(e) => updateField("reraApproved", e.target.checked)}
                      className="w-5 h-5 rounded text-[#FF385C] focus:ring-[#FF385C]"
                    />
                  </div>

                  {form.reraApproved && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        RERA Registration Number *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. UPRERAAGT88210 / HARERAGGM1289"
                        value={form.reraNumber}
                        onChange={(e) => updateField("reraNumber", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 7: TITLE, DESCRIPTION, AMENITIES & REVIEW */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ultra Luxury 4 BHK Penthouse with Golf Course View"
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Detailed Property Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe key highlights, floor plan, views, sunlight, connectivity to highway/metro, society amenities..."
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm resize-none"
                  />
                </div>

                {/* Amenities Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Amenities & Features
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AMENITY_OPTIONS.map((am) => (
                      <button
                        key={am}
                        type="button"
                        onClick={() => toggleAmenity(am)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition text-left flex items-center justify-between ${
                          form.amenities.includes(am)
                            ? "border-[#FF385C] bg-red-50 text-[#FF385C]"
                            : "border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50"
                        }`}
                      >
                        <span>{am}</span>
                        {form.amenities.includes(am) && <CheckCircle2 size={13} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accuracy Declaration Checkbox */}
                <label className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100/60 transition">
                  <input
                    type="checkbox"
                    checked={confirmAccuracy}
                    onChange={(e) => setConfirmAccuracy(e.target.checked)}
                    className="mt-0.5 rounded text-[#FF385C] focus:ring-[#FF385C] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-gray-700 leading-snug">
                    I confirm that the listing details provided are accurate and that I am the owner or an authorized representative permitted to advertise this property on Stayr.
                  </span>
                </label>

                {/* Final Review Summary Callout */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                  <span className="font-black text-gray-950 block text-sm">Listing Summary:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-gray-700">
                    <div>
                      <span className="text-gray-400 block">Price:</span> 
                      <strong>{formatIndianPrice(normalizePrice(form.price))}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Type:</span> 
                      <strong>{form.category === "Commercial" ? form.propertyType : (form.bedrooms ? `${form.bedrooms} BHK ${form.propertyType}` : form.propertyType)}</strong>
                    </div>
                    <div><span className="text-gray-400 block">City:</span> <strong>{form.city}</strong></div>
                    <div><span className="text-gray-400 block">Photos:</span> <strong>{form.images?.length || 0} uploaded</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Navigation Footer */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition"
                >
                  <ArrowLeft size={15} />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-md transition"
                  >
                    <span>Continue</span>
                    <ArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitForReview}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] text-white text-sm font-black shadow-lg transition hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    <span>{saving ? "Submitting..." : "Submit for Verification"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

