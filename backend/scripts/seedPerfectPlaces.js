import prisma from '../config/prisma.js';
import slugify from 'slugify';

// Helper to generate slug
const generateSlug = (title) => {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
  return `${baseSlug}-${Date.now().toString(36)}`;
};

async function main() {
  console.log('Seeding Perfect Places with high-quality images...');

  let host = await prisma.user.findFirst({ where: { role: 'Host' } });

  const categories = [
    {
      tab: 'beachfront',
      data: [
        { title: "Beachfront Villa with Private Access", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000", city: "Goa" },
        { title: "Luxury Beachfront Estate", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000", city: "Maldives" },
        { title: "Stunning Beachfront Cottage", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000", city: "Bali" },
        { title: "Beachfront Paradise Resort", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000", city: "Phuket" },
      ]
    },
    {
      tab: 'pools',
      data: [
        { title: "Villa with infinity pools", image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=1000", city: "Santorini" },
        { title: "Resort with multiple pools", image: "https://images.unsplash.com/photo-1571896349842-332d73be0761?auto=format&fit=crop&q=80&w=1000", city: "Dubai" },
        { title: "Private villa with heated pools", image: "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&q=80&w=1000", city: "Tuscany" },
        { title: "Mansion with private pools", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000", city: "Miami" },
      ]
    },
    {
      tab: 'international',
      data: [
        { title: "International Luxury Apartment", image: "https://images.unsplash.com/photo-1502602898657-3e907600bb13?auto=format&fit=crop&q=80&w=1000", city: "Paris" },
        { title: "International Skyline Penthouse", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000", city: "New York" },
        { title: "International Modern House", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000", city: "Tokyo" },
        { title: "International Classic Villa", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000", city: "London" },
      ]
    },
    {
      tab: 'family',
      data: [
        { title: "Spacious Family friendly house", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000", city: "Orlando" },
        { title: "Large Family friendly resort", image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1000", city: "Phuket" },
        { title: "Cozy Family friendly cabin", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000", city: "Aspen" },
        { title: "Ultimate Family friendly villa", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1000", city: "Costa Rica" },
      ]
    }
  ];

  for (const cat of categories) {
    for (const item of cat.data) {
      await prisma.property.create({
        data: {
          title: item.title,
          slug: generateSlug(item.title),
          description: `Enjoy this fantastic ${item.title} located in ${item.city}. Perfect for your next getaway! ${cat.tab}`,
          category: 'Villa',
          status: 'Published',
          address: `123 ${item.city} Road`,
          city: item.city,
          state: 'State',
          country: 'Country',
          pricePerNight: Math.floor(Math.random() * 20000) + 5000,
          maxGuests: 6,
          bedrooms: 3,
          bathrooms: 2,
          featuredImage: item.image,
          isApproved: true,
          isActive: true,
          hostId: host.id,
          averageRating: 4.9,
          totalReviews: Math.floor(Math.random() * 100) + 20,
        }
      });
    }
  }

  console.log('Successfully created Perfect Place properties!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
