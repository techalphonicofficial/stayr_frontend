"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../common/Container";
import AuthModal from "../modals/AuthModal";

export default function MemberBanner() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <section className="w-full">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-foreground rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(232,182,91,0.2)] transition-shadow duration-500"
          whileHover={{ scale: 1.01 }}
        >
          {/* Sweeping shine effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full z-0 pointer-events-none"
            animate={{ translateX: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", repeatDelay: 2 }}
          />

          {/* Left Side: Icon and Text */}
          <div className="flex items-center gap-4 text-white relative z-10">
            <motion.div 
              className="flex items-center justify-center relative"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-primary blur-md opacity-30 rounded-full animate-pulse"></div>
              <Sparkles className="w-8 h-5 text-primary relative z-10" />
            </motion.div>
            <span className="text-[15px] md:text-[16px] font-medium group-hover:text-primary transition-colors duration-300">
              Members always get our best prices when signed in
            </span>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-6 relative z-10">
            <motion.button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-primary text-foreground font-bold py-2 px-6 rounded-full shadow-[0_0_15px_rgba(232,182,91,0.4)] hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign in
            </motion.button>
            <Link href="/learn-more" className="text-white font-medium hover:text-primary transition-colors duration-300 hover:underline">
              Learn more
            </Link>
          </div>

        </motion.div>
      </Container>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </section>
  );
}
