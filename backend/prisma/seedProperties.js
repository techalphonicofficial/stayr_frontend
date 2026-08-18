import prisma from '../config/prisma.js';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('Reading payload...');
  const payloadPath = path.join(process.cwd(), 'prisma', 'propertiesPayload.json');
  let rawData = fs.readFileSync(payloadPath, 'utf8');
  if (rawData.charCodeAt(0) === 0xFEFF) rawData = rawData.slice(1);
  const data = JSON.parse(rawData);
  const properties = data.value || data;

  console.log(`Found ${properties.length} properties to seed.`);

  // Ensure a Host user exists to attach properties to
  let hostUser = await prisma.user.findFirst({
    where: { role: 'Host' }
  });

  if (!hostUser) {
    hostUser = await prisma.user.create({
      data: {
        name: 'Seed Host',
        email: 'host@stayr.seed',
        password: 'hashed_password_dummy',
        role: 'Host',
        isVerified: true
      }
    });
    console.log('Created dummy Host user.');
  } else {
    console.log(`Using existing Host user: ${hostUser.name}`);
  }

  // Clear existing properties (optional, but good for idempotent seeding)
  // await prisma.property.deleteMany({});
  
  for (const item of properties) {
    // Parse price
    const priceStr = item.price ? String(item.price).replace(/\D/g, '') : '0';
    const price = parseInt(priceStr, 10) || 0;

    // Check if property exists
    const existing = await prisma.property.findUnique({
      where: { slug: item.slug }
    });

    if (existing) {
      console.log(`Property ${item.slug} already exists. Skipping.`);
      continue;
    }

    const roomsAndBeds = {
      bedrooms: item.rooms || [],
      bathrooms: item.bathroomsList || [],
      spaces: item.spaces || []
    };

    const created = await prisma.property.create({
      data: {
        hostId: hostUser.id,
        title: item.title,
        slug: item.slug,
        description: item.description,
        category: 'Apartment', // Default category
        propertyType: item.propertyType || 'Entire property',
        status: 'Published',
        address: '123 Seed Street',
        city: 'Noida',
        state: 'Uttar Pradesh',
        country: 'India',
        pricePerNight: price,
        maxGuests: item.guests || 2,
        bedrooms: item.bedrooms || 1,
        bathrooms: item.bathrooms || 1,
        featuredImage: item.image,
        averageRating: parseFloat(item.rating) || 0,
        totalReviews: item.reviewCount || 0,
        
        // JSON Fields
        roomsAndBeds,
        houseRules: item.houseRules || [],
        cancellationPolicy: item.cancellationPolicy || {},
        importantInformation: item.importantInformation || [],
        nearbyPlaces: [],
        bookingSettings: { instantBook: true },
        aboutProperty: {
          title: item.title,
          description: item.description
        },
        
        // Amenities
        amenities: {
          create: (item.amenities || []).map(a => ({
            name: a,
            icon: 'check',
            available: true
          }))
        },
        
        // Images
        images: {
          create: (item.images || []).map((imgUrl, i) => ({
            url: imgUrl,
            isPrimary: i === 0,
            sortOrder: i
          }))
        }
      }
    });

    console.log(`Created property: ${created.title}`);
  }
  
  console.log('Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
