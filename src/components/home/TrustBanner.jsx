"use client";

import { Home, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../common/Container";

export default function TrustBanner() {
  const features = [
    {
      icon: <Home className="w-6 h-6 text-[#2B2B2B]" strokeWidth={1.5} />,
      title: "We know just the place",
      description: "Near the beach. By the slopes. Find stays for every occasion." },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#2B2B2B]" strokeWidth={1.5} />,
      title: "Our StayrCare guarantee",
      description: "If your stay goes sideways, we'll step in—we'll always aim to make it right." },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#2B2B2B]" strokeWidth={1.5} />,
      title: "On call day or night",
      description: "Real people. Real support. 24/7—before, during, or after your stay." },
  ];

  return (
    <section className="w-full py-8 mb-12">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#FFF6E6] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start justify-between gap-8 md:gap-12 border border-[#EFE7D8]"
        >
          {features.map((feature, index) => (
            <div key={index} className="flex flex-row items-start gap-4 flex-1">
              <div className="flex items-center justify-center min-w-[48px] h-12 bg-[#F4D28C] rounded-full shrink-0">
                {feature.icon}
              </div>
              <div className="flex flex-col pt-1">
                <h3 className="text-[17px] font-semibold text-[#2B2B2B] mb-1 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-[15px] text-[#7B7468] leading-snug">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
