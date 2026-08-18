import Navbar from "@/components/navbar/Navbar";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceCategories from "@/components/services/ServiceCategories";
import ArrivalServices from "@/components/services/ArrivalServices";
import ConciergeBuilder from "@/components/services/ConciergeBuilder";
import OccasionPackages from "@/components/services/OccasionPackages";
import TrustedProfessionals from "@/components/services/TrustedProfessionals";
import ServiceProviderCTA from "@/components/services/ServiceProviderCTA";
import ServiceCarousel from "@/components/services/ServiceCarousel";

import { SERVICES } from "@/data/services";

export default function ServicesPage() {
  const foodServices = SERVICES.filter(s => s.category === "Private Chefs");
  const mobilityServices = SERVICES.filter(s => s.category === "Local Drivers");

  // Fallback for visual display if lists are small
  const allServices = SERVICES;

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <Navbar />
      
      <main className="flex flex-col">
        {/* Hero & Search */}
        <ServicesHero />

        {/* Categories */}
        <ServiceCategories />

        {/* Arrival Checklist */}
        <ArrivalServices />

        {/* Dynamic Concierge */}
        <ConciergeBuilder />

        {/* Occasions */}
        <OccasionPackages />

        {/* Service Carousels */}
        <ServiceCarousel 
          title="Food made personal" 
          subtitle="From local delicacies to private dining."
          services={foodServices.length > 0 ? foodServices : allServices}
        />

        <ServiceCarousel 
          title="Local Mobility" 
          subtitle="Get around with trusted local drivers."
          services={mobilityServices.length > 0 ? mobilityServices : allServices}
        />

        {/* Trust */}
        <TrustedProfessionals />

        {/* CTA */}
        <ServiceProviderCTA />
      </main>
    </div>
  );
}
