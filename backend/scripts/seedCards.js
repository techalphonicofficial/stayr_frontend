import prisma from '../config/prisma.js';

const LOCATIONS = [
  { city: 'Gurgaon', titlePrefix: 'Luxury Stay in Gurgaon' },
  { city: 'Delhi', titlePrefix: 'Premium Apartment in New Delhi' },
  { city: 'Goa', titlePrefix: 'Beachfront Villa in North Goa' }
];

async function main() {
  console.log('Seeding 15 dynamic cards for each location...');

  // Find or create a host
  let host = await prisma.user.findFirst({
    where: { role: 'Host' }
  });

  if (!host) {
    host = await prisma.user.create({
      data: {
        name: 'Super Host',
        email: `host_${Date.now()}@example.com`,
        password: 'hashed_password_placeholder',
        role: 'Host',
        isVerified: true
      }
    });
  }

  const dummyImages = [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1de2d9204b?w=800&q=80'
  ];

  for (const loc of LOCATIONS) {
    console.log(`Creating 15 properties for ${loc.city}...`);
    for (let i = 1; i <= 15; i++) {
      const slug = `${loc.city.toLowerCase().replace(/\s+/g, '-')}-property-${Date.now()}-${i}`;
      
      const property = await prisma.property.create({
        data: {
          hostId: host.id,
          title: `${loc.titlePrefix} ${i}`,
          slug: slug,
          description: `A beautiful dynamic card property located in the heart of ${loc.city}.`,
          category: 'Apartment',
          status: 'Published',
          address: `Address ${i}, ${loc.city}`,
          city: loc.city,
          state: 'State',
          country: 'India',
          pricePerNight: Math.floor(Math.random() * 5000) + 2000,
          cleaningFee: 500,
          serviceFee: 200,
          maxGuests: Math.floor(Math.random() * 4) + 2,
          bedrooms: Math.floor(Math.random() * 3) + 1,
          bathrooms: Math.floor(Math.random() * 2) + 1,
          beds: Math.floor(Math.random() * 3) + 1,
          featuredImage: dummyImages[i % dummyImages.length],
          averageRating: 4.5 + Math.random() * 0.5,
          totalReviews: Math.floor(Math.random() * 50) + 10,
          isActive: true,
          isApproved: true
        }
      });
      console.log(`Created property: ${property.title}`);
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
