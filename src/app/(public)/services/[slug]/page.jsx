"use client";

import { use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Star, Heart, Clock, ShieldCheck, MapPin, BadgeCheck, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import { SERVICES } from "@/data/services";
import { HOSTS } from "@/data/hosts";

export default function ServiceDetail({ params }) {
  const resolvedParams = use(params);

  useEffect(() => {
    // Next.js sometimes preserves scroll on dynamic routes or due to layout shifts
    // A small timeout ensures the page has rendered before we force it to the top
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 10);
    return () => clearTimeout(timer);
  }, []);
  
  const service = SERVICES.find(s => s.slug === resolvedParams.slug);

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Service not found</h1>
          <Link href="/services" className="text-primary hover:underline">
            Return to Services
          </Link>
        </div>
      </div>
    );
  }

  const provider = HOSTS.find(h => h.id === service.provider) || HOSTS[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar flat />
      
      <main className="pt-24 pb-32">
        <Container>
          {/* Breadcrumb / Back */}
          <div className="mb-6 flex justify-between items-center">
            <Link href="/services" className="flex items-center gap-2 text-muted hover:text-foreground transition">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">All services</span>
            </Link>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-foreground font-medium hover:bg-secondary px-4 py-2 rounded-full transition">
                <Heart className="w-5 h-5" />
                Save
              </button>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            {service.title}
          </h1>

          {/* Image Banner */}
          <div className="relative h-[300px] md:h-[450px] w-full rounded-3xl overflow-hidden mb-12">
            <Image 
              src={service.images?.[0] || service.image} 
              alt={service.title} 
              fill 
              className="object-cover" 
            />
          </div>

          {/* Main Content & Sidebar */}
          <div className="grid lg:grid-cols-[2fr_1fr] gap-12 relative">
            
            {/* Left Content */}
            <div className="flex flex-col gap-10">
              
              {/* Overview */}
              <div className="flex justify-between items-start border-b border-border pb-10">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Service provided by {provider.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
                    <div className="flex items-center gap-1">
                      <BadgeCheck className="w-4 h-4 text-primary" />
                      <span>{service.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{service.location}</span>
                    </div>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0">
                  <Image src={provider.image} alt={provider.name} fill className="object-cover" />
                </div>
              </div>

              {/* Description */}
              <div className="border-b border-border pb-10">
                <h3 className="text-xl font-bold text-foreground mb-4">About this service</h3>
                <p className="text-muted leading-relaxed whitespace-pre-line text-lg">
                  {service.description}
                </p>
              </div>

              {/* What to expect */}
              <div className="border-b border-border pb-10">
                <h3 className="text-xl font-bold text-foreground mb-6">What to expect</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="font-bold text-foreground">Professional Equipment</div>
                      <div className="text-sm text-muted">All necessary tools are provided.</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="font-bold text-foreground">Flexible Setup</div>
                      <div className="text-sm text-muted">Adapted to your space.</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="font-bold text-foreground">Clean up included</div>
                      <div className="text-sm text-muted">The space is left exactly as found.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Provider Profile */}
              <div className="border-b border-border pb-10">
                <h3 className="text-xl font-bold text-foreground mb-6">About the provider</h3>
                <div className="bg-secondary/50 rounded-3xl p-8">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden relative shrink-0">
                      <Image src={provider.image} alt={provider.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{provider.name}</div>
                      <div className="text-muted">{provider.profession}</div>
                      <div className="flex items-center gap-2 mt-2 text-sm font-medium text-foreground">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Identity verified
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed italic mb-6">
                    &quot;{provider.story}&quot;
                  </p>
                  <button className="border border-foreground text-foreground px-6 py-2 rounded-full font-semibold hover:bg-foreground hover:text-white transition">
                    Message Provider
                  </button>
                </div>
              </div>

            </div>

            {/* Right Sidebar (Sticky Booking Card) */}
            <div className="hidden lg:block relative">
              <div className="sticky top-32 bg-white border border-border shadow-2xl rounded-3xl p-8 flex flex-col gap-6">
                
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold text-foreground">
                    From ₹{service.price.toLocaleString("en-IN")}
                  </div>
                  {service.rating && (
                    <div className="flex items-center gap-1 font-semibold text-sm">
                      <Star className="w-4 h-4 fill-foreground" />
                      <span>{service.rating} · <span className="text-muted underline">{service.reviewCount} reviews</span></span>
                    </div>
                  )}
                </div>

                <div className="border border-border rounded-2xl overflow-hidden">
                  <div className="flex border-b border-border">
                    <div className="w-1/2 p-4 border-r border-border hover:bg-secondary/50 cursor-pointer transition">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-foreground">Date</div>
                      <div className="text-sm font-medium">Select date</div>
                    </div>
                    <div className="w-1/2 p-4 hover:bg-secondary/50 cursor-pointer transition">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-foreground">Time</div>
                      <div className="text-sm font-medium">Select time</div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-secondary/50 cursor-pointer transition flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-foreground">Location</div>
                      <div className="text-sm font-medium">Your Stayr home</div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-primary hover:bg-primary-hover text-foreground font-bold py-4 rounded-xl transition shadow-lg shadow-primary/20">
                  Book Service
                </button>
                <div className="text-center text-sm text-muted">
                  You won&apos;t be charged yet
                </div>
              </div>
            </div>

          </div>
        </Container>

        {/* Mobile Sticky Booking Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 px-6 flex justify-between items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <div>
            <div className="text-lg font-bold text-foreground">
              From ₹{service.price.toLocaleString("en-IN")}
            </div>
            <div className="text-sm font-medium text-primary underline">Select dates</div>
          </div>
          <button className="bg-primary hover:bg-primary-hover text-foreground font-bold px-8 py-3 rounded-xl transition">
            Book
          </button>
        </div>
      </main>
    </div>
  );
}
