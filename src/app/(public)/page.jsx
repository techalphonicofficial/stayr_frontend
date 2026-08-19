import Navbar from "@/components/navbar/Navbar";
import MemberBanner from "@/components/home/MemberBanner";
import PerfectPlaceSection from "@/components/home/PerfectPlaceSection";
import ListingCarousel from "@/components/listings/ListingCarousel";
import TrustBanner from "@/components/home/TrustBanner";
import DiscountedStays from "@/components/home/DiscountedStays";
import InspirationCards from "@/components/home/InspirationCards";
export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <Navbar />
      <div className="pt-[180px]">

        {/* Main Content */}
        <div className="pb-8 md:pb-16 flex flex-col gap-2 md:gap-8">

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
          <div className="mt-8">
            <TrustBanner />
          </div>

          <DiscountedStays />

          <InspirationCards />
        </div>
      </div>
    </div>
  );
}
