"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import Container from "../common/Container";

export default function FeaturedExperience() {
  return (
    <div className="py-16 md:py-24">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div className="order-2 md:order-1 flex flex-col items-start">
            <div className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
              Featured Experience
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
              Delhi After Dark
            </h2>
            <p className="text-lg text-muted mb-8 max-w-md">
              Discover hidden food streets, rooftop cafés and untold stories with a local storyteller. Walk through the bustling streets as the city comes alive under the night sky.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8 w-full max-w-md">
              <div>
                <div className="text-sm text-muted">Location</div>
                <div className="font-semibold text-foreground">New Delhi</div>
              </div>
              <div>
                <div className="text-sm text-muted">Duration</div>
                <div className="font-semibold text-foreground">4 hours</div>
              </div>
              <div>
                <div className="text-sm text-muted">Host</div>
                <div className="font-semibold text-foreground">Rohan</div>
              </div>
              <div>
                <div className="text-sm text-muted">Rating</div>
                <div className="flex items-center gap-1 font-semibold text-foreground">
                  <Star className="w-4 h-4 fill-foreground" />
                  <span>4.9 (128 reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/experiences/delhi-after-dark">
                <button className="bg-foreground text-white hover:bg-foreground/90 px-8 py-4 rounded-full font-semibold transition-colors">
                  Reserve your place
                </button>
              </Link>
              <div className="font-semibold text-foreground text-lg">
                ₹2,500 <span className="text-muted text-sm font-normal">/ guest</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2 w-full h-[500px] md:h-[700px] relative rounded-[2rem] overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1200"
              alt="Delhi After Dark"
              fill
              className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </div>

        </div>
      </Container>
    </div>
  );
}
