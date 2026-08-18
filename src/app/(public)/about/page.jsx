import Navbar from "@/components/navbar/Navbar";
import FooterPageHero from "@/components/footer-pages/FooterPageHero";
import Container from "@/components/common/Container";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/footer-pages/AnimatedSection";
import Image from "next/image";
import { Globe, Heart, Shield, Sparkles } from "lucide-react";

export const metadata = {
  title: "About Stayr | A Stay That Stays With You",
  description: "More than a stay. A place to belong. Discover the story, mission, and values behind Stayr.",
};

export default function AboutPage() {
  const values = [
    { title: "Uncompromising Quality", description: "Every property on Stayr is meticulously vetted to ensure it meets our exacting standards for luxury, comfort, and design.", icon: Sparkles },
    { title: "Radical Hospitality", description: "We believe in going above and beyond to make every guest feel not just welcomed, but truly cared for.", icon: Heart },
    { title: "Trust & Transparency", description: "We operate with absolute integrity, ensuring safe, secure, and clear transactions for both guests and hosts.", icon: Shield },
    { title: "Global Community", description: "We are building a borderless world where premium travel connects people across cultures and continents.", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar forceCompact={true} />
      
      <main className="flex-1">
        <FooterPageHero 
          variant="centered"
          title="More than a stay. A place to belong."
          description="We are on a mission to redefine luxury travel by curating the world's most exceptional spaces and connecting them with discerning travelers."
          subtitle="About Stayr"
        />
        
        <section className="py-24 bg-white border-y border-[var(--color-border)]">
          <Container>
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <AnimatedSection className="w-full lg:w-1/2">
                <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-foreground)] mb-6 leading-tight">Born from a simple idea: Travel should feel effortless.</h2>
                <p className="text-lg text-[var(--color-muted)] mb-6 leading-relaxed">
                  Founded in 2024, Stayr was created to bridge the gap between sterile hotel rooms and unpredictable vacation rentals. We wanted the consistency and service of a 5-star hotel, combined with the character, space, and privacy of a luxury home.
                </p>
                <p className="text-lg text-[var(--color-muted)] leading-relaxed">
                  Today, we've grown into a global community of passionate hosts and travelers who share a common appreciation for beautiful design, exceptional service, and authentic experiences.
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={0.2} className="w-full lg:w-1/2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1542314831-c53cd4b85ca4?auto=format&fit=crop&q=80&w=1200"
                  alt="Stayr Story"
                  fill
                  className="object-cover"
                />
              </AnimatedSection>
            </div>
          </Container>
        </section>

        <section className="py-24 bg-[var(--color-background)]">
          <Container>
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-6">Our Core Values</h2>
                <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">These principles guide everything we do, from the properties we select to the way we support our community.</p>
              </div>
            </AnimatedSection>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, idx) => (
                <StaggerItem key={idx} className="bg-[var(--color-foreground)] p-10 rounded-3xl border border-[var(--color-border)] shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-gray-800 text-[var(--color-primary)] flex items-center justify-center mb-6">
                    <value.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">{value.title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{value.description}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      </main>
    </div>
  );
}
