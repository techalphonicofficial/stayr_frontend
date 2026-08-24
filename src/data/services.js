export const SERVICES = [
  {
    id: "svc-1",
    slug: "authentic-north-indian-dinner-chef-meera",
    title: "Authentic North Indian Dinner by Chef Meera",
    category: "Private Chefs",
    location: "Provided at your stay",
    image: "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9de?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9de?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Enjoy a personalized culinary journey right at your dining table. Chef Meera prepares exquisite regional delicacies using fresh, local ingredients.",
    price: 3500,
    rating: 4.98,
    reviewCount: 204,
    duration: "2-3 hours",
    provider: "h1", // Linking to host for simplicity
    availability: "Available Today",
    badge: "Guest Favorite",
    featured: true
  },
  {
    id: "svc-2",
    slug: "in-room-swedish-massage",
    title: "In-Room Swedish Massage",
    category: "Massage and Wellness",
    location: "Provided at your stay",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Unwind completely with a professional massage therapist who brings the spa experience to you.",
    price: 2800,
    rating: 4.95,
    reviewCount: 156,
    duration: "60 mins",
    provider: "h3",
    availability: "Available in 2 hours",
    featured: false
  },
  {
    id: "svc-3",
    slug: "premium-airport-transfer",
    title: "Premium Airport Transfer",
    category: "Local Drivers",
    location: "Airport to Stay",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Start your trip stress-free with a luxury vehicle waiting for you at arrivals.",
    price: 1500,
    rating: 4.88,
    reviewCount: 420,
    duration: "Trip duration",
    provider: "h4",
    availability: "Always Available",
    featured: false
  },
  {
    id: "svc-4",
    slug: "professional-couple-photoshoot",
    title: "Professional Couple Photoshoot",
    category: "Photography",
    location: "At your stay & surroundings",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Capture the magic of your stay with a curated photoshoot by a professional.",
    price: 5000,
    rating: 4.9,
    reviewCount: 88,
    duration: "2 hours",
    provider: "h2",
    availability: "Available Tomorrow",
    badge: "Perfect for Occasions",
    featured: false
  }
];

export const SERVICE_CATEGORIES = [
  { id: 'sc1', title: 'Private Chefs', icon: 'Utensils' },
  { id: 'sc2', title: 'Massage & Wellness', icon: 'Sparkles' },
  { id: 'sc3', title: 'Photography', icon: 'Camera' },
  { id: 'sc4', title: 'Personal Training', icon: 'Dumbbell' },
  { id: 'sc5', title: 'Beauty & Styling', icon: 'Scissors' },
  { id: 'sc6', title: 'Housekeeping', icon: 'Brush' },
  { id: 'sc7', title: 'Local Drivers', icon: 'Car' },
  { id: 'sc8', title: 'Event Planning', icon: 'CalendarHeart' }
];

export const OCCASION_PACKAGES = [
  {
    id: "pkg-1",
    title: "The Perfect Proposal",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
    includes: ["Decoration", "Flowers", "Photographer", "Private dinner", "Live music"],
    price: "From ₹15,000"
  },
  {
    id: "pkg-2",
    title: "Birthday Celebration",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
    includes: ["Balloons & Decor", "Custom Cake", "Private Chef", "Mixologist"],
    price: "From ₹8,500"
  },
  {
    id: "pkg-3",
    title: "Anniversary Getaway",
    image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&q=80&w=800",
    includes: ["Room Decoration", "Couples Massage", "Candlelight Dinner"],
    price: "From ₹12,000"
  }
];
