import prisma from '../config/prisma.js';

const photoIds = [
  '1600596542815-ffad4c1539a9', '1512917774080-9991f1c4c750', '1600585154340-be6161a56a0c', '1580587771525-78b9dba3b914',
  '1600607687920-4e2a09be15c7', '1513694203232-719a280e022f', '1522708323590-d24dbb6b0267', '1502672260266-1c1de2d9204b',
  '1600566753190-17f0baa2a6c3', '1484154218962-a197022b5858', '1600573472591-ee6b68d14c68', '1600047509807-ba8f99d2cdde',
  '1600121848594-d8644e57abab', '1600585152220-90363fe7e115', '1600607686527-6fb886090705', '1600566752355-35792bedcfea',
  '1600585154526-990dced4db0d', '1564013799919-ab600027ffc6', '1599809275671-b5942cabc7a2', '1598928506311-c55d40f297ef',
  '1593696140826-c58b021acf8b', '1582268611958-ebfd161ef9cf', '1570129477492-45c003edd2be', '1572120360610-d971b9d7767c',
  '1568605114967-8130f3a36994', '1494526585095-c41746248156', '1510798831971-661eb04b3739', '1449844908441-8829872d2607',
  '1416331108676-a22ccb276e35', '1501183638710-841f50728cdc', '1448630360428-65456885c650', '1505843513577-22bb7dc1e2c7',
  '1472224371017-08207f84aaae', '1464146072230-91cfaa3907cb', '1512154445585-e146757b3f94', '1504233529578-6d46baba6d34',
  '1486406146926-c627a92ad1ab', '1475855581690-80cbc14f86fa', '1513584684374-8bab11786290', '1505691938895-171fc3dee5f7',
  '1480074568708-e7b220eb05eb', '1512918580421-6ac301c2eeb6', '1502005097973-6a708ea969a5', '1497362943212-0fdbd5e236b9',
  '1524813686514-a57563d7728d', '1499916078039-922301b0eb9b', '1520699049698-acd2fceb8bf0', '1522771739844-6a9f6d5f14af',
  '1515263487900-51a704a506cb', '1493809842364-78817add7ffb'
];

async function main() {
  console.log('Updating property images to be fully dynamic and distinct...');

  // Get all properties that we recently seeded
  const properties = await prisma.property.findMany({
    where: {
      OR: [
        { title: { contains: 'Luxury Stay in Gurgaon' } },
        { title: { contains: 'Premium Apartment in New Delhi' } },
        { title: { contains: 'Beachfront Villa in North Goa' } }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  console.log(`Found ${properties.length} properties to update.`);

  let i = 0;
  for (const property of properties) {
    const photoId = photoIds[i % photoIds.length];
    const imageUrl = `https://images.unsplash.com/photo-${photoId}?w=800&q=80`;

    await prisma.property.update({
      where: { id: property.id },
      data: {
        featuredImage: imageUrl
      }
    });

    i++;
  }

  console.log('Successfully updated images!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
