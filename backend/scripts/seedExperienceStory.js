import prisma from '../config/prisma.js';

const DEFAULT_STORY = {
  title: "A Royal Day in Jaipur",
  subtitle: "couple",
  description: "Experience the Pink City like royalty with a perfectly curated dawn-to-dusk itinerary.",
  packageText: "Complete Package",
  price: 12500,
  currency: "INR",
  image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1200",
  isActive: true,
  timeline: [
    { time: "8:00 AM", title: "Heritage breakfast", desc: "Start the day with traditional kachoris and chai overlooking the city." },
    { time: "10:00 AM", title: "Block-printing workshop", desc: "Learn ancient textile arts from a master artisan in their home studio." },
    { time: "1:00 PM", title: "Traditional Rajasthani lunch", desc: "An authentic thali experience in a restored 200-year-old courtyard." },
    { time: "4:00 PM", title: "Hidden palace tour", desc: "Exclusive access to private quarters and untold royal histories." },
    { time: "7:00 PM", title: "Rooftop sunset dinner", desc: "End the day with a majestic view of the illuminated fort." },
  ]
};

async function seed() {
  try {
    console.log("Seeding Experience Story...");
    const existing = await prisma.experienceStory.findFirst();
    if (existing) {
      console.log("Already seeded.");
    } else {
      await prisma.experienceStory.create({
        data: DEFAULT_STORY
      });
      console.log("Seeded successfully!");
    }
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
