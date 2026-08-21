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
  console.log('Seeding Properties for Inspiration Cards...');

  // Get or create a default host user
  let host = await prisma.user.findFirst({
    where: { role: 'Host' }
  });

  if (!host) {
    host = await prisma.user.create({
      data: {
        name: 'Super Host',
        email: 'host' + Date.now() + '@stayr.com',
        password: 'hashedpassword',
        role: 'Host',
        isVerified: true
      }
    });
  }

  const destinations = [
    { city: 'Himachal', state: 'Himachal Pradesh', category: 'Cottage' },
    { city: 'Goa', state: 'Goa', category: 'Villa' },
    { city: 'Rajasthan', state: 'Rajasthan', category: 'Resort' },
    { city: 'Kerala', state: 'Kerala', category: 'House' },
    { city: 'Mumbai', state: 'Maharashtra', category: 'Apartment' },
    { city: 'Jaisalmer', state: 'Rajasthan', category: 'Cabin' }, // using Cabin for desert camp
    { city: 'Kashmir', state: 'Jammu & Kashmir', category: 'Cabin' },
    { city: 'Rishikesh', state: 'Uttarakhand', category: 'Resort' },
    { city: 'Udaipur', state: 'Rajasthan', category: 'Villa' },
    { city: 'Manali', state: 'Himachal Pradesh', category: 'House' },
    { city: 'Darjeeling', state: 'West Bengal', category: 'Cottage' },
    { city: 'Lonavala', state: 'Maharashtra', category: 'Villa' },
    { city: 'Andaman', state: 'Andaman & Nicobar', category: 'Resort' },
    { city: 'Mysore', state: 'Karnataka', category: 'House' },
    { city: 'Coorg', state: 'Karnataka', category: 'Farmhouse' }
  ];

  let createdCount = 0;

  for (const dest of destinations) {
    // Create 2 properties for each destination
    for (let i = 1; i <= 2; i++) {
      const title = `Beautiful ${dest.category} in ${dest.city} - ${i}`;
      await prisma.property.create({
        data: {
          title,
          slug: generateSlug(title),
          description: `Enjoy your stay at this amazing ${dest.category} located in the heart of ${dest.city}. Perfect for getaways.`,
          category: dest.category,
          status: 'Published',
          address: `123 Main St, ${dest.city}`,
          city: dest.city,
          state: dest.state,
          country: 'India',
          pricePerNight: Math.floor(Math.random() * 10000) + 2000,
          maxGuests: Math.floor(Math.random() * 6) + 2,
          bedrooms: Math.floor(Math.random() * 3) + 1,
          bathrooms: Math.floor(Math.random() * 2) + 1,
          featuredImage: `https://loremflickr.com/800/600/${dest.city.toLowerCase()}`,
          isApproved: true,
          isActive: true,
          hostId: host.id,
        }
      });
      createdCount++;
    }
  }

  console.log(`Successfully seeded ${createdCount} properties for Inspiration Cards!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
