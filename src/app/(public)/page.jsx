import Navbar from "@/components/navbar/Navbar";
import MemberBanner from "@/components/home/MemberBanner";
import PerfectPlaceSection from "@/components/home/PerfectPlaceSection";
import ListingCarousel from "@/components/listings/ListingCarousel";
import TrustBanner from "@/components/home/TrustBanner";
import DiscountedStays from "@/components/home/DiscountedStays";
import InspirationCards from "@/components/home/InspirationCards";
import HomeHero from "@/components/home/HomeHero";
import WhyStayrSection from "@/components/home/WhyStayrSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <Navbar />
      
      {/* New Hero Section */}
      <div className="pt-[180px]">
        <HomeHero />
      </div>
      
      {/* New Why Stayr Section */}
      <WhyStayrSection />

      <div className="pt-0">
        {/* Main Content */}
        <div className="pb-8 md:pb-12 flex flex-col gap-4 md:gap-6">

          <ListingCarousel
            title="Popular homes in Noida"
            location="Noida"
          />
          <ListingCarousel
            title="Available in Gurgaon District this weekend"
            location="Gurgaon"
          />

          <MemberBanner />

          <PerfectPlaceSection />
          <ListingCarousel
            title="Stay in North Goa"
            location="Goa"
          />
          <ListingCarousel
            title="Available in New Delhi this weekend"
            location="Delhi"
          />

          {/* Trust Banner */}
          <TrustBanner />

          <DiscountedStays />

          <InspirationCards />
        </div>
      </div>
    </div>
  );
}
