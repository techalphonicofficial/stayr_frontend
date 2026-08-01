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
          className="bg-[#2B2B2B] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          
          {/* Left Side: Icon and Text */}
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center justify-center">
              <Sparkles className="w-8 h-5 text-[#E8B65B]" />
            </div>
            <span className="text-[15px] md:text-[16px] font-medium">
              Members always get our best prices when signed in
            </span>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-[#E8B65B] hover:bg-[#D89C2B] text-[#2B2B2B] font-semibold py-2 px-6 rounded-full transition-colors duration-200"
            >
              Sign in
            </button>
            <Link href="/learn-more" className="text-white font-medium hover:underline">
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
