import prisma from '../config/prisma.js';

async function main() {
  console.log('Removing "Property ID" from importantInformation...');
  const properties = await prisma.property.findMany();
  let updatedCount = 0;
  
  for (const property of properties) {
    if (property.importantInformation && Array.isArray(property.importantInformation)) {
      const filteredInfo = property.importantInformation.filter(
        info => typeof info === 'string' && !info.startsWith('Property ID:')
      );
      
      if (filteredInfo.length !== property.importantInformation.length) {
        await prisma.property.update({
          where: { id: property.id },
          data: { importantInformation: filteredInfo }
        });
        updatedCount++;
      }
    }
  }
  
  console.log(`Successfully updated ${updatedCount} properties.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
