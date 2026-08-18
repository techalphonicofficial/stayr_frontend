import { ALL_LISTINGS } from "./listings";

/**
 * Deterministically generates rich property details for ANY listing ID.
 * This ensures every property card across the site has a fully functional detail page
 * without manually writing JSON for hundreds of mock properties.
 */
export const getDetailedPropertyById = (id) => {
  const numericId = parseInt(id, 10);
  const baseListing = ALL_LISTINGS.find(listing => listing.id === numericId);
  
  if (!baseListing) return null;
  
  const seed = baseListing.id;
  
  // Deterministic random helpers based on ID
  const randomCount = (min, max) => min + (seed % (max - min + 1));
  
  const bedroomCount = randomCount(1, 5);
  const guestCount = bedroomCount * 2 + (seed % 3);
  const bathroomCount = Math.max(1, Math.floor(bedroomCount / 1.5) + (seed % 2));
  
  // Generate rooms
  const rooms = [];
  for (let i = 1; i <= bedroomCount; i++) {
    const bedType = i === 1 ? "1 King Bed" : (seed % 2 === 0 ? "1 Queen Bed" : "2 Twin Beds");
    rooms.push({
      name: `Bedroom ${i}`,
      beds: [bedType]
    });
  }

  // Generate bathrooms
  const bathrooms = [];
  for (let i = 1; i <= bathroomCount; i++) {
    bathrooms.push({
      name: `Bathroom ${i}`,
      amenities: ["Towels provided", "Bathtub or shower", "Toilet"]
    });
  }

  // Spaces
  const allSpaces = ["Kitchen", "Dining area", "Living room", "Balcony", "Garden", "Patio", "Pool area"];
  const spaces = [allSpaces[0], allSpaces[1]]; 
  if (seed % 2 === 0) spaces.push(allSpaces[2]);
  if (seed % 3 === 0) spaces.push(allSpaces[3]);
  if (seed % 5 === 0) spaces.push(allSpaces[6]);

  // Host
  const hostNames = ["Amit", "Neha", "Rahul", "Priya", "Vikram", "Sneha", "Anil", "Meera"];
  const host = {
    name: hostNames[seed % hostNames.length],
    role: "Host",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    joinedDate: `Joined in 202${seed % 4}`
  };

  // Reviews
  const reviewCount = (seed * 7) % 300 + 12;
  const rating = baseListing.rating;
  const reviews = [
    {
      id: 1,
      rating: "10/10 Excellent",
      text: "Beautiful property and wonderful stay! The host was extremely accommodating and the location was perfect. Would definitely recommend to anyone visiting.",
      author: "Verified traveler",
      date: "Stayed 2 nights in Mar 2024",
      verified: true
    },
    {
      id: 2,
      rating: "8/10 Very Good",
      text: "Great experience overall. The amenities were as described and the place was spotless. Just a minor issue with the wifi signal in one of the bedrooms.",
      author: "Satisfied guest",
      date: "Stayed 3 nights in Feb 2024",
      verified: true
    },
    {
      id: 3,
      rating: "10/10 Excellent",
      text: "Absolutely stunning. Exceeded our expectations in every way. The pictures don't do it justice!",
      author: "Happy family",
      date: "Stayed 5 nights in Jan 2024",
      verified: true
    }
  ];

  // Images (Fallback to placeholders if not enough provided by baseListing)
  let images = [
    baseListing.image,
    "https://images.unsplash.com/photo-1560347876-aeef00ee58a4?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
  ];
  
  return {
    ...baseListing,
    slug: baseListing.id.toString(), // For static routing, just use ID as slug
    propertyType: "Entire property",
    guests: guestCount,
    bedrooms: bedroomCount,
    bathrooms: bathroomCount,
    rooms,
    bathroomsList: bathrooms,
    spaces,
    description: `Welcome to our luxurious property in ${baseListing.title.split(" in ")[1] || "the city"}! With ${bedroomCount} spacious rooms, this property offers everything you need for a comfortable stay. Enjoy modern amenities, a fully equipped kitchen, and a beautiful living space designed for relaxation. Whether you're here for a family vacation or a weekend getaway with friends, you'll find everything you need right here.`,
    host,
    reviewCount,
    reviews,
    images,
    houseRules: [
      "Check-in after 2:00 PM",
      "Check-out before 11:00 AM",
      "No smoking",
      "No parties or events",
      "Quiet hours 10:00 PM - 7:00 AM",
      seed % 2 === 0 ? "Pets allowed" : "No pets allowed"
    ],
    importantInformation: [
      `Property #${baseListing.id + 10000}`,
      "Extra-person charges may apply and vary depending on property policy.",
      "Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges.",
      "Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed."
    ],
    cancellationPolicy: {
      fullRefundDays: 14,
      partialRefundDays: 7
    }
  };
};
