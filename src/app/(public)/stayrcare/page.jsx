import Navbar from "@/components/navbar/Navbar";
import FooterPageHero from "@/components/footer-pages/FooterPageHero";
import Container from "@/components/common/Container";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/footer-pages/AnimatedSection";
import FooterPageCard from "@/components/footer-pages/FooterPageCard";
import { HeartHandshake, PhoneCall, ShieldAlert, BadgeCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "StayrCare | Support That Stays With You",
  description: "StayrCare is our commitment to providing 24/7 global support, premium service, and comprehensive protection for your stay.",
};

export default function StayrCarePage() {
  const features = [
    { title: "24/7 Global Support", description: "Our dedicated team is available around the clock, anywhere in the world.", icon: PhoneCall },
    { title: "Booking Protection", description: "If a host needs to cancel within 30 days of check-in, we'll find you a similar or better home.", icon: ShieldAlert },
    { title: "Check-in Guarantee", description: "If you can't check into your home and the host cannot resolve the issue, we'll step in.", icon: BadgeCheck },
    { title: "Get-What-You-Booked", description: "If at any time during your stay you find your listing isn't as advertised, we'll make it right.", icon: HeartHandshake },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar forceCompact={true} />
      
      <main className="flex-1">
        <FooterPageHero 
          variant="centered"
          title="Support that stays with you."
          description="StayrCare is our comprehensive protection program, included for free with every booking. It’s our commitment to making sure every stay is perfect."
          subtitle="Introducing StayrCare"
        />
        
        <section className="py-24 bg-white border-t border-gray-100">
          <Container>
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-6">What's included in StayrCare</h2>
                <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">Travel with confidence knowing we have your back at every step of your journey.</p>
              </div>
            </AnimatedSection>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, idx) => (
                <StaggerItem key={idx}>
                  <FooterPageCard {...feature} />
                </StaggerItem>
              ))}
            </StaggerContainer>

            <AnimatedSection delay={0.3} className="mt-20">
              <div className="bg-[var(--color-foreground)] p-8 md:p-12 rounded-3xl text-center border border-[var(--color-primary)]/20 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-100 mb-4">Need help right now?</h3>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto">Our specialized support team is ready to assist you with your current or upcoming reservations.</p>
                <Link href="/help" className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-primary-hover)] transition-colors">
                  Contact Support
                </Link>
              </div>
            </AnimatedSection>
          </Container>
        </section>
      </main>
    </div>
  );
}
