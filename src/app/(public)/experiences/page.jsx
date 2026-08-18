import Navbar from "@/components/navbar/Navbar";
import ExperiencesHero from "@/components/experiences/ExperiencesHero";
import ExperienceSearch from "@/components/experiences/ExperienceSearch";
import MoodCategories from "@/components/experiences/MoodCategories";
import FeaturedExperience from "@/components/experiences/FeaturedExperience";
import ExperienceCarousel from "@/components/experiences/ExperienceCarousel";
import StayrOriginals from "@/components/experiences/StayrOriginals";
import OneDayStory from "@/components/experiences/OneDayStory";
import LocalHosts from "@/components/experiences/LocalHosts";
import ExperienceHostCTA from "@/components/experiences/ExperienceHostCTA";

import { EXPERIENCES, STAYR_ORIGINALS } from "@/data/experiences";

export default function ExperiencesPage() {

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <Navbar />
      
      <main className="flex flex-col">
        {/* Hero & Search */}
        <div className="px-4 md:px-8">
          <ExperiencesHero />
        </div>
        <ExperienceSearch />

        {/* Categories */}
        <MoodCategories />

        {/* Editorial Feature */}
        <FeaturedExperience />

        {/* Carousel */}
        <ExperienceCarousel 
          title="Make more of your stay in NCR" 
          experiences={EXPERIENCES}
        />

        {/* Exclusive Section */}
        <StayrOriginals originals={STAYR_ORIGINALS} />

        {/* Itinerary */}
        <OneDayStory />

        {/* Meet the Locals */}
        <LocalHosts />

        {/* CTA */}
        <ExperienceHostCTA />
      </main>
    </div>
  );
}
