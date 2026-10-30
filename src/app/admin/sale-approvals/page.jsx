"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Search, 
  Building2, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ExternalLink,
  X
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import { formatIndianPrice, formatArea } from "@/components/buy/formatters";
import { toast } from "react-hot-toast";

export default function AdminSaleApprovalsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PendingReview");
  const [search, setSearch] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [actionModal, setActionModal] = useState({ isOpen: false, type: "", listingId: null });
  const [actionReason, setActionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") q.append("status", statusFilter);
      if (search) q.append("search", search);

      const res = await adminApi.getAdminSaleListings(q.toString());
      if (res && res.success) {
        setListings(res.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load sale properties for review");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Handle Approve
  const handleApprove = async (id) => {
    if (!confirm("Are you sure you want to approve this listing? It will immediately become live on Stayr Real Estate.")) return;
    setSubmitting(true);
    try {
      await adminApi.approveSaleListing(id, "Verified & approved by Admin");
      toast.success("Listing approved and published live!");
      setSelectedListing(null);
      fetchListings();
    } catch (err) {
      toast.error(err.message || "Approval failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Reject / Request Changes confirmation
  const handleActionConfirm = async () => {
    if (!actionReason) {
      toast.error("Please provide a reason / feedback for the seller.");
      return;
    }
    setSubmitting(true);
    try {
      if (actionModal.type === "reject") {
        await adminApi.rejectSaleListing(actionModal.listingId, actionReason);
        toast.success("Listing rejected");
      } else if (actionModal.type === "changes") {
        await adminApi.requestChangesSaleListing(actionModal.listingId, actionReason);
        toast.success("Changes requested from seller");
      }
      setActionModal({ isOpen: false, type: "", listingId: null });
      setActionReason("");
      setSelectedListing(null);
      fetchListings();
    } catch (err) {
      toast.error(err.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-950">Real Estate Sale Approvals</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit and verify real estate sale properties submitted by sellers and hosts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, city, locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: "PendingReview", label: "Pending Review" },
          { id: "Published", label: "Approved / Live" },
          { id: "ChangesRequested", label: "Changes Requested" },
          { id: "Rejected", label: "Rejected" },
          { id: "all", label: "All Statuses" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              statusFilter === tab.id
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listings Table / Cards */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-gray-200 animate-pulse" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">Type / Specs</th>
                  <th className="p-4">Asking Price</th>
                  <th className="p-4">Seller Info</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <img
                            src={item.featuredImage || (item.images && item.images[0]?.url) || ""}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-xs">
                          <span className="font-bold text-gray-900 block truncate">{item.title}</span>
                          <span className="text-[11px] text-gray-400 block truncate">
                            {item.locality ? `${item.locality}, ` : ''}{item.city}, {item.state}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-gray-800">
                      <div>{item.bhk || item.propertyType}</div>
                      <div className="text-[11px] text-gray-400">{formatArea(item.area, item.areaUnit)}</div>
                    </td>

                    <td className="p-4 font-black text-gray-950 text-sm">
                      {formatIndianPrice(item.price)}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-gray-900">{item.seller?.name || "N/A"}</div>
                      <div className="text-[11px] text-gray-500">{item.seller?.phone || item.seller?.email}</div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === "Published"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "PendingReview"
                          ? "bg-amber-100 text-amber-800"
                          : item.status === "ChangesRequested"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedListing(item)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 font-bold transition"
                      >
                        Inspect
                      </button>

                      {item.status === "PendingReview" && (
                        <>
                          <button
                            onClick={() => handleApprove(item.id)}
                            disabled={submitting}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => setActionModal({ isOpen: true, type: "changes", listingId: item.id })}
                            className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-800 hover:bg-orange-200 font-bold transition"
                          >
                            Changes
                          </button>

                          <button
                            onClick={() => setActionModal({ isOpen: true, type: "reject", listingId: item.id })}
                            className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-bold transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Building2 size={36} className="mx-auto text-gray-400 mb-2" />
          <h3 className="font-bold text-gray-900 text-base mb-1">No listings to show</h3>
          <p className="text-xs text-gray-500">
            No sale properties match the selected status filter.
          </p>
        </div>
      )}

      {/* INSPECT MODAL */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-xs space-y-6">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#FF385C]">Audit Review</span>
                <h2 className="text-lg font-black text-gray-950">{selectedListing.title}</h2>
                <p className="text-xs text-gray-500">
                  {selectedListing.address}, {selectedListing.locality}, {selectedListing.city}, {selectedListing.state}
                </p>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            {/* Photos */}
            {selectedListing.images && selectedListing.images.length > 0 && (
              <div>
                <span className="font-bold text-gray-700 block mb-2">Uploaded Images ({selectedListing.images.length})</span>
                <div className="grid grid-cols-4 gap-2">
                  {selectedListing.images.map((img, i) => (
                    <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border">
                      <img src={img.url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div>
                <span className="text-gray-400 block text-[10px]">Price:</span>
                <span className="font-black text-gray-900 text-sm">{formatIndianPrice(selectedListing.price)}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Area:</span>
                <span className="font-black text-gray-900">{formatArea(selectedListing.area, selectedListing.areaUnit)}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Configuration:</span>
                <span className="font-black text-gray-900">{selectedListing.bhk || selectedListing.propertyType}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">RERA Number:</span>
                <span className="font-black text-blue-700">{selectedListing.reraNumber || "Not Provided"}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="font-bold text-gray-700 block mb-1">Description</span>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200 whitespace-pre-line">
                {selectedListing.description}
              </p>
            </div>

            {/* Seller Contact Info */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-blue-950 block">Seller: {selectedListing.seller?.name}</span>
                <span className="text-blue-800 text-[11px] block">Email: {selectedListing.seller?.email} | Phone: {selectedListing.seller?.phone || 'Not set'}</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-blue-200 text-blue-900 font-bold text-[10px]">
                {selectedListing.sellerType || "Owner"}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedListing(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 font-bold hover:bg-gray-50"
              >
                Close
              </button>

              <button
                onClick={() => handleApprove(selectedListing.id)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Approve & Publish Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTION PROMPT MODAL (Reject or Request Changes) */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border space-y-4 text-xs">
            <h3 className="text-base font-black text-gray-950">
              {actionModal.type === "reject" ? "Reject Sale Listing" : "Request Changes from Seller"}
            </h3>
            <p className="text-gray-500">
              {actionModal.type === "reject"
                ? "Provide the reason for rejection. The seller will be notified."
                : "Explain what information or photos the seller needs to update before approval."}
            </p>

            <textarea
              rows={3}
              required
              placeholder="e.g. Please provide valid RERA certificate number or clearer photos..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 resize-none text-xs"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal({ isOpen: false, type: "", listingId: null })}
                className="px-4 py-2 rounded-xl border hover:bg-gray-50 font-bold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleActionConfirm}
                disabled={submitting}
                className={`px-5 py-2 rounded-xl font-bold text-white ${
                  actionModal.type === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {submitting ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

