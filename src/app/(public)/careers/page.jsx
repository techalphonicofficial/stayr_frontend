import Navbar from "@/components/navbar/Navbar";
import FooterPageHero from "@/components/footer-pages/FooterPageHero";
import Container from "@/components/common/Container";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/footer-pages/AnimatedSection";
import FooterPageCard from "@/components/footer-pages/FooterPageCard";
import { Laptop, Plane, HeartPulse, Coffee, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Careers | Stayr",
  description: "Build the future of travel with Stayr. Explore open roles and join our global team.",
};

export default function CareersPage() {
  const benefits = [
    { title: "Work Anywhere", description: "We are a remote-first company. Work from wherever you feel most productive and inspired.", icon: Laptop },
    { title: "Travel Credits", description: "Receive generous annual Stayr credits to experience our properties firsthand.", icon: Plane },
    { title: "Comprehensive Health", description: "Premium medical, dental, and vision coverage for you and your dependents.", icon: HeartPulse },
    { title: "Wellness Stipend", description: "Monthly allowances for gym memberships, mental health apps, or your daily coffee.", icon: Coffee },
  ];

  const jobs = [
    { title: "Senior Frontend Engineer", team: "Engineering", location: "Remote (US/EU)" },
    { title: "Product Designer", team: "Design", location: "Remote (Global)" },
    { title: "Trust & Safety Specialist", team: "Operations", location: "London / Remote" },
    { title: "Regional Manager, APAC", team: "Business Development", location: "Singapore" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar forceCompact={true} />
      
      <main className="flex-1">
        <FooterPageHero 
          variant="split"
          title="Build the future of travel."
          description="Join a passionate team of innovators, designers, and travel enthusiasts dedicated to changing the way the world experiences hospitality."
          imageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
          subtitle="Careers at Stayr"
        />
        
        <section className="py-24 bg-white">
          <Container>
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-foreground)] mb-6">Why work at Stayr?</h2>
                <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">We invest in our people just as much as we invest in our product.</p>
              </div>
            </AnimatedSection>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => (
                <StaggerItem key={idx}>
                  <FooterPageCard {...benefit} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>

        <section className="py-24 bg-[var(--color-background)] border-t border-[var(--color-border)]">
          <Container>
            <AnimatedSection>
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-4">Open Roles</h2>
                  <p className="text-lg text-[var(--color-muted)]">Find your next opportunity.</p>
                </div>
                <button className="px-6 py-3 border border-[var(--color-border)] rounded-xl font-medium hover:border-[var(--color-primary)] transition-colors">
                  View all positions
                </button>
              </div>
            </AnimatedSection>

            <StaggerContainer className="flex flex-col gap-4">
              {jobs.map((job, idx) => (
                <StaggerItem key={idx}>
                  <Link href="#" className="flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 bg-white rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all group">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-2">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-[var(--color-muted)] font-medium">
                        <span>{job.team}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center text-[var(--color-primary)] font-bold group-hover:translate-x-2 transition-transform">
                      Apply <ArrowRight size={20} className="ml-2" />
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      </main>
    </div>
  );
}
