"use client";

import { Home, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../common/Container";

export default function TrustBanner() {
  const features = [
    {
      icon: <Home className="w-5 h-5 text-foreground group-hover:text-white transition-colors duration-300 relative z-10" strokeWidth={1.5} />,
      title: "We know just the place",
      description: "Near the beach. By the slopes. Find stays for every occasion." },
    {
      icon: <ShieldCheck className="w-5 h-5 text-foreground group-hover:text-white transition-colors duration-300 relative z-10" strokeWidth={1.5} />,
      title: "Our StayrCare guarantee",
      description: "If your stay goes sideways, we'll step in—we'll always aim to make it right." },
    {
      icon: <HeartHandshake className="w-5 h-5 text-foreground group-hover:text-white transition-colors duration-300 relative z-10" strokeWidth={1.5} />,
      title: "On call day or night",
      description: "Real people. Real support. 24/7—before, during, or after your stay." },
  ];

  return (
    <section className="w-full py-4 md:py-6">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-secondary rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start justify-between gap-6 md:gap-10 border border-border w-full"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex flex-row items-start gap-4 flex-1 group cursor-pointer p-3 rounded-2xl transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div 
                className="flex items-center justify-center min-w-[40px] h-10 bg-accent group-hover:bg-primary rounded-full shrink-0 relative overflow-hidden transition-colors duration-300 shadow-sm group-hover:shadow-[0_8px_30px_rgba(232,182,91,0.3)] mt-0.5"
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: index * 0.2 }}
              >
                {/* Subtle shine effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full z-0 pointer-events-none"
                  whileHover={{ translateX: ["-100%", "200%"] }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <motion.div className="group-hover:scale-110 transition-transform duration-300 z-10 flex items-center justify-center">
                  {feature.icon}
                </motion.div>
              </motion.div>
              <div className="flex flex-col">
                <h3 className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-0.5 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-[13px] text-muted leading-snug">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
