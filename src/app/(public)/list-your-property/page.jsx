import Navbar from "@/components/navbar/Navbar";
import FooterPageHero from "@/components/footer-pages/FooterPageHero";
import Container from "@/components/common/Container";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/footer-pages/AnimatedSection";
import FooterPageCard from "@/components/footer-pages/FooterPageCard";
import { Home, DollarSign, ShieldCheck, Key } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "List Your Property | Stayr",
  description: "Turn your space into someone's next unforgettable stay. Become a Stayr host today and start earning.",
};

export default function ListYourPropertyPage() {
  const benefits = [
    { title: "Earn extra income", description: "Turn your unused space into a consistent revenue stream with competitive payouts.", icon: DollarSign },
    { title: "Complete control", description: "You decide when you host, your pricing, and your house rules.", icon: Key },
    { title: "Comprehensive protection", description: "Every booking includes our industry-leading Host Guarantee for peace of mind.", icon: ShieldCheck },
    { title: "Global reach", description: "Get your property in front of millions of luxury travelers worldwide.", icon: Home },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar forceCompact={true} />
      
      <main className="flex-1">
        <FooterPageHero 
          variant="split"
          title="Turn your space into someone's next unforgettable stay."
          description="Join millions of hosts who are earning extra income while helping travelers experience the world."
          imageSrc="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200"
          subtitle="Hosting on Stayr"
        />
        
        <section className="py-24 bg-white">
          <Container>
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-foreground)] mb-6">Why host with Stayr?</h2>
                <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">We provide the tools, support, and audience you need to succeed as a host.</p>
              </div>
            </AnimatedSection>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => (
                <StaggerItem key={idx}>
                  <FooterPageCard {...benefit} />
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            <AnimatedSection delay={0.4} className="mt-20 text-center">
              <Link href="/become-a-host" className="inline-block bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[var(--color-primary-hover)] transition-colors shadow-md hover:shadow-xl">
                Get started today
              </Link>
            </AnimatedSection>
          </Container>
        </section>
      </main>
    </div>
  );
}
