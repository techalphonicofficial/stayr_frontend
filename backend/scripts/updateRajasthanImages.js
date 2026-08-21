import prisma from '../config/prisma.js';

async function main() {
  console.log('Updating images for Rajasthan properties...');

  // A curated list of beautiful, relevant architecture/resort/palace images
  const rajasthanImages = [
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1000", // Rajasthan palace
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1000", // Jaipur architecture
    "https://images.unsplash.com/photo-1524230572899-a752b38b5844?auto=format&fit=crop&q=80&w=1000", // Resort pool
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1000", // Taj hotel style
    "https://images.unsplash.com/photo-1582502396173-982eb6064d7c?auto=format&fit=crop&q=80&w=1000", // Hawa mahal
    "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&q=80&w=1000", // Luxury hotel room
    "https://images.unsplash.com/photo-1541971808466-419b45e998a6?auto=format&fit=crop&q=80&w=1000", // Udaipur lake palace style
    "https://images.unsplash.com/photo-1574971842918-a6dff98cd1ec?auto=format&fit=crop&q=80&w=1000", // Amer fort
    "https://images.unsplash.com/photo-1605813800632-4d2be73cfa87?auto=format&fit=crop&q=80&w=1000", // Desert camp/resort
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000", // Luxury resort exterior
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000", // Tropical luxury resort
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1000", // Luxury interior
  ];

  const properties = await prisma.property.findMany({
    where: { city: 'Rajasthan' },
    orderBy: { createdAt: 'asc' }
  });

  let updateCount = 0;

  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    const newImage = rajasthanImages[i % rajasthanImages.length];
    
    await prisma.property.update({
      where: { id: property.id },
      data: { featuredImage: newImage }
    });
    updateCount++;
  }

  console.log(`Successfully updated images for ${updateCount} Rajasthan properties!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
