import prisma from '../config/prisma.js';

const VALID_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1de2d93688?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80"
];

async function main() {
  console.log('Fixing broken dummy images...');

  const properties = await prisma.property.findMany();

  let updatedCount = 0;

  for (const property of properties) {
    if (property.featuredImage && property.featuredImage.includes('images.unsplash.com')) {
      // Check if it's one of the known valid ones
      if (!VALID_IMAGES.some(valid => property.featuredImage.includes(valid.split('?')[0]))) {
        // It's a broken Unsplash image. Replace it with a valid one.
        const validImage = VALID_IMAGES[Math.floor(Math.random() * VALID_IMAGES.length)];
        await prisma.property.update({
          where: { id: property.id },
          data: { featuredImage: validImage }
        });
        updatedCount++;
      }
    }
  }

  console.log(`Successfully fixed ${updatedCount} broken images!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
