import Navbar from "@/components/navbar/Navbar";
import FooterPageHero from "@/components/footer-pages/FooterPageHero";
import Container from "@/components/common/Container";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/footer-pages/AnimatedSection";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Newsroom | Stayr",
  description: "Get the latest news, updates, and announcements from Stayr.",
};

export default function NewsroomPage() {
  const news = [
    { title: "Stayr Launches New AI-Powered Host Tools", date: "August 12, 2026", category: "Product News", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" },
    { title: "Expanding our Luxury Portfolio in Southeast Asia", date: "July 28, 2026", category: "Company", image: "https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?auto=format&fit=crop&q=80&w=600" },
    { title: "Announcing the Stayr Sustainability Initiative", date: "June 15, 2026", category: "Initiatives", image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=600" },
    { title: "Q2 2026 Financial Results", date: "July 10, 2026", category: "Financials", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar forceCompact={true} />
      
      <main className="flex-1">
        <FooterPageHero 
          variant="centered"
          title="Stayr Newsroom"
          description="The latest news, announcements, and stories from the Stayr team."
          subtitle="Press & Media"
        />
        
        {/* Featured News */}
        <section className="py-16 bg-white">
          <Container>
            <AnimatedSection>
              <div className="flex flex-col lg:flex-row gap-10 items-center bg-[var(--color-background)] rounded-3xl overflow-hidden border border-[var(--color-border)] group cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                <div className="w-full lg:w-1/2 h-[350px] lg:h-[450px] relative overflow-hidden">
                  <Image 
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200"
                    alt="Featured News"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="w-full lg:w-1/2 p-8 lg:p-12">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[var(--color-primary)] font-bold tracking-wider uppercase text-xs">Press Release</span>
                    <span className="text-[var(--color-muted)] text-sm font-medium">August 15, 2026</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-foreground)] mb-6 leading-tight">Stayr Reaches Milestone of 1 Million Premium Listings Globaly</h2>
                  <p className="text-[var(--color-muted)] text-lg mb-8 line-clamp-3">Today, we are thrilled to announce that Stayr has officially surpassed one million active premium property listings across 190 countries, cementing our position as the leader in luxury short-term rentals.</p>
                  <div className="flex items-center text-[var(--color-primary)] font-bold group-hover:translate-x-2 transition-transform duration-300">
                    Read the full story <ArrowRight size={20} className="ml-2" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </Container>
        </section>

        {/* Latest News Grid */}
        <section className="py-16 md:py-24 bg-[var(--color-background)]">
          <Container>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-[var(--color-foreground)]">Latest News</h2>
              <button className="px-6 py-2 border border-[var(--color-border)] rounded-full font-medium hover:border-[var(--color-primary)] transition-colors text-sm text-[var(--color-foreground)]">
                View All
              </button>
            </div>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news.map((item, idx) => (
                <StaggerItem key={idx}>
                  <Link href="#" className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-300 group h-full">
                    <div className="relative w-full sm:w-40 h-48 sm:h-auto rounded-xl overflow-hidden shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">{item.category}</span>
                        <span className="text-xs text-[var(--color-muted)] font-medium">{item.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-4 leading-snug">{item.title}</h3>
                      <div className="mt-auto flex items-center text-[var(--color-primary)] font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
                        Read <ArrowRight size={16} className="ml-1" />
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
