"use client";

import { motion } from "framer-motion";
import { Home, Tag, Clock, ShieldCheck } from "lucide-react";
import Container from "../common/Container";

const BENEFITS = [
  {
    icon: <Home size={22} className="text-[#2B2B2B] group-hover:text-white transition-colors duration-300 relative z-10" />,
    title: "Diverse Collection",
    description: "Villas, apartments, resorts and more"
  },
  {
    icon: <Tag size={22} className="text-[#2B2B2B] group-hover:text-white transition-colors duration-300 relative z-10" />,
    title: "Best Price Guarantee",
    description: "Quality stays at the best prices"
  },
  {
    icon: <Clock size={22} className="text-[#2B2B2B] group-hover:text-white transition-colors duration-300 relative z-10" />,
    title: "24/7 Support",
    description: "We're here for you anytime"
  },
  {
    icon: <ShieldCheck size={22} className="text-[#2B2B2B] group-hover:text-white transition-colors duration-300 relative z-10" />,
    title: "Safe & Secure",
    description: "Your security and privacy is our priority"
  }
];

export default function WhyStayrSection() {
  return (
    <div className="w-full bg-[#FFFDF8] py-8 relative z-20">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-sm border border-[#EFE7D8] p-4 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {BENEFITS.map((item, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center text-center gap-2 group cursor-pointer p-3 rounded-2xl transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-full bg-[#FFFDF8] border border-[#EFE7D8] flex items-center justify-center group-hover:bg-[#E8B65B] group-hover:border-[#E8B65B] transition-colors duration-300 shadow-sm group-hover:shadow-[0_8px_30px_rgba(232,182,91,0.3)] relative overflow-hidden"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: index * 0.2 }}
                >
                  {/* Subtle shine effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full z-0"
                    whileHover={{ translateX: ["-100%", "200%"] }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  <motion.div className="group-hover:scale-110 transition-transform duration-300 z-10">
                    {item.icon}
                  </motion.div>
                </motion.div>
                <div>
                  <h3 className="font-bold text-[#2B2B2B] text-[14px] mb-0.5 group-hover:text-[#E8B65B] transition-colors duration-300">{item.title}</h3>
                  <p className="text-[12px] text-[#7B7468] max-w-[180px] mx-auto leading-snug">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
