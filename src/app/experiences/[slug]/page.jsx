"use client";

import { use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Star, Heart, MapPin, Clock, Users, ShieldCheck } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import { EXPERIENCES, STAYR_ORIGINALS } from "@/data/experiences";
import { HOSTS } from "@/data/hosts";
import ExperienceReservationWidget from "@/components/experiences/ExperienceReservationWidget";

export default function ExperienceDetail({ params }) {
  const resolvedParams = use(params);

  useEffect(() => {
    // Next.js sometimes preserves scroll on dynamic routes or due to layout shifts
    // A small timeout ensures the page has rendered before we force it to the top
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 10);
    return () => clearTimeout(timer);
  }, []);
  
  // Find experience in both arrays
  const experience = 
    EXPERIENCES.find(e => e.slug === resolvedParams.slug) || 
    STAYR_ORIGINALS.find(e => e.slug === resolvedParams.slug);

  if (!experience) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Experience not found</h1>
          <Link href="/experiences" className="text-primary hover:underline">
            Return to Experiences
          </Link>
        </div>
      </div>
    );
  }

  const host = HOSTS.find(h => h.id === experience.host) || HOSTS[0]; // fallback to first host if not found (e.g. for Originals)

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <Navbar flat />
      
      <main className="pt-24 pb-32">
        <Container>
          {/* Breadcrumb / Back */}
          <div className="mb-6 flex justify-between items-center">
            <Link href="/experiences" className="flex items-center gap-2 text-muted hover:text-foreground transition">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">All experiences</span>
            </Link>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-foreground font-medium hover:bg-secondary px-4 py-2 rounded-full transition">
                <Heart className="w-5 h-5" />
                Save
              </button>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            {experience.title}
          </h1>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
            <div className="relative h-full w-full group cursor-pointer">
              <Image 
                src={experience.images?.[0] || experience.image} 
                alt={experience.title} 
                fill 
                className="object-cover group-hover:scale-105 transition duration-500" 
              />
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4 h-full">
              <div className="relative h-full group cursor-pointer">
                <Image 
                  src={experience.images?.[1] || experience.image} 
                  alt="Gallery image 2" 
                  fill 
                  className="object-cover group-hover:scale-105 transition duration-500" 
                />
              </div>
              <div className="relative h-full group cursor-pointer">
                <Image 
                  src={experience.images?.[2] || experience.image} 
                  alt="Gallery image 3" 
                  fill 
                  className="object-cover group-hover:scale-105 transition duration-500" 
                />
              </div>
            </div>
          </div>

          {/* Main Content & Sidebar */}
          <div className="grid lg:grid-cols-[2fr_1fr] gap-12 relative">
            
            {/* Left Content */}
            <div className="flex flex-col gap-10">
              
              {/* Overview */}
              <div className="flex justify-between items-start border-b border-border pb-10">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Experience hosted by {host.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{experience.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{experience.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Up to 10 guests</span>
                    </div>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0">
                  <Image src={host.image} alt={host.name} fill className="object-cover" />
                </div>
              </div>

              {/* Description */}
              <div className="border-b border-border pb-10">
                <h3 className="text-xl font-bold text-foreground mb-4">What you&apos;ll do</h3>
                <p className="text-muted leading-relaxed whitespace-pre-line text-lg">
                  {experience.description || "Join us for an unforgettable experience exploring the best this destination has to offer. We&apos;ll start by meeting at a central location and proceed to uncover hidden gems."}
                </p>
              </div>

              {/* Host Profile */}
              <div className="border-b border-border pb-10">
                <h3 className="text-xl font-bold text-foreground mb-6">Meet your host</h3>
                <div className="bg-secondary/50 rounded-3xl p-8">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden relative shrink-0">
                      <Image src={host.image} alt={host.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{host.name}</div>
                      <div className="text-muted">{host.profession}</div>
                      <div className="flex items-center gap-2 mt-2 text-sm font-medium text-foreground">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Identity verified
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed italic mb-6">
                    &quot;{host.story}&quot;
                  </p>
                  <button className="border border-foreground text-foreground px-6 py-2 rounded-full font-semibold hover:bg-foreground hover:text-white transition">
                    Message Host
                  </button>
                </div>
              </div>

            </div>

            <ExperienceReservationWidget experience={experience} />
          </div>
        </Container>
      </main>
    </div>
  );
}
