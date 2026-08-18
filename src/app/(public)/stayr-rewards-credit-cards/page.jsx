import Navbar from "@/components/navbar/Navbar";
import FooterPageHero from "@/components/footer-pages/FooterPageHero";
import Container from "@/components/common/Container";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/footer-pages/AnimatedSection";
import FooterPageCard from "@/components/footer-pages/FooterPageCard";
import { CreditCard, Gift, Plane, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Stayr Rewards Credit Cards | Stayr",
  description: "Elevate your travel experience and earn free nights faster with a Stayr Rewards Credit Card.",
};

export default function CreditCardsPage() {
  const cardBenefits = [
    { title: "Earn Free Nights", description: "Earn up to 10X points on Stayr bookings and 3X points on dining and travel.", icon: Star },
    { title: "No Foreign Transaction Fees", description: "Travel the world without paying extra fees on international purchases.", icon: Plane },
    { title: "Elite Status", description: "Automatic Platinum status unlocks early check-in, late check-out, and room upgrades.", icon: Gift },
    { title: "Annual Travel Credit", description: "Receive a $200 Stayr statement credit every anniversary year.", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar forceCompact={true} />
      
      <main className="flex-1">
        <FooterPageHero 
          variant="split"
          title="Turn every purchase into your next getaway."
          description="Elevate your travel experience and earn free nights faster with the new Stayr Rewards Visa Infinite® Card."
          imageSrc="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200"
          subtitle="Stayr Rewards Cards"
        />
        
        <section className="py-24 bg-white">
          <Container>
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-foreground)] mb-6">Premium benefits, every day</h2>
                <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">Designed exclusively for the luxury traveler who demands the best from their journey.</p>
              </div>
            </AnimatedSection>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cardBenefits.map((benefit, idx) => (
                <StaggerItem key={idx}>
                  <FooterPageCard {...benefit} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>

        <section className="relative py-24 bg-[var(--color-foreground)] text-white overflow-hidden">
          <Container>
            <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
              <AnimatedSection className="w-full lg:w-1/2">
                <span className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-sm mb-4 block">Limited Time Offer</span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Earn 100,000 Bonus Points</h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  After you spend $4,000 on purchases in the first 3 months from account opening. That's enough for a free weekend stay at most premium Stayr properties.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="#" className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-[var(--color-primary-hover)] transition-colors">
                    Apply Now
                  </Link>
                  <Link href="/stayr-rewards-terms" className="bg-transparent border border-gray-500 text-gray-300 px-8 py-4 rounded-xl font-bold text-center hover:bg-gray-800 transition-colors">
                    View Rates & Terms
                  </Link>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2} className="w-full lg:w-1/2 relative h-[300px] md:h-[400px]">
                {/* Abstract Card Representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[80%] h-[240px] bg-gradient-to-tr from-gray-900 to-gray-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-600 flex flex-col justify-between p-8 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-white tracking-widest">STAYR</span>
                      <CreditCard className="text-gray-400" size={32} />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-5 bg-gray-400/30 rounded"></div>
                        <span className="text-gray-300 font-mono tracking-widest text-sm">•••• 4242</span>
                      </div>
                      <span className="text-white font-bold italic">Infinite</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </Container>
          
          {/* Background decor */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-primary)]/10 blur-[100px] pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </section>
      </main>
    </div>
  );
}
