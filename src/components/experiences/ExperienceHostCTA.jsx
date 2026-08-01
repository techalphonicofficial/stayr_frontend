"use client";

import Image from "next/image";
import Container from "../common/Container";
import { Sparkles, ArrowRight } from "lucide-react";

export default function ExperienceHostCTA() {
  return (
    <div className="py-24">
      <Container>
        <div className="relative rounded-[3rem] overflow-hidden bg-primary shadow-2xl flex flex-col md:flex-row items-center">

          {/* Content */}
          <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col items-start z-10">
            <div className="bg-white/20 backdrop-blur-sm text-foreground font-bold px-4 py-2 rounded-full flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4" />
              Join the community
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
              Have something unforgettable to share?
            </h2>
            <p className="text-foreground/80 text-lg md:text-xl mb-10 max-w-md">
              Turn your passion into profit. Host culinary experiences, hidden tours, art workshops and more with global travelers.
            </p>
            <button className="bg-foreground text-white hover:bg-foreground/90 px-8 py-4 rounded-full font-bold transition flex items-center gap-2 text-lg group">
              Become an Experience Host
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 h-[400px] md:h-[600px] relative">
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200"
              alt="Experience Host"
              fill
              className="object-cover"
            />
            {/* Soft gradient blend */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-primary via-primary/50 to-transparent" />
          </div>

        </div>
      </Container>
    </div>
  );
}
