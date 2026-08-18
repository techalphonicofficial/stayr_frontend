"use client";

import { X, Copy, Mail, MessageCircle, MessageSquare, Code, MoreHorizontal, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShareModal({ isOpen, onClose, property }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const shareOptions = [
    { id: 'copy', label: copied ? 'Copied!' : 'Copy Link', icon: Copy, action: handleCopy },
    { id: 'email', label: 'Email', icon: Mail, action: () => window.open(`mailto:?subject=Check out this place&body=${window.location.href}`) },
    { id: 'messages', label: 'Messages', icon: MessageSquare, action: () => window.open(`sms:?&body=${window.location.href}`) },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, action: () => window.open(`https://wa.me/?text=${window.location.href}`) },
    { id: 'messenger', label: 'Messenger', icon: MessageCircle, action: () => window.open(`fb-messenger://share/?link=${window.location.href}`) },
    { id: 'facebook', label: 'Facebook', icon: Share2, action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`) },
    { id: 'twitter', label: 'Twitter', icon: Share2, action: () => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`) },
    { id: 'embed', label: 'Embed', icon: Code, action: () => {} },
    { id: 'more', label: 'More options', icon: MoreHorizontal, action: () => {
      if (navigator.share) {
        navigator.share({
          title: property?.title || 'Check out this place',
          url: window.location.href
        });
      }
    } },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden flex flex-col"
          >
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div className="w-8"></div> {/* Spacer for centering */}
              <h2 className="font-bold text-[#2B2B2B] text-[18px]">Share this place</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition w-8 h-8 flex items-center justify-center">
                <X size={18} className="text-[#2B2B2B]" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh]">
              {property && (
                <div className="flex gap-4 items-center mb-6">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image 
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200"}
                      alt={property.title || "Property"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[14px] text-[#2B2B2B]">
                      {property.propertyType || "Rental unit"} in {property.location || "Location"} · ★{property.rating} · {property.bedrooms} bedrooms · {property.guests} guests
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shareOptions.map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={opt.action}
                    className="flex items-center gap-4 p-4 border border-gray-300 rounded-xl hover:border-black transition text-left"
                  >
                    <opt.icon size={22} className="text-[#2B2B2B] shrink-0" strokeWidth={1.5} />
                    <span className="font-semibold text-[15px] text-[#2B2B2B]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
