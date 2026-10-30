"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import Link from "next/link";
import { 
  Building2, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Phone, 
  Mail, 
  MessageSquare, 
  Archive,
  RefreshCw,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { salePropertyApi, saleInquiryApi } from "@/lib/api";
import { formatIndianPrice } from "@/components/buy/formatters";
import { toast } from "react-hot-toast";

const STATUS_TABS = [
  { id: "all", label: "All Listings" },
  { id: "Published", label: "Published" },
  { id: "PendingReview", label: "Pending Review" },
  { id: "ChangesRequested", label: "Action Needed" },
  { id: "Draft", label: "Drafts" },
  { id: "Sold", label: "Sold" },
  { id: "Withdrawn", label: "Withdrawn" },
];

export default function SellerDashboardPage() {
  const [activeMainTab, setActiveMainTab] = useState("listings"); // listings | inquiries
  const [activeStatusTab, setActiveStatusTab] = useState("all");
  const [listings, setListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  // Fetch Seller Listings
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const q = activeStatusTab === "all" ? {} : { status: activeStatusTab };
      const res = await salePropertyApi.getMySaleListings(q);
      if (res && res.success) {
        setListings(res.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Please log in to view your seller dashboard");
    } finally {
      setLoading(false);
    }
  }, [activeStatusTab]);

  // Fetch Seller Inquiries
  const fetchInquiries = useCallback(async () => {
    try {
      const res = await saleInquiryApi.getSellerInquiries();
      if (res && res.success) {
        setInquiries(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (activeMainTab === "listings") {
      fetchListings();
    } else {
      fetchInquiries();
    }
  }, [activeMainTab, fetchListings, fetchInquiries]);

  // Handle Action: Mark Sold
  const handleMarkSold = async (id) => {
    if (actionLoading[id]) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await salePropertyApi.toggleStatus(id, "sold");
      toast.success("Listing marked as Sold!");
      await fetchListings();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Handle Action: Withdraw
  const handleWithdraw = async (id) => {
    if (actionLoading[id]) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await salePropertyApi.toggleStatus(id, "withdraw");
      toast.success("Listing withdrawn from public view");
      await fetchListings();
    } catch (err) {
      toast.error(err.message || "Failed to withdraw listing");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Handle Action: Re-publish
  const handlePublish = async (id) => {
    if (actionLoading[id]) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await salePropertyApi.toggleStatus(id, "relist");
      toast.success("Listing published back live!");
      await fetchListings();
    } catch (err) {
      toast.error(err.message || "Failed to re-publish");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Handle Delete Draft
  const handleDeleteDraft = async (id) => {
    if (!confirm("Are you sure you want to delete this draft listing?")) return;
    try {
      await salePropertyApi.deleteSaleListing(id);
      toast.success("Draft deleted");
      fetchListings();
    } catch (err) {
      toast.error(err.message || "Failed to delete draft");
    }
  };

  // Handle Inquiry Status Update
  const handleInquiryStatus = async (inquiryId, newStatus) => {
    try {
      await saleInquiryApi.updateInquiryStatus(inquiryId, newStatus);
      toast.success(`Inquiry marked as ${newStatus}`);
      fetchInquiries();
    } catch (err) {
      toast.error(err.message || "Failed to update inquiry");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Published":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCircle2 size={12} /> Live</span>;
      case "PendingReview":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><Clock size={12} /> Under Review</span>;
      case "ChangesRequested":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 flex items-center gap-1"><AlertCircle size={12} /> Action Needed</span>;
      case "Sold":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">Sold</span>;
      case "Withdrawn":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-200 text-gray-700">Withdrawn</span>;
      case "Rejected":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">Draft</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar forceCompact={true} />

      <main className="pt-28 pb-24">
        <Container>
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Sparkles size={12} />
                <span>Seller Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-950">
                Real Estate Seller Hub
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Manage your real estate listings, view audit statuses, and track prospective buyer leads.
              </p>
            </div>

            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold shadow-md hover:shadow-lg transition hover:scale-105 active:scale-95 shrink-0"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>List New Property</span>
            </Link>
          </div>

          {/* Primary View Switcher: Listings vs Inquiries */}
          <div className="flex items-center gap-3 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveMainTab("listings")}
              className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
                activeMainTab === "listings"
                  ? "border-[#FF385C] text-[#FF385C]"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              <Building2 size={16} />
              <span>My Sale Listings ({listings.length})</span>
            </button>

            <button
              onClick={() => setActiveMainTab("inquiries")}
              className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
                activeMainTab === "inquiries"
                  ? "border-[#FF385C] text-[#FF385C]"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              <MessageSquare size={16} />
              <span>Buyer Inquiries ({inquiries.length})</span>
            </button>
          </div>

          {/* TAB 1: LISTINGS */}
          {activeMainTab === "listings" && (
            <div>
              {/* Secondary Status Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStatusTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                      activeStatusTab === tab.id
                        ? "bg-gray-900 text-white shadow-sm"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Loading Skeleton */}
              {loading && (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-28 bg-white rounded-3xl border border-gray-100 p-4 animate-pulse" />
                  ))}
                </div>
              )}

              {/* Listings List */}
              {!loading && listings.length > 0 && (
                <div className="space-y-4">
                  {listings.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                    >
                      {/* Left: Thumbnail & Main Info */}
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <img
                            src={
                              item.featuredImage ||
                              (item.images && item.images[0]?.url) ||
                              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
                            }
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            {getStatusBadge(item.status)}
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                              {item.category} • {item.propertyType}
                            </span>
                          </div>

                          <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">
                            {item.title}
                          </h3>

                          <p className="text-xs text-gray-500 mb-2">
                            {item.city}, {item.state} • Asking {formatIndianPrice(item.price)}
                          </p>

                          {/* Action Needed feedback from Admin */}
                          {item.status === "ChangesRequested" && item.adminFeedback && (
                            <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 max-w-xl">
                              <strong>Moderator Note:</strong> {item.adminFeedback}
                            </div>
                          )}
                          {item.status === "Rejected" && item.rejectionReason && (
                            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 max-w-xl">
                              <strong>Rejection Reason:</strong> {item.rejectionReason}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                        {item.status === "Published" && (
                          <>
                            <Link
                              href={`/buy/${item.slug || item.id}`}
                              target="_blank"
                              className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition"
                            >
                              <ExternalLink size={13} />
                              <span>View Live</span>
                            </Link>

                            <button
                              onClick={() => handleMarkSold(item.id)}
                              disabled={actionLoading[item.id]}
                              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 disabled:opacity-50 text-purple-700 text-xs font-bold transition"
                            >
                              {actionLoading[item.id] ? "Updating..." : "Mark Sold"}
                            </button>

                            <button
                              onClick={() => handleWithdraw(item.id)}
                              disabled={actionLoading[item.id]}
                              className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-xs font-bold text-gray-600 transition"
                            >
                              {actionLoading[item.id] ? "Updating..." : "Withdraw"}
                            </button>
                          </>
                        )}

                        {item.status === "Withdrawn" && (
                          <button
                            onClick={() => handlePublish(item.id)}
                            disabled={actionLoading[item.id]}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <RefreshCw size={13} className={actionLoading[item.id] ? "animate-spin" : ""} />
                            <span>{actionLoading[item.id] ? "Publishing..." : "Re-publish Live"}</span>
                          </button>
                        )}

                        {item.status === "Draft" && (
                          <button
                            onClick={() => handleDeleteDraft(item.id)}
                            className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete Draft"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && listings.length === 0 && (
                <div className="text-center py-16 px-4 bg-white rounded-3xl border border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center mx-auto mb-3">
                    <Building2 size={28} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">No listings found in this tab</h3>
                  <p className="text-xs text-gray-500 mb-5">
                    Start by listing your first property for sale on Stayr.
                  </p>
                  <Link
                    href="/sell"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF385C] text-white text-xs font-bold shadow-md"
                  >
                    <Plus size={14} />
                    <span>Create a Listing</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INQUIRIES */}
          {activeMainTab === "inquiries" && (
            <div className="space-y-4">
              {inquiries.length > 0 ? (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-950 text-sm">{inq.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                          {inq.inquiryType || "General"}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                        {inq.phone && (
                          <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-[#FF385C]">
                            <Phone size={13} className="text-emerald-600" />
                            <span>{inq.phone}</span>
                          </a>
                        )}
                        {inq.email && (
                          <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-[#FF385C]">
                            <Mail size={13} className="text-blue-600" />
                            <span>{inq.email}</span>
                          </a>
                        )}
                      </div>

                      <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 max-w-2xl">
                        "{inq.message}"
                      </p>

                      {inq.listing && (
                        <p className="text-[11px] text-gray-400">
                          Regarding: <strong className="text-gray-700">{inq.listing.title}</strong>
                        </p>
                      )}
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status || "New"}
                        onChange={(e) => handleInquiryStatus(inq.id, e.target.value)}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-white focus:outline-none"
                      >
                        <option value="New">Status: New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="SiteVisitScheduled">Site Visit Scheduled</option>
                        <option value="Closed">Deal Closed</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                  <MessageSquare size={32} className="mx-auto text-gray-400 mb-2" />
                  <h3 className="font-bold text-gray-900 text-base mb-1">No Buyer Inquiries Yet</h3>
                  <p className="text-xs text-gray-500">
                    When prospective buyers inquire or request callbacks, they will appear here.
                  </p>
                </div>
              )}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}

