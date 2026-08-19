import prisma from '../config/prisma.js';

const DUMMY_NAMES = [
  "Rahul S.", "Priya M.", "Amit K.", "Neha P.", "Suresh D.", 
  "Anjali T.", "Vikas R.", "Pooja N.", "Rajesh B.", "Sneha V.",
  "John D.", "Emma W.", "Michael C.", "Sarah L.", "David H."
];

const DUMMY_COMMENTS = [
  "Absolutely loved our stay here! The place was spotless and the host was very accommodating.",
  "Great location and wonderful amenities. Would definitely come back.",
  "The property exceeded our expectations. Very comfortable beds and great view.",
  "Nice place, decent value for money. A bit noisy at night but overall good.",
  "Had a fantastic time. The interior decor is beautiful and it feels like home.",
  "Check-in was seamless. The host provided excellent local recommendations.",
  "Very clean and well-maintained. The kitchen had everything we needed.",
  "Perfect getaway spot. Highly recommend for families or small groups.",
  "One of the best places I've stayed at. Everything was exactly as described.",
  "Cozy, comfortable, and conveniently located near all the main attractions.",
  "Good experience overall. The Wi-Fi was fast and reliable.",
  "Stunning property with a lot of character. We really enjoyed our weekend here."
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomRating() {
  // Generate a random rating between 4.0 and 5.0
  return (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
}

async function main() {
  console.log('Seeding reviews...');

  // 1. Fetch all properties
  const properties = await prisma.property.findMany();
  
  if (properties.length === 0) {
    console.log('No properties found. Please seed properties first.');
    return;
  }

  // 2. Fetch or Create Dummy Guest Users
  let guests = await prisma.user.findMany({
    where: { role: 'Guest' },
    take: 15
  });

  if (guests.length < 5) {
    console.log('Creating dummy guests...');
    for (const name of DUMMY_NAMES.slice(0, 5)) {
      const guest = await prisma.user.create({
        data: {
          name: name,
          email: `${name.replace(' ', '').toLowerCase()}_${Date.now()}@example.com`,
          password: 'hashed_password_placeholder', // doesn't matter for seeding
          role: 'Guest',
          isVerified: true
        }
      });
      guests.push(guest);
    }
  }

  // 3. Generate Reviews for each property
  for (const property of properties) {
    console.log(`Generating reviews for property: ${property.title}`);
    
    // Check if property already has reviews
    const existingReviewsCount = await prisma.review.count({
      where: { propertyId: property.id }
    });

    if (existingReviewsCount >= 10) {
      console.log(`Property already has ${existingReviewsCount} reviews. Skipping...`);
      continue;
    }

    const reviewsToCreate = 10 - existingReviewsCount;
    let totalRating = property.averageRating * property.totalReviews;

    for (let i = 0; i < reviewsToCreate; i++) {
      const guest = getRandomItem(guests);
      const rating = parseFloat(getRandomRating());
      const comment = getRandomItem(DUMMY_COMMENTS);
      
      // Generate a random date in the past year
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));

      // Create a dummy completed booking
      const booking = await prisma.booking.create({
        data: {
          propertyId: property.id,
          guestId: guest.id,
          hostId: property.hostId,
          checkIn: new Date(date.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days before
          checkOut: date,
          nights: 2,
          guestsCount: 2,
          pricePerNight: property.pricePerNight,
          cleaningFee: property.cleaningFee,
          serviceFee: property.serviceFee,
          subtotal: property.pricePerNight * 2,
          taxes: 0,
          totalPrice: property.pricePerNight * 2,
          status: 'Completed',
          paymentStatus: 'Paid',
          createdAt: new Date(date.getTime() - 5 * 24 * 60 * 60 * 1000)
        }
      });

      // Create the review
      await prisma.review.create({
        data: {
          propertyId: property.id,
          guestId: guest.id,
          bookingId: booking.id,
          rating: rating,
          comment: comment,
          createdAt: date,
          updatedAt: date
        }
      });

      totalRating += rating;
    }

    // Update Property average rating and total reviews natively
    const newTotalReviews = property.totalReviews + reviewsToCreate;
    const newAverageRating = newTotalReviews > 0 ? (totalRating / newTotalReviews) : 0;

    await prisma.property.update({
      where: { id: property.id },
      data: {
        totalReviews: newTotalReviews,
        averageRating: newAverageRating
      }
    });
  }

  console.log('Review seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
