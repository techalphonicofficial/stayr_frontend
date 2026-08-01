"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Container from "../common/Container";
import { Star, ShieldCheck } from "lucide-react";

export default function ExperiencesHero() {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] mt-24 mb-16 rounded-3xl overflow-hidden shadow-lg">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1533050487297-09b450131914?auto=format&fit=crop&q=80&w=2000"
          alt="Explore experiences"
          fill
          priority
          className="object-cover"
        />
        {/* Warm Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <Container>
        <div className="relative h-full flex flex-col justify-end pb-16 pt-32 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-heading leading-tight text-white">
              Don’t just visit. <br />
              <span className="text-accent">Live the story.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
              Discover unforgettable moments hosted by people who know the destination best.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button className="bg-primary hover:bg-primary-hover text-foreground font-semibold px-8 py-4 rounded-full transition-colors">
                Explore experiences
              </button>
              
              {/* Trust details */}
              <div className="flex items-center gap-4 text-sm font-medium text-white/80 mt-4 sm:mt-0">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span>4.9/5 average</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/50" />
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>Verified local hosts</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
