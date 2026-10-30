"use client";

import { useState } from "react";
import { X, Send, ShieldCheck, Phone, Mail, User } from "lucide-react";
import { saleInquiryApi } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ContactSellerModal({ isOpen, onClose, listing }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I am interested in your property "${listing?.title}". Please provide more details or let me know when we can schedule a site visit.`,
    inquiryType: "General",
    consentShareContact: true,
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in your name, email, and phone number.");
      return;
    }

    if (!formData.consentShareContact) {
      toast.error("Please consent to share contact details with the seller.");
      return;
    }

    setSubmitting(true);
    try {
      await saleInquiryApi.createInquiry({
        saleListingId: listing.id,
        listingId: listing.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        inquiryType: formData.inquiryType,
        consent: Boolean(formData.consentShareContact),
        consentShareContact: Boolean(formData.consentShareContact),
        preferredContactMethod: 'Phone',
      });
      toast.success("Inquiry sent successfully! The seller has been notified.");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to send inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-base font-black text-gray-950">Contact Seller</h3>
            <p className="text-xs text-gray-500 line-clamp-1">{listing.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-black transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-[11px]">
              Inquiry Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "General", label: "General" },
                { id: "Site Visit", label: "Site Visit" },
                { id: "Price Offer", label: "Price Offer" },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, inquiryType: type.id })}
                  className={`py-2 px-2 rounded-xl font-bold border transition text-center ${
                    formData.inquiryType === type.id
                      ? "border-[#FF385C] bg-red-50 text-[#FF385C]"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-[11px]">
              Full Name *
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                required
                placeholder="e.g. John Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-[11px]">
                Email Address *
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-[11px]">
                Phone Number *
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 text-[11px]">
              Your Message
            </label>
            <textarea
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#FF385C] focus:outline-none text-sm resize-none"
            />
          </div>

          {/* Privacy Consent */}
          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.consentShareContact}
              onChange={(e) => setFormData({ ...formData, consentShareContact: e.target.checked })}
              className="mt-0.5 rounded text-[#FF385C] focus:ring-[#FF385C]"
            />
            <span className="text-[11px] text-gray-600 leading-snug">
              I consent to share my contact number and email with the verified seller of this property so they can reach out regarding this inquiry.
            </span>
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {submitting ? (
                "Sending Inquiry..."
              ) : (
                <>
                  <Send size={15} />
                  <span>Send Inquiry to Seller</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 pt-1">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>Stayr privacy protected • Spam-free guarantee</span>
          </div>
        </form>
      </div>
    </div>
  );
}

