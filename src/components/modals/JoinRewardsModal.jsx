"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function JoinRewardsModal({ isOpen, onClose, onJoin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && phone) {
      onJoin();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[450px] overflow-hidden flex flex-col relative z-10"
          >
            {/* Header */}
            <div className="flex flex-row items-center justify-between p-4 border-b border-border">
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 transition absolute left-4"
              >
                <X size={20} className="text-foreground" />
              </button>
              <div className="w-full text-center font-bold text-foreground">
                Join Stayr Rewards
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex justify-center mb-6">
                 <Image 
                  src="/logo.png" 
                  alt="Stayr" 
                  width={40} 
                  height={40} 
                  className="w-auto h-10 object-contain"
                />
              </div>

              <p className="text-center text-muted mb-6 text-[15px]">
                Create your account to unlock member-only prices, earn StayrCash, and get exclusive perks.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-foreground">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Rahul Sharma" 
                    className="w-full px-4 py-3 border border-[#B0A89D] rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-foreground">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com" 
                    className="w-full px-4 py-3 border border-[#B0A89D] rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-bold text-foreground">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+91 98765 43210" 
                    className="w-full px-4 py-3 border border-[#B0A89D] rounded-xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 bg-primary hover:bg-[#D89C2B] text-foreground font-bold py-3.5 rounded-xl text-[16px] transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
