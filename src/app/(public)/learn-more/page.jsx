"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import Image from "next/image";
import { Coins, Map, ShieldCheck, Sparkles, Check } from "lucide-react";
import JoinRewardsModal from "@/components/modals/JoinRewardsModal";
import { motion, AnimatePresence } from "framer-motion";

export default function LearnMorePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const tiers = [
    {
      name: "Blue",
      spend: "Free to join",
      color: "border-[#A0B0C0] bg-[#F4F6F9]",
      perks: [
        "Instant 10% off member prices",
        "Earn 1% in StayrCash on all bookings",
        "Free standard support"
      ]
    },
    {
      name: "Silver",
      spend: "Spend ₹50,000/year",
      color: "border-[#C0C0C0] bg-[#F7F7F7]",
      perks: [
        "15% off member prices",
        "Earn 2% in StayrCash",
        "Early check-in (subject to availability)",
        "Priority 24/7 support"
      ]
    },
    {
      name: "Gold",
      spend: "Spend ₹2,00,000/year",
      color: "border-[#E8B65B] bg-[#FFFBF0]",
      perks: [
        "20% off member prices",
        "Earn 3% in StayrCash",
        "Guaranteed early check-in & late check-out",
        "Free airport transfers",
        "Welcome amenities (local artisanal hampers)"
      ]
    },
    {
      name: "Platinum",
      spend: "Spend ₹5,00,000/year",
      color: "border-[#2B2B2B] bg-[#F3F4F6]",
      perks: [
        "25% off member prices",
        "Earn 5% in StayrCash",
        "Invite-only luxury heritage experiences",
        "Dedicated 24/7 personal concierge",
        "Complimentary private dining experiences"
      ]
    }
  ];

  const faqs = [
    {
      q: "What is StayrCash?",
      a: "StayrCash is our rewards currency. 1 StayrCash = ₹1. You can use it to book any property across India, from a Goa beachfront villa to a Himalayan retreat."
    },
    {
      q: "When do I earn StayrCash?",
      a: "You earn StayrCash as soon as you complete an eligible stay. The amount you earn depends on your current tier."
    },
    {
      q: "Does my StayrCash expire?",
      a: "No! As long as you make at least one booking every 18 months, your StayrCash will never expire."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] pb-24">
      <Navbar forceCompact={true} />
      
      {/* Hero Section */}
      <div className="relative pt-[80px] md:pt-[100px]">
        <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px]">
          {/* Using an unplash image of Indian architecture/luxury */}
          <Image 
            src="https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&q=80&w=2000"
            alt="Indian Luxury Stay"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <Container className="relative h-full flex flex-col justify-center items-center text-center text-white">
            {!hasJoined && (
              <div className="bg-[#2B2B2B]/80 backdrop-blur-md p-8 md:p-12 rounded-2xl max-w-3xl border border-white/20">
                <div className="flex justify-center mb-4">
                  <Sparkles className="w-12 h-12 text-[#E8B65B]" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Unlock the Best of India with Stayr Rewards</h1>
                <p className="text-lg md:text-xl text-[#FFF6E6]">
                  Earn StayrCash on every booking and unlock exclusive perks across our premium properties.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-8 bg-[#E8B65B] hover:bg-[#D89C2B] text-[#2B2B2B] font-bold py-4 px-10 rounded-full text-lg transition-colors"
                >
                  Join for free
                </button>
              </div>
            )}
          </Container>
        </div>
      </div>

      <Container>
        {/* Value Proposition */}
        <div className="py-20 border-b border-[#EFE7D8]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">How Stayr Rewards works</h2>
            <p className="text-[#7B7468] text-lg">It's incredibly simple. The more you explore, the more rewarding your stays become.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFF6E6] text-[#E8B65B] rounded-full flex items-center justify-center mb-6">
                <Map size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#2B2B2B] mb-3">Explore India</h3>
              <p className="text-[#7B7468]">Book incredible stays across India, from vibrant metros to serene getaways.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFF6E6] text-[#E8B65B] rounded-full flex items-center justify-center mb-6">
                <Coins size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#2B2B2B] mb-3">Earn StayrCash</h3>
              <p className="text-[#7B7468]">Earn rewards on every eligible booking. 1 StayrCash equals ₹1. It's real value.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FFF6E6] text-[#E8B65B] rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-[#2B2B2B] mb-3">Unlock Tiers</h3>
              <p className="text-[#7B7468]">Unlock Silver, Gold, and Platinum status for luxurious perks and higher earning rates.</p>
            </div>
          </div>
        </div>

        {/* Membership Tiers */}
        <div className="py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">Elevate your status</h2>
            <p className="text-[#7B7468] text-lg">Four tiers of unparalleled luxury travel benefits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <div key={index} className={`border-2 rounded-2xl p-6 flex flex-col h-full ${tier.color}`}>
                <h3 className="text-2xl font-bold text-[#2B2B2B] mb-1">{tier.name}</h3>
                <p className="text-[#7B7468] font-medium text-sm mb-6 pb-6 border-b border-black/10">{tier.spend}</p>
                
                <ul className="flex flex-col gap-4 flex-grow">
                  {tier.perks.map((perk, pIndex) => (
                    <li key={pIndex} className="flex items-start gap-3">
                      <div className="mt-1 shrink-0 bg-[#2B2B2B] text-white rounded-full p-[2px]">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-[#2B2B2B] text-[15px] leading-tight">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="py-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#2B2B2B] mb-8 text-center">Frequently asked questions</h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-[#EFE7D8] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#2B2B2B] mb-3">{faq.q}</h3>
                <p className="text-[#7B7468]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </Container>

      <JoinRewardsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJoin={() => {
          setHasJoined(true);
          setShowSuccessPopup(true);
          setIsModalOpen(false);
          // Auto-hide the popup after 5 seconds
          setTimeout(() => setShowSuccessPopup(false), 5000);
        }}
      />

      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#2B2B2B] text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md w-full border border-white/10"
          >
            <div className="bg-[#E8B65B] text-[#2B2B2B] p-2 rounded-full shrink-0">
              <Check size={20} strokeWidth={3} />
            </div>
            <div>
              <p className="font-bold mb-1">Welcome to Stayr Rewards!</p>
              <p className="text-sm text-[#FFF6E6]/80 leading-snug">
                Earn StayrCash on every booking and unlock exclusive perks across our premium properties.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
