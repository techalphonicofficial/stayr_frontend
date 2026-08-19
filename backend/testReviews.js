import prisma from './config/prisma.js';

async function test() {
  const reviews = await prisma.review.findMany({
    where: { propertyId: '481611d6-8a91-4dbd-a0f0-2502b457d583' },
    include: {
      guest: { select: { id: true, name: true } },
      property: { select: { id: true, title: true } }
    }
  });
  console.log(JSON.stringify(reviews, null, 2));
}

test().catch(console.error).finally(() => prisma.$disconnect());
