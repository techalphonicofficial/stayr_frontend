import RegionalPageLayout from "@/components/footer-pages/RegionalPageLayout";
import { Castle, Wine, Mountain, Ticket } from "lucide-react";

export const metadata = {
  title: "Stayr Europe | Classic Elegance",
  description: "Stay in historic chalets, rustic villas, and modern city apartments across Europe.",
};

export default function StayrEuropePage() {
  const features = [
    { title: "Historic Charm", description: "Experience the history of Europe by staying in beautifully restored historic properties.", icon: Castle },
    { title: "Culinary Journeys", description: "Stay near world-renowned vineyards and culinary capitals with private chefs available.", icon: Wine },
    { title: "Alpine Escapes", description: "Discover luxury chalets in the Alps with ski-in/ski-out access and alpine views.", icon: Mountain },
  ];

  const destinations = [
    { name: "Tuscany", properties: "340", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=600" },
    { name: "Amalfi Coast", properties: "210", image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=600" },
    { name: "Provence", properties: "195", image: "https://images.unsplash.com/photo-1502602898657-3e907fa3a2ed?auto=format&fit=crop&q=80&w=600" },
    { name: "Swiss Alps", properties: "150", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <RegionalPageLayout
      region="Europe"
      tagline="Classic elegance, redefined."
      description="Whether you're sipping wine in Tuscany or skiing the Swiss Alps, Stayr Europe offers unparalleled access to the continent's finest homes."
      imageSrc="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1200"
      features={features}
      destinations={destinations}
    />
  );
}
