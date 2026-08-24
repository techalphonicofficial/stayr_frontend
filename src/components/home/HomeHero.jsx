"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const TYPING_PHRASES = [
  "Endless Memories.",
  "Memories That Stay.",
  "Where Memories Begin.",
  "Journeys to Remember.",
  "Moments Beyond Time.",
  "Moments Beyond Miles."
];

function TypewriterText({ phrases }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // Cursor blink
  useEffect(() => {
    const blinkInterval = setInterval(() => setBlink(prev => !prev), 500);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    
    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at the end of the word
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      // Move to next word when fully deleted
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    // Typing and deleting speeds
    const timeout = setTimeout(() => {
      setCharIndex(prev => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, phrases]);

  return (
    <span className="inline-block text-primary text-xl md:text-3xl lg:text-5xl mt-2 md:mt-4">
      {phrases[phraseIndex].substring(0, charIndex)}
      <span className={`inline-block ${blink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>|</span>
    </span>
  );
}

const BENEFITS = [
  {
    icon: "🏡",
    title: "Curated Properties",
    description: "Handpicked with quality"
  },
  {
    icon: "💰",
    title: "Best Price Guarantee",
    description: "Get the best value"
  },
  {
    icon: "✨",
    title: "Seamless Experience",
    description: "Easy booking & support"
  },
  {
    icon: "🛡️",
    title: "Trusted by Thousands",
    description: "Happy travelers worldwide"
  }
];

export default function HomeHero() {
  return (
    <div className="relative w-full h-[85vh] min-h-[600px] max-h-[800px] flex flex-col justify-between overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920"
          alt="Luxury Villa"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
      </div>

      {/* Center Text Area */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 mb-auto mt-16 md:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-4 py-1 mb-6 text-sm font-semibold flex items-center gap-2"
        >
          <span className="text-primary">★</span> Handpicked stays
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-2xl md:text-4xl lg:text-6xl font-bold text-white max-w-4xl tracking-tight leading-tight mb-6 min-h-[100px] md:min-h-[160px]"
        >
          Extraordinary stays,<br />
          <TypewriterText phrases={TYPING_PHRASES} />
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/90 max-w-2xl font-light"
        >
          Discover handpicked stays in the world's most beautiful destinations.
        </motion.p>
      </div>

      {/* Bottom Compact Benefits Bar */}
      <div className="relative z-10 w-full px-4 pb-8 md:pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="max-w-6xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 divide-x-0 md:divide-x divide-white/20">
            {BENEFITS.map((item, index) => (
              <motion.div 
                key={index} 
                className="flex flex-row items-center gap-4 px-2 md:px-6 cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div 
                  className="text-3xl bg-white/10 rounded-full w-12 h-12 flex items-center justify-center border border-white/20 flex-shrink-0 relative overflow-hidden group-hover:bg-primary/30 group-hover:border-primary transition-colors duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_20px_rgba(232,182,91,0.4)]"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: index * 0.2 }}
                >
                  {/* Subtle shine effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full"
                    whileHover={{ translateX: ["-100%", "200%"] }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm group-hover:text-primary transition-colors duration-300">{item.title}</span>
                  <span className="text-white/70 text-xs">{item.description}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
