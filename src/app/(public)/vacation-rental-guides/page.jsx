import Navbar from "@/components/navbar/Navbar";
import FooterPageHero from "@/components/footer-pages/FooterPageHero";
import Container from "@/components/common/Container";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/footer-pages/AnimatedSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles, BookOpen } from "lucide-react";

export const metadata = {
  title: "Vacation Rental Guides | Stayr",
  description: "Explore our comprehensive guides, travel tips, and destination inspiration for your next luxury getaway.",
};

export default function GuidesPage() {
  const guides = [
    { title: "The Ultimate Guide to Hosting", category: "For Hosts", image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=600" },
    { title: "Hidden Gems of the Mediterranean", category: "Destinations", image: "https://images.unsplash.com/photo-1516483638261-f41af5e5ceac?auto=format&fit=crop&q=80&w=600" },
    { title: "Designing for Comfort & Luxury", category: "Design", image: "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?auto=format&fit=crop&q=80&w=600" },
    { title: "Sustainable Travel Tips", category: "Lifestyle", image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=600" },
    { title: "Top 10 Winter Retreats", category: "Destinations", image: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=600" },
    { title: "How to Take Perfect Property Photos", category: "For Hosts", image: "https://images.unsplash.com/photo-1506241537529-eefea1fbe44d?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar forceCompact={true} />
      
      <main className="flex-1">
        <FooterPageHero 
          variant="centered"
          title="Inspiration for every journey."
          description="Discover travel guides, hosting tips, and editorial stories from the Stayr community."
          subtitle="Stayr Guides"
        />
        
        {/* Categories */}
        <section className="py-12 border-b border-[var(--color-border)] bg-white">
          <Container>
            <div className="flex flex-wrap justify-center gap-4">
              {['All Guides', 'Destinations', 'For Hosts', 'Travel Tips', 'Design'].map((cat, i) => (
                <button key={i} className={`px-6 py-2 rounded-full font-medium transition-colors ${i === 0 ? 'bg-[var(--color-foreground)] text-white' : 'bg-gray-100 text-[var(--color-muted)] hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </Container>
        </section>

        {/* Featured Guide */}
        <section className="py-16 md:py-24 bg-white">
          <Container>
            <AnimatedSection>
              <div className="flex flex-col lg:flex-row gap-10 items-center bg-[var(--color-foreground)] rounded-3xl overflow-hidden group cursor-pointer border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors shadow-2xl">
                <div className="w-full lg:w-3/5 h-[400px] lg:h-[500px] relative overflow-hidden">
                  <Image 
                    src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1200"
                    alt="Featured Guide"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="w-full lg:w-2/5 p-8 lg:p-12">
                  <span className="text-[var(--color-primary)] font-bold tracking-wider uppercase text-sm mb-4 block flex items-center gap-2"><Sparkles size={16}/> Featured</span>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-100 mb-4 leading-tight">The 2026 Global Travel Trends Report</h2>
                  <p className="text-gray-300 text-lg mb-8">Discover how luxury travel is evolving, from remote wellness retreats to tech-enabled smart homes. Our annual report covers everything you need to know.</p>
                  <div className="flex items-center text-[var(--color-primary)] font-bold group-hover:translate-x-2 transition-transform duration-300">
                    Read the report <ArrowRight size={20} className="ml-2" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </Container>
        </section>

        {/* Guide Grid */}
        <section className="py-16 md:py-24 bg-[var(--color-background)]">
          <Container>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-[var(--color-foreground)] flex items-center gap-3"><BookOpen size={28} className="text-[var(--color-primary)]"/> Latest Articles</h2>
            </div>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide, idx) => (
                <StaggerItem key={idx}>
                  <Link href="#" className="block group h-full bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all duration-300">
                    <div className="relative h-60 w-full overflow-hidden">
                      <Image 
                        src={guide.image} 
                        alt={guide.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2 block">{guide.category}</span>
                      <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-3 leading-snug">{guide.title}</h3>
                      <div className="flex items-center text-[var(--color-primary)] font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
                        Read more <ArrowRight size={16} className="ml-1" />
                      </div>
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
