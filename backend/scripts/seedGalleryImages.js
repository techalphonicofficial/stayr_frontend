import prisma from '../config/prisma.js';

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1de2d93688?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80"
];

async function main() {
  console.log('Seeding gallery images for all properties...');

  const properties = await prisma.property.findMany({
    include: { images: true }
  });

  console.log(`Found ${properties.length} properties.`);

  let updatedCount = 0;

  for (const property of properties) {
    if (property.images.length === 0) {
      // Shuffle the gallery images a bit to make them look different
      const shuffled = [...GALLERY_IMAGES].sort(() => 0.5 - Math.random());
      
      const imagesToCreate = shuffled.slice(0, 5).map((url, index) => ({
        url,
        propertyId: property.id,
        isPrimary: index === 0,
        sortOrder: index
      }));

      await prisma.propertyImage.createMany({
        data: imagesToCreate
      });
      
      updatedCount++;
    }
  }

  console.log(`Successfully seeded gallery images for ${updatedCount} properties!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
