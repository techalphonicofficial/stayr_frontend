import Navbar from "@/components/navbar/Navbar";
import FooterPageHero from "@/components/footer-pages/FooterPageHero";
import Container from "@/components/common/Container";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/footer-pages/AnimatedSection";
import FooterPageCard from "@/components/footer-pages/FooterPageCard";
import { Umbrella, PlaneTakeoff, HeartPulse, Luggage } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Stayr Travel Insurance | Stayr",
  description: "Protect your trip against the unexpected. Comprehensive travel insurance for Stayr guests.",
};

export default function TravelInsurancePage() {
  const coverage = [
    { title: "Trip Cancellation", description: "Get reimbursed for prepaid, non-refundable expenses if you have to cancel your trip due to a covered reason.", icon: PlaneTakeoff },
    { title: "Medical Emergencies", description: "Coverage for emergency medical and dental expenses during your trip, including evacuation if needed.", icon: HeartPulse },
    { title: "Baggage Delay", description: "Reimbursement for essential items if your baggage is delayed for more than 12 hours.", icon: Luggage },
    { title: "Weather Protection", description: "Protection against severe weather events that interrupt or cancel your travel plans.", icon: Umbrella },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar forceCompact={true} />
      
      <main className="flex-1">
        <FooterPageHero 
          variant="centered"
          title="Protect your trip against the unexpected."
          description="Add comprehensive travel insurance to your Stayr booking for complete peace of mind."
          subtitle="Stayr Travel Insurance"
        />
        
        <section className="py-24 bg-white">
          <Container>
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-foreground)] mb-6">What does it cover?</h2>
                <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">Our custom-built insurance policies are designed specifically for the modern luxury traveler.</p>
              </div>
            </AnimatedSection>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coverage.map((item, idx) => (
                <StaggerItem key={idx}>
                  <FooterPageCard {...item} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>

        <section className="py-24 bg-[var(--color-foreground)] border-y border-[var(--color-border)]">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedSection>
                <h2 className="text-3xl font-bold text-gray-100 mb-6">How to add protection</h2>
                <p className="text-lg text-gray-300 mb-8">
                  You can easily add Stayr Travel Insurance during checkout when booking any property. If you've already booked, you can still add protection from your Trips page up to 14 days before check-in.
                </p>
                <Link href="#" className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-hover)] transition-colors">
                  Go to Trips
                </Link>
              </AnimatedSection>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
