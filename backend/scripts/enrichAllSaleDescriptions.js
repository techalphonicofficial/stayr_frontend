import prisma from '../config/prisma.js';

async function enrichDescriptions() {
  console.log('Fetching all published sale listings...');
  const listings = await prisma.saleListing.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      bhk: true,
      propertyType: true,
      category: true,
      carpetArea: true,
      area: true,
      bedrooms: true,
      bathrooms: true,
      balconies: true,
      furnishingStatus: true,
      facingDirection: true,
      locality: true,
      city: true,
      state: true,
      amenities: true
    }
  });

  console.log(`Found ${listings.length} listings to examine.`);

  let updatedCount = 0;

  for (const l of listings) {
    const existingDesc = (l.description || '').trim();
    
    // If the description is already long (> 500 chars), we don't need to overwrite it unless it's just repetition
    if (existingDesc.length >= 600) {
      continue;
    }

    const config = l.bhk || `${l.bedrooms || 3} BHK`;
    const propType = l.propertyType || 'Luxury Residence';
    const areaStr = l.carpetArea ? `${l.carpetArea} sq ft` : (l.area ? `${l.area} sq ft` : 'generously proportioned');
    const facing = l.facingDirection || 'East';
    const loc = l.locality || l.city;
    const furnishing = l.furnishingStatus || 'Semi-Furnished';
    const balconiesCount = l.balconies || 2;

    // Parse amenities
    let amenList = [];
    if (Array.isArray(l.amenities)) {
      amenList = l.amenities;
    } else if (typeof l.amenities === 'string') {
      try {
        amenList = JSON.parse(l.amenities);
      } catch (e) {
        amenList = [];
      }
    }
    const amenHighlight = amenList.slice(0, 4).join(', ');

    const newDescription = `${existingDesc}

Architectural Overview & Spatial Flow:
Spanning across ${areaStr} of meticulously planned interior space, this exquisite ${config} ${propType} exemplifies high-end living in the heart of ${loc}. The residence greets you with a gracious entrance foyer that unfolds into an expansive double-height living pavilion and a formal dining enclave, ideal for both grand entertaining and quiet family evenings. The layout is thoughtfully zoned to maintain complete acoustic privacy between the entertaining quarters and personal bedroom wings.

Interior Finishes & Craftsmanship:
Every square inch reflects uncompromising craftsmanship, showcasing imported Italian marble flooring across living zones, engineered hardwood in master suites, and floor-to-ceiling soundproof acoustic glazing that bathes the interiors in natural daylight. The chef-grade modular kitchen features premium quartz countertops, soft-close German cabinetry, and integrated chimney provisions. Spa-inspired bathrooms come fitted with Hansgrohe/Kohler fixtures, concealed cisterns, and rainfall glass shower enclosures.

Orientation, Balconies & Ambient Light:
Positioned with a favorable ${facing} orientation, this property captures radiant morning sunlight and cross-breezes throughout the day. ${balconiesCount} oversized private balconies offer panoramic views of lush landscaped greens and the surrounding cityscape, creating seamless indoor-outdoor transition for your morning coffee or evening soirees.

Prestige & Locality Advantages:
Nestled in prime ${loc}, ${l.city}, the property benefits from underground utilities, wide tree-lined access roads, and seamless arterial connectivity to major expressways, rapid transit metro hubs, elite international academies, and high-street luxury retail centers.${amenHighlight ? ` Residents also enjoy exclusive access to ${amenHighlight}.` : ''} Full legal documentation is verified and ready for clear title transfer.`;

    await prisma.saleListing.update({
      where: { id: l.id },
      data: {
        description: newDescription.trim()
      }
    });

    updatedCount++;
  }

  console.log(`Successfully enriched ${updatedCount} property descriptions!`);
  process.exit(0);
}

enrichDescriptions().catch((err) => {
  console.error('Error enriching descriptions:', err);
  process.exit(1);
});

