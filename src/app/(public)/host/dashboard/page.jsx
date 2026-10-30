"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi, propertyApi } from "@/lib/api";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import Link from "next/link";
import {
  Plus,
  Home,
  CheckCircle2,
  Clock,
  FileEdit,
  AlertCircle,
  Eye,
  ExternalLink,
  Loader2,
  MapPin,
  IndianRupee,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
} from "lucide-react";

const TABS = [
  { id: "All", label: "All Properties" },
  { id: "Published", label: "Published" },
  { id: "PendingReview", label: "Pending Review" },
  { id: "Draft", label: "Drafts" },
  { id: "Rejected", label: "Action Needed" },
];

export default function HostDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const fetchHostData = useCallback(async () => {
    try {
      const profileRes = await authApi.getProfile();
      if (!profileRes || !profileRes.success || !profileRes.data) {
        router.push("/become-a-host");
        return;
      }
      setProfile(profileRes.data);

      // Fetch host's properties from backend
      const propsRes = await propertyApi.getMyProperties({
        status: activeTab === "All" ? "" : activeTab,
      });

      if (propsRes && propsRes.success) {
        setProperties(propsRes.data || []);
      }
    } catch (err) {
      console.error("Failed to load host dashboard", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, router]);

  useEffect(() => {
    fetchHostData();
  }, [fetchHostData]);

  // Handle Unlist / Relist
  const handleToggleStatus = async (property) => {
    setActionLoadingId(property.id);
    const action = property.status === "Published" ? "unlist" : "relist";
    try {
      const res = await propertyApi.toggleListingStatus(property.id, action);
      if (res && res.success) {
        setFeedbackMessage({
          type: "success",
          text: action === "unlist" ? "Property unlisted from search." : "Property republished successfully.",
        });
        fetchHostData();
      }
    } catch (err) {
      setFeedbackMessage({ type: "error", text: err.message || "Failed to update listing status." });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#FF385C] animate-spin mb-4" />
        <p className="text-gray-500 font-medium text-sm">Loading your Host Dashboard...</p>
      </div>
    );
  }

  // Calculate stats
  const totalListings = properties.length;
  const publishedListings = properties.filter((p) => p.status === "Published" && p.isApproved).length;
  const pendingReviewListings = properties.filter((p) => p.status === "PendingReview").length;
  const draftListings = properties.filter((p) => p.status === "Draft").length;

  return (
    <div className="min-h-screen bg-[#FCFCFD] flex flex-col">
      <Navbar forceCompact={true} />

      <main className="flex-1 pt-24 pb-20">
        <Container>
          {/* Dashboard Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-[#FF385C]">
                  HOST PORTAL
                </span>
                <span className="text-xs text-gray-400 font-medium">Stayr Listings Management</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Welcome back, {profile?.name?.split(" ")[0] || "Host"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your properties, monitor approval status, and create new listings.
              </p>
            </div>

            {/* Top Action: Create Listing */}
            <div className="flex items-center gap-3">
              <Link
                href="/become-a-host/wizard"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition cursor-pointer text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Listing</span>
              </Link>
            </div>
          </div>

          {/* Feedback Alert */}
          {feedbackMessage && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm font-semibold flex items-center justify-between ${
                feedbackMessage.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <span>{feedbackMessage.text}</span>
              <button
                onClick={() => setFeedbackMessage(null)}
                className="text-xs uppercase font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Properties</span>
                <Home className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900">{totalListings}</h3>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Live & Published</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-extrabold text-emerald-600">{publishedListings}</h3>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Under Review</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-3xl font-extrabold text-amber-600">{pendingReviewListings}</h3>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Drafts in Progress</span>
                <FileEdit className="w-4 h-4 text-blue-500" />
              </div>
              <h3 className="text-3xl font-extrabold text-blue-600">{draftListings}</h3>
            </div>
          </div>

          {/* Tabs Filter Bar */}
          <div className="flex items-center gap-2 border-b border-gray-200 mb-8 overflow-x-auto pb-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "border-[#FF385C] text-[#FF385C]"
                      : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Properties Grid or Empty State */}
          {properties.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 text-[#FF385C] flex items-center justify-center mx-auto">
                <Home className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {activeTab === "All"
                  ? "You don't have any properties listed yet"
                  : `No ${activeTab} properties found`}
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Start sharing your space with luxury travelers from around the world.
              </p>
              <Link
                href="/become-a-host/wizard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold rounded-xl shadow-md transition text-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Listing</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
                const coverImage =
                  property.featuredImage ||
                  property.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800";

                const isDraft = property.status === "Draft";
                const isPending = property.status === "PendingReview";
                const isPublished = property.status === "Published" && property.isApproved;
                const isRejected = property.status === "Rejected" || property.status === "ChangesRequested";
                const isUnlisted = property.status === "Unlisted" || (!property.isActive && isPublished);

                return (
                  <div
                    key={property.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
                  >
                    {/* Property Card Image Header */}
                    <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                      <img
                        src={coverImage}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800";
                          e.currentTarget.onerror = null;
                        }}
                      />

                      {/* Status Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                        {isPublished && !isUnlisted && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Live & Published</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {isDraft && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-700 text-white shadow flex items-center gap-1">
                            <FileEdit className="w-3.5 h-3.5" />
                            <span>Draft</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Action Needed</span>
                          </span>
                        )}
                        {isUnlisted && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-700 text-white shadow flex items-center gap-1">
                            <span>Unlisted</span>
                          </span>
                        )}
                      </div>

                      {/* Category Tag */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
                        {property.category || "Property"} • {property.propertyType || "Entire place"}
                      </div>
                    </div>

                    {/* Property Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-[#FF385C] transition">
                          {property.title || "Untitled Property"}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {property.city}, {property.country}
                          </span>
                        </p>

                        {/* Rejection / Change Request Notice */}
                        {isRejected && property.rejectionReason && (
                          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
                            <div className="font-bold flex items-center gap-1 text-red-800">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>Feedback from Reviewer:</span>
                            </div>
                            <p className="line-clamp-2">{property.rejectionReason}</p>
                          </div>
                        )}
                      </div>

                      {/* Pricing & Metadata */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <div>
                          <span className="text-base font-black text-gray-900">
                            ₹{property.pricePerNight?.toLocaleString("en-IN") || 0}
                          </span>
                          <span className="text-[11px]"> / night</span>
                        </div>
                        <div className="text-[11px]">
                          Updated {new Date(property.updatedAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="pt-2 flex items-center gap-2">
                        {/* Draft or Needs Changes -> Resume Wizard */}
                        {(isDraft || isRejected) && (
                          <Link
                            href={`/become-a-host/wizard?draftId=${property.id}`}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-xs shadow-sm transition text-center flex items-center justify-center gap-1.5"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                            <span>{isDraft ? "Resume Draft" : "Fix & Resubmit"}</span>
                          </Link>
                        )}

                        {/* Published -> View on Website & Unlist option */}
                        {isPublished && (
                          <>
                            <Link
                              href={`/property/${property.id}`}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition text-center flex items-center justify-center gap-1.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>View Listing</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(property)}
                              disabled={actionLoadingId === property.id}
                              className="py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
                              title={isUnlisted ? "Make live" : "Hide from search"}
                            >
                              {actionLoadingId === property.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : isUnlisted ? (
                                <>
                                  <ToggleLeft className="w-4 h-4 text-gray-400" />
                                  <span>Relist</span>
                                </>
                              ) : (
                                <>
                                  <ToggleRight className="w-4 h-4 text-emerald-600" />
                                  <span>Unlist</span>
                                </>
                              )}
                            </button>
                          </>
                        )}

                        {/* Pending Review -> Preview only */}
                        {isPending && (
                          <Link
                            href={`/property/${property.id}`}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition text-center flex items-center justify-center gap-1.5 border border-amber-200"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview Submission</span>
                          </Link>
                        )}

                        {/* Edit Link (Wizard) */}
                        <Link
                          href={`/become-a-host/wizard?draftId=${property.id}`}
                          className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition"
                          title="Edit in Listing Wizard"
                        >
                          <FileEdit className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
