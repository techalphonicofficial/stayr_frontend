import prisma from '../config/prisma.js';

async function main() {
  console.log('Updating property details with custom info...');

  const properties = await prisma.property.findMany({
    where: {
      OR: [
        { title: { contains: 'Luxury Stay in Gurgaon' } },
        { title: { contains: 'Premium Apartment in New Delhi' } },
        { title: { contains: 'Beachfront Villa in North Goa' } }
      ]
    }
  });

  console.log(`Found ${properties.length} properties to update.`);

  const dummyAmenities = [
    { name: 'Air conditioning', icon: 'wind' },
    { name: 'TV', icon: 'tv' },
    { name: 'Wifi', icon: 'wifi' },
    { name: 'Kitchen', icon: 'coffee' },
    { name: 'Washing machine', icon: 'wind' }
  ];

  for (const property of properties) {
    // 1. Add Amenities if not present
    const existingAmenitiesCount = await prisma.amenity.count({
      where: { propertyId: property.id }
    });

    if (existingAmenitiesCount === 0) {
      for (const am of dummyAmenities) {
        await prisma.amenity.create({
          data: {
            name: am.name,
            icon: am.icon,
            available: true,
            propertyId: property.id
          }
        });
      }
    }

    // 2. Update JSON fields
    await prisma.property.update({
      where: { id: property.id },
      data: {
        roomsAndBeds: {
          bedrooms: [
            { name: "Bedroom 1", beds: [{ type: "King Bed", count: 1 }] },
            { name: "Bedroom 2", beds: [{ type: "Queen Bed", count: 1 }] },
            { name: "Bedroom 3", beds: [{ type: "Queen Bed", count: 1 }] }
          ],
          bathrooms: [
            { name: "Bathroom 1", amenities: ["Towels provided", "Bathtub or shower", "Toilet"] },
            { name: "Bathroom 2", amenities: ["Towels provided", "Bathtub or shower", "Toilet"] }
          ],
          spaces: [
            { name: "Kitchen", icon: "kitchen" },
            { name: "Dining area", icon: "dining" },
            { name: "Living room", icon: "living" },
            { name: "Balcony", icon: "balcony" }
          ]
        },
        aboutProperty: {
          title: property.title,
          description: `Welcome to our luxurious property in ${property.city}! With 3 spacious rooms, this property offers everything you need for a comfortable stay. Enjoy modern amenities, a fully equipped kitchen, and a beautiful living space designed for relaxation. Whether you're here for a family vacation or a weekend getaway, you will find it hard to leave.`
        },
        nearbyPlaces: [
          { name: "City Center", distance: "14 min walk" },
          { name: "Local Market", distance: "3 min drive" },
          { name: "Main Station", distance: "30 min drive" }
        ],
        houseRules: [
          "Check-in after 2:00 PM",
          "Check-out before 11:00 AM",
          "No smoking",
          "No parties or events"
        ],
        damagePolicy: "You will be responsible for any damage to the rental property caused by you or your party during your stay.",
        cancellationPolicy: {
          type: "Strict",
          description: "Cancel before 7 days of check-in for a partial refund. After that, no refund is provided."
        },
        importantInformation: [
          "Property ID: " + property.id.substring(0, 8),
          "Extra charges may apply depending on the number of guests.",
          "Government-issued photo identification and a credit card may be required at check-in for incidental charges."
        ]
      }
    });

    console.log(`Updated details for: ${property.title}`);
  }

  console.log('Update complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
