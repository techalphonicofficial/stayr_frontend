"use client";

import { useState } from "react";
import { Search, Home, Users, Calendar, Shield, CreditCard, HelpCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/common/Container";

const TABS = [
  { id: "guest", label: "Guest" },
  { id: "host", label: "Host" },
  { id: "experience", label: "Experience Host" },
  { id: "travel", label: "Travel admin" },
];

const TOPICS = {
  guest: [
    { icon: <Home size={24} />, title: "Getting started", desc: "Creating an account and basics." },
    { icon: <Shield size={24} />, title: "Access and smart devices", desc: "Checking in and smart locks." },
    { icon: <Calendar size={24} />, title: "Your reservations", desc: "Managing your upcoming trips." },
    { icon: <HelpCircle size={24} />, title: "Help with a trip", desc: "Contacting hosts and support." },
    { icon: <CreditCard size={24} />, title: "Payment and refunds", desc: "Managing payment methods." },
    { icon: <Users size={24} />, title: "Safety and accessibility", desc: "Guidelines and resources." },
  ],
  host: [
    { icon: <Home size={24} />, title: "Hosting basics", desc: "Getting your space ready." },
    { icon: <Calendar size={24} />, title: "Calendar and bookings", desc: "Managing availability." },
    { icon: <CreditCard size={24} />, title: "Payouts and taxes", desc: "Getting paid and tax info." },
  ],
  experience: [
    { icon: <Users size={24} />, title: "Experience basics", desc: "Creating a great experience." },
    { icon: <Calendar size={24} />, title: "Managing guests", desc: "Communicating and preparing." },
  ],
  travel: [
    { icon: <CreditCard size={24} />, title: "Billing and expenses", desc: "Managing company travel." },
    { icon: <Shield size={24} />, title: "Duty of care", desc: "Safety for your employees." },
  ]
};

const TOP_ARTICLES = [
  "Canceling your reservation for a stay",
  "Change the date or time of your Experience reservation",
  "If your Host cancels your reservation",
  "Payment methods accepted",
  "When you'll pay for your reservation",
  "How refunds work"
];

import Navbar from "@/components/navbar/Navbar";

export default function HelpCenterPage() {
  const [activeTab, setActiveTab] = useState("guest");

  return (
    <div className="pt-[240px] pb-24 min-h-screen bg-[#FFFDF8]">
      <Navbar />
      <Container>
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center mt-8 mb-16">
          <h1 className="text-4xl md:text-[42px] font-bold text-[#2B2B2B] mb-10">
            Hi, how can we help?
          </h1>
          
          <div className="w-full max-w-2xl relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="text-[#E8B65B]" size={22} strokeWidth={3} />
            </div>
            <input 
              type="text" 
              placeholder="Search how-tos and more" 
              className="w-full pl-16 pr-6 py-5 rounded-full border border-[#EFE7D8] shadow-sm hover:shadow-md focus:shadow-lg focus:outline-none transition text-lg text-[#2B2B2B] placeholder:text-[#7B7468]"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-row overflow-x-auto gap-8 border-b border-[#EFE7D8] mb-12 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-4 text-lg transition whitespace-nowrap ${
                activeTab === tab.id ? 'text-[#2B2B2B] font-bold' : 'text-[#7B7468] hover:text-[#2B2B2B]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="help-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E8B65B] rounded-t-full"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content (Guides Grid) */}
          <div className="flex-[2]">
            <h2 className="text-2xl font-bold text-[#2B2B2B] mb-6">
              Guides for {TABS.find(t => t.id === activeTab)?.label.toLowerCase()}s
            </h2>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {TOPICS[activeTab].map((topic, i) => (
                  <div 
                    key={i} 
                    className="p-6 border border-[#EFE7D8] rounded-2xl hover:shadow-md transition cursor-pointer bg-white"
                  >
                    <div className="text-[#E8B65B] mb-4">
                      {topic.icon}
                    </div>
                    <h3 className="text-lg font-bold text-[#2B2B2B] mb-2">
                      {topic.title}
                    </h3>
                    <p className="text-[#7B7468]">
                      {topic.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar (Top Articles) */}
          <div className="flex-[1]">
            <h2 className="text-2xl font-bold text-[#2B2B2B] mb-6">
              Top articles
            </h2>
            <div className="flex flex-col">
              {TOP_ARTICLES.map((article, i) => (
                <div 
                  key={i}
                  className="group flex flex-row items-center justify-between py-5 border-b border-[#EFE7D8] cursor-pointer"
                >
                  <span className="text-[#2B2B2B] text-lg pr-4 group-hover:underline">
                    {article}
                  </span>
                  <ChevronRight size={20} className="text-[#7B7468]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
