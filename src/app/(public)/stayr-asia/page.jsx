import RegionalPageLayout from "@/components/footer-pages/RegionalPageLayout";
import { TreePalm, Ship, Coffee, Map } from "lucide-react";

export const metadata = {
  title: "Stayr Asia | Exotic Retreats",
  description: "Explore the vibrant cultures and stunning landscapes of Asia from the comfort of a Stayr luxury property.",
};

export default function StayrAsiaPage() {
  const features = [
    { title: "Tropical Villas", description: "Experience private infinity pools overlooking lush jungles and turquoise waters.", icon: TreePalm },
    { title: "Island Hopping", description: "Access exclusive private island retreats and beachfront estates.", icon: Ship },
    { title: "Cultural Immersion", description: "Immerse yourself in local traditions with curated experiences organized by your host.", icon: Coffee },
  ];

  const destinations = [
    { name: "Bali", properties: "450", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600" },
    { name: "Phuket", properties: "320", image: "https://images.unsplash.com/photo-1589394815804-964ce0ff96f8?auto=format&fit=crop&q=80&w=600" },
    { name: "Koh Samui", properties: "215", image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&q=80&w=600" },
    { name: "Kyoto", properties: "180", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <RegionalPageLayout
      region="Asia"
      tagline="Uncover the soul of the East."
      description="From serene Japanese ryokans to sprawling Balinese villas, experience the unparalleled hospitality and beauty of Asia with Stayr's curated collection."
      imageSrc="https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?auto=format&fit=crop&q=80&w=1200"
      features={features}
      destinations={destinations}
    />
  );
}
