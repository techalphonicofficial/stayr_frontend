import RegionalPageLayout from "@/components/footer-pages/RegionalPageLayout";
import { Sun, Trees, Castle, Map } from "lucide-react";

export const metadata = {
  title: "Stayr India | Premium Villas & Retreats",
  description: "Experience the incredible heritage, luxury, and warmth of India through our curated premium properties.",
};

export default function StayrIndiaPage() {
  const features = [
    { title: "Heritage & Luxury", description: "From Rajasthani palaces to Goan beachfront villas, stay in properties steeped in character.", icon: Castle },
    { title: "Local Experiences", description: "Dedicated concierges to arrange private chefs, heritage walks, and exclusive access.", icon: Map },
    { title: "Tropical Retreats", description: "Escape to lush plantations in Kerala or serene mountains in Himachal Pradesh.", icon: Trees },
  ];

  const destinations = [
    { name: "Goa", properties: "245", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=600" },
    { name: "Rajasthan", properties: "180", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=600" },
    { name: "Kerala", properties: "156", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=600" },
    { name: "Himachal", properties: "112", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <RegionalPageLayout
      region="India"
      tagline="Incredible India, impeccably curated."
      description="Discover India's most extraordinary homes, from centuries-old heritage properties to modern tropical masterpieces. Every stay includes our signature 24/7 service."
      imageSrc="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1200"
      features={features}
      destinations={destinations}
    />
  );
}
