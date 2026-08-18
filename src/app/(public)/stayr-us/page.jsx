import RegionalPageLayout from "@/components/footer-pages/RegionalPageLayout";
import { Mountain, Trees, Waves, Building } from "lucide-react";

export const metadata = {
  title: "Stayr US | Diverse Landscapes",
  description: "From coastal escapes to mountain retreats and urban lofts, discover the best of the US with Stayr.",
};

export default function StayrUSPage() {
  const features = [
    { title: "Coastal Escapes", description: "Enjoy private beachfront estates from Malibu to the Hamptons.", icon: Waves },
    { title: "Mountain Retreats", description: "Cozy up in luxury cabins in Aspen, Tahoe, or the Smokies.", icon: Mountain },
    { title: "Urban Penthouses", description: "Experience the city skyline from premium apartments in NYC, LA, and Chicago.", icon: Building },
  ];

  const destinations = [
    { name: "Aspen", properties: "185", image: "https://images.unsplash.com/photo-1542617651-789a4cd860c4?auto=format&fit=crop&q=80&w=600" },
    { name: "Malibu", properties: "230", image: "https://images.unsplash.com/photo-1517409276901-496cdbc62c01?auto=format&fit=crop&q=80&w=600" },
    { name: "New York City", properties: "520", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600" },
    { name: "Miami", properties: "340", image: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <RegionalPageLayout
      region="United States"
      tagline="Diverse landscapes, exceptional stays."
      description="Whether you're looking for a winter ski trip, a summer beach getaway, or a bustling city weekend, Stayr US has the perfect premium home for you."
      imageSrc="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=1200"
      features={features}
      destinations={destinations}
    />
  );
}
