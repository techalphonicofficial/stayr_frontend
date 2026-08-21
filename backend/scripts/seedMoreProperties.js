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
  console.log('Seeding 10 MORE properties for each destination...');

  // Get or create a default host user
  let host = await prisma.user.findFirst({
    where: { role: 'Host' }
  });

  const destinations = [
    { city: 'Himachal', state: 'Himachal Pradesh', category: 'Cottage', keywords: 'mountains,snow,resort' },
    { city: 'Goa', state: 'Goa', category: 'Villa', keywords: 'beach,villa,pool' },
    { city: 'Rajasthan', state: 'Rajasthan', category: 'Resort', keywords: 'palace,desert,luxury' },
    { city: 'Kerala', state: 'Kerala', category: 'House', keywords: 'backwaters,treehouse,nature' },
    { city: 'Mumbai', state: 'Maharashtra', category: 'Apartment', keywords: 'city,apartment,skyline' },
    { city: 'Jaisalmer', state: 'Rajasthan', category: 'Cabin', keywords: 'desert,camp,tent' },
    { city: 'Kashmir', state: 'Jammu & Kashmir', category: 'Cabin', keywords: 'snow,valley,cottage' },
    { city: 'Rishikesh', state: 'Uttarakhand', category: 'Resort', keywords: 'river,yoga,resort' },
    { city: 'Udaipur', state: 'Rajasthan', category: 'Villa', keywords: 'lake,palace,romantic' },
    { city: 'Manali', state: 'Himachal Pradesh', category: 'House', keywords: 'himalayas,house,pine' },
    { city: 'Darjeeling', state: 'West Bengal', category: 'Cottage', keywords: 'tea,garden,bungalow' },
    { city: 'Lonavala', state: 'Maharashtra', category: 'Villa', keywords: 'hills,villa,monsoon' },
    { city: 'Andaman', state: 'Andaman & Nicobar', category: 'Resort', keywords: 'island,beach,resort' },
    { city: 'Mysore', state: 'Karnataka', category: 'House', keywords: 'heritage,palace,house' },
    { city: 'Coorg', state: 'Karnataka', category: 'Farmhouse', keywords: 'coffee,estate,nature' }
  ];

  let createdCount = 0;

  for (const dest of destinations) {
    // We already created 2 in the previous script. Let's add 10 MORE per destination.
    for (let i = 3; i <= 12; i++) {
      const title = `Luxurious ${dest.category} in ${dest.city} - ${i}`;
      
      // We add a unique random parameter so loremflickr returns different images for each
      const randomSeed = Math.floor(Math.random() * 10000);
      const imageUrl = `https://loremflickr.com/800/600/${dest.keywords}/all?random=${randomSeed}`;
      
      const property = await prisma.property.create({
        data: {
          title,
          slug: generateSlug(title),
          description: `Escape to this mesmerising ${dest.category} located in the heart of ${dest.city}. Experience world-class hospitality and stunning views.`,
          category: dest.category,
          status: 'Published',
          address: `Scenic Route ${i}, ${dest.city}`,
          city: dest.city,
          state: dest.state,
          country: 'India',
          pricePerNight: Math.floor(Math.random() * 15000) + 4000,
          maxGuests: Math.floor(Math.random() * 8) + 2,
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          featuredImage: imageUrl,
          isApproved: true,
          isActive: true,
          hostId: host.id,
          averageRating: (Math.random() * (5.0 - 4.5) + 4.5), // between 4.5 and 5.0
          totalReviews: Math.floor(Math.random() * 50) + 10,
        }
      });
      createdCount++;
    }
  }

  console.log(`Successfully seeded ${createdCount} additional properties!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
