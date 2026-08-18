import Navbar from "@/components/navbar/Navbar";
import FooterPageHero from "@/components/footer-pages/FooterPageHero";
import Container from "@/components/common/Container";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/footer-pages/AnimatedSection";
import FooterPageCard from "@/components/footer-pages/FooterPageCard";
import { Shield, Lock, UserCheck, BellRing } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Trust & Safety | Stayr",
  description: "Your safety comes first. Learn about our verification processes, secure payments, and 24/7 emergency support.",
};

export default function TrustAndSafetyPage() {
  const safetyFeatures = [
    { title: "Verified Profiles", description: "Every user goes through a multi-step verification process before they can book or host on Stayr.", icon: UserCheck },
    { title: "Secure Payments", description: "Our payment system is built on bank-level security to ensure your money is always safe.", icon: Lock },
    { title: "Fraud Prevention", description: "Advanced machine learning models analyze every transaction to prevent fraud before it happens.", icon: Shield },
    { title: "Emergency Assistance", description: "Our dedicated safety team works with local authorities globally for emergency situations.", icon: BellRing },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar forceCompact={true} />
      
      <main className="flex-1">
        <FooterPageHero 
          variant="split"
          title="Your safety comes first."
          description="We are committed to building a trusted community where everyone can travel and host with confidence."
          imageSrc="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=1200"
          subtitle="Trust & Safety at Stayr"
        />
        
        <section className="py-24 bg-white">
          <Container>
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-foreground)] mb-6">How we protect our community</h2>
                <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">From secure payments to advanced background checks, we invest heavily in your security.</p>
              </div>
            </AnimatedSection>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {safetyFeatures.map((feature, idx) => (
                <StaggerItem key={idx}>
                  <FooterPageCard {...feature} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>

        <section className="py-24 bg-[var(--color-foreground)]">
          <Container>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <AnimatedSection className="w-full md:w-1/2">
                <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
                  <Image 
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200"
                    alt="Trust and Safety Team"
                    fill
                    className="object-cover"
                  />
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={0.2} className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-100 mb-6">A dedicated trust team</h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Our Trust & Safety team includes experts in risk management, cybersecurity, and community safety. They work relentlessly behind the scenes to monitor activity and enforce our community standards.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Whether it's verifying a new host or assisting a guest in an emergency, our team is always ready to step in.
                </p>
              </AnimatedSection>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
