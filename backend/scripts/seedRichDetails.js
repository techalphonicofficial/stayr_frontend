import prisma from '../config/prisma.js';

async function main() {
  console.log('Fetching properties...');

  const properties = await prisma.property.findMany();
  
  console.log(`Found ${properties.length} properties to update with rich details.`);

  const dummyAmenities = [
    { name: 'Air conditioning', icon: 'wind' },
    { name: 'TV', icon: 'tv' },
    { name: 'Wifi', icon: 'wifi' },
    { name: 'Kitchen', icon: 'coffee' },
    { name: 'Washing machine', icon: 'wind' }
  ];

  let updateCount = 0;

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
        roomsAndBeds: property.roomsAndBeds || {
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
        aboutProperty: property.aboutProperty || {
          title: property.title,
          description: `Welcome to our luxurious property in ${property.city}! With ${property.bedrooms} spacious rooms, this property offers everything you need for a comfortable stay. Enjoy modern amenities, a fully equipped kitchen, and a beautiful living space designed for relaxation. Whether you're here for a family vacation or a weekend getaway, you will find it hard to leave.`
        },
        nearbyPlaces: property.nearbyPlaces || [
          { name: "City Center", distance: "14 min walk" },
          { name: "Local Market", distance: "2 min drive" },
          { name: "Main Station", distance: "30 min drive" }
        ],
        houseRules: property.houseRules || [
          "Check-in after 2:00 PM",
          "Check-out before 11:00 AM",
          "No smoking",
          "No parties or events"
        ],
        damagePolicy: property.damagePolicy || "You will be responsible for any damage to the rental property caused by you or your party during your stay.",
        cancellationPolicy: property.cancellationPolicy || {
          type: "Strict",
          description: "Cancel before 7 days of check-in for a partial refund. After that, no refund is provided."
        },
        importantInformation: property.importantInformation || [
          "Extra charges may apply depending on the number of guests.",
          "Government-issued photo identification and a credit card may be required at check-in for incidental charges."
        ]
      }
    });

    // 3. Add a couple of reviews if none exist
    const reviewCount = await prisma.review.count({
      where: { propertyId: property.id }
    });

    if (reviewCount === 0) {
      // Find a guest user
      let guest = await prisma.user.findFirst({ where: { role: 'Guest' } });
      if (!guest) {
        guest = await prisma.user.findFirst();
      }

      // Need a dummy booking to attach review
      let dummyBooking = await prisma.booking.findFirst({ where: { propertyId: property.id }});
      if (!dummyBooking) {
        dummyBooking = await prisma.booking.create({
          data: {
            propertyId: property.id,
            guestId: guest.id,
            hostId: property.hostId,
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 86400000 * 3),
            nights: 3,
            guestsCount: 2,
            pricePerNight: property.pricePerNight,
            cleaningFee: 0,
            serviceFee: 0,
            subtotal: property.pricePerNight * 3,
            taxes: 0,
            totalPrice: property.pricePerNight * 3,
            status: 'Completed'
          }
        });
      }

      await prisma.review.createMany({
        data: [
          {
            propertyId: property.id,
            guestId: guest.id,
            bookingId: dummyBooking.id,
            rating: 4.8,
            comment: "Had a fantastic time. The interior decor is beautiful and it feels like home."
          }
        ]
      });

      // Update property stats
      await prisma.property.update({
        where: { id: property.id },
        data: {
          averageRating: 4.8,
          totalReviews: 1
        }
      });
    }

    updateCount++;
  }

  console.log(`Successfully updated ${updateCount} properties with rich details!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
