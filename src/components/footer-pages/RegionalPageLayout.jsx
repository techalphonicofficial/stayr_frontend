import Navbar from "../navbar/Navbar";
import FooterPageHero from "./FooterPageHero";
import Container from "../common/Container";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function RegionalPageLayout({ region, tagline, description, imageSrc, features, destinations }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar forceCompact={true} />
      
      <main className="flex-1">
        <FooterPageHero 
          variant="split"
          subtitle={`Discover ${region}`}
          title={tagline}
          description={description}
          imageSrc={imageSrc}
        />
        
        {/* Features Section */}
        <section className="py-20 bg-white">
          <Container>
            <AnimatedSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-4">Why Stayr {region}</h2>
                <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">Experience the best of {region} with our curated selection of premium properties.</p>
              </div>
            </AnimatedSection>
            
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <StaggerItem key={idx} className="text-center p-6 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)]">
                  <div className="w-16 h-16 mx-auto bg-[var(--color-secondary)] text-[var(--color-primary)] rounded-full flex items-center justify-center mb-6">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-3">{feature.title}</h3>
                  <p className="text-[var(--color-muted)]">{feature.description}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>

        {/* Top Destinations */}
        <section className="py-20">
          <Container>
            <AnimatedSection>
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-4">Top Destinations</h2>
                  <p className="text-lg text-[var(--color-muted)]">Explore the most sought-after locations in {region}.</p>
                </div>
              </div>
            </AnimatedSection>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((dest, idx) => (
                <StaggerItem key={idx}>
                  <Link href={`/s?location=${dest.name}`} className="group block">
                    <div className="relative h-[300px] rounded-2xl overflow-hidden mb-4">
                      <Image 
                        src={dest.image}
                        alt={dest.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-100">
                          <MapPin size={18} /> {dest.name}
                        </h3>
                        <p className="text-sm text-gray-300">{dest.properties} properties</p>
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
