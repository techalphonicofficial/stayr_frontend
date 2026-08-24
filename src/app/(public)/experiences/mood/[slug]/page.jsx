import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/navbar/Navbar";
import ExperienceCard from "@/components/experiences/ExperienceCard";
import Container from "@/components/common/Container";
import ScrollToTop from "@/components/common/ScrollToTop";
import { MOODS } from "@/data/moods";
import { EXPERIENCES } from "@/data/experiences";

export default async function MoodPage({ params }) {
  const { slug } = await params;
  const mood = MOODS.find((m) => m.id === slug);

  if (!mood) {
    notFound();
  }

  const getPersonalizedExperiences = (moodId) => {
    let matched = [];
    switch (moodId) {
      case "taste":
        matched = EXPERIENCES.filter(e => e.category === "Food");
        break;
      case "create":
        matched = EXPERIENCES.filter(e => e.category === "Art" || e.category === "Photography");
        break;
      case "adventure":
        matched = EXPERIENCES.filter(e => e.category === "Adventure");
        break;
      case "slow":
        matched = EXPERIENCES.filter(e => e.category === "Wellness");
        break;
      case "culture":
        matched = EXPERIENCES.filter(e => e.category === "Culture");
        break;
      case "celebrate":
        matched = EXPERIENCES.filter(e => e.category === "Food" || e.category === "Culture");
        break;
      default:
        matched = EXPERIENCES.slice(0, 4);
    }
    
    // Pad to 4 items to keep the grid full, prioritizing matched experiences
    const others = EXPERIENCES.filter(e => !matched.find(m => m.id === e.id));
    return [...matched, ...others].slice(0, 4);
  };

  const moodExperiences = getPersonalizedExperiences(mood.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[40vh] min-h-[400px] w-full bg-secondary mt-40">
          <Image
            src={mood.image}
            alt={mood.label}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Container>
              <div className="flex flex-col items-center justify-center text-center text-white pointer-events-auto">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-6">
                  <mood.icon className="w-10 h-10" />
                </div>
                <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 drop-shadow-lg text-primary">
                  {mood.label}
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md">
                  Discover curated experiences specifically designed to match your mood.
                </p>
              </div>
            </Container>
          </div>
        </div>

        {/* Experiences Grid */}
        <Container className="py-16">
          <div className="mt-8 mb-10 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Experiences for "{mood.label}"
            </h2>
            <p className="text-muted mt-2 max-w-2xl">
              Explore these hand-picked options to find exactly what you're looking for.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {moodExperiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>

          {moodExperiences.length === 0 && (
            <div className="text-center py-20 text-muted">
              No experiences found for this mood yet. Check back later!
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
