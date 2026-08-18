import Navbar from "../navbar/Navbar";
import FooterPageHero from "./FooterPageHero";
import Container from "../common/Container";
import { AnimatedSection } from "./AnimatedSection";

export default function LegalPageLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar forceCompact={true} />
      
      <main className="flex-1">
        <FooterPageHero 
          variant="legal"
          title={title}
          description={`Last updated: ${lastUpdated}`}
        />
        
        <section className="py-16 md:py-24">
          <Container>
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-[var(--color-border)] shadow-sm">
              <AnimatedSection>
                <div className="prose max-w-none prose-headings:text-[var(--color-primary)] prose-headings:font-bold prose-p:text-[var(--color-muted)] prose-a:text-[var(--color-primary)] hover:prose-a:text-[var(--color-primary-hover)]">
                  {children}
                </div>
              </AnimatedSection>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
