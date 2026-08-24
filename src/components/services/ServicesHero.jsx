"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Container from "../common/Container";
import { ShieldCheck, HeartHandshake } from "lucide-react";
import ServiceSearch from "./ServiceSearch";

export default function ServicesHero() {
  return (
    <div className="relative pt-[180px] md:pt-24 mb-16">
      <Container>
        <div className="relative w-full h-[600px] md:h-[700px] rounded-[3rem] overflow-hidden shadow-2xl">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000"
              alt="Luxury hospitality services"
              fill
              priority
              className="object-cover"
            />
            {/* Warm Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          <div className="relative h-full flex flex-col justify-end pb-24 md:pb-32 px-8 md:px-16 z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl text-white"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading leading-tight text-white">
                Everything your stay needs, <br />
                <span className="text-accent">delivered beautifully.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                Book trusted professionals for comfort, convenience and special moments right at your Stayr home.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 text-sm font-medium text-white/80">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  <span>Vetted Professionals</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <HeartHandshake className="w-5 h-5 text-accent" />
                  <span>Seamless Hospitality</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Positioned exactly overlapping the bottom edge of the hero on desktop, but detached on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="px-4 md:px-0 mt-16 md:-mt-10 relative z-30"
      >
        <ServiceSearch />
      </motion.div>
    </div>
  );
}
