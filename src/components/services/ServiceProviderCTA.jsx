"use client";

import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import Container from "../common/Container";

export default function ServiceProviderCTA() {
  return (
    <div className="py-24">
      <Container>
        <div className="bg-foreground rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row items-center">

          {/* Image */}
          <div className="w-full md:w-1/2 h-[400px] md:h-[500px] relative order-2 md:order-1">
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200"
              alt="Service Provider"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-foreground via-foreground/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 p-12 md:p-20 order-1 md:order-2 flex flex-col items-start z-10 text-white">
            <div className="bg-primary/20 text-primary font-bold px-4 py-2 rounded-full flex items-center gap-2 mb-6 border border-primary/30">
              <Star className="w-4 h-4 fill-primary" />
              Partner with Stayr
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
              Grow your business with Stayr
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-md">
              Are you a premium service provider? Connect with our luxury clientele and offer your services directly to their door.
            </p>
            <button className="bg-primary hover:bg-primary-hover text-foreground px-8 py-4 rounded-full font-bold transition flex items-center gap-2 text-lg group">
              Apply to become a Partner
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </Container>
    </div>
  );
}
