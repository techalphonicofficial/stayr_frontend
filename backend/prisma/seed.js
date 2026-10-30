import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';


async function main() {
  console.log('Starting seed...');
  
  // Clear existing
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@stayr.com',
      password,
      role: 'Admin',
      phone: '1234567890',
      isActive: true,
      isVerified: true
    }
  });

  const host = await prisma.user.create({
    data: {
      name: 'Host User',
      email: 'host@stayr.com',
      password,
      role: 'Host',
      phone: '0987654321',
      isActive: true,
      isVerified: true
    }
  });

  const guest = await prisma.user.create({
    data: {
      name: 'Guest User',
      email: 'guest@stayr.com',
      password,
      role: 'Guest',
      phone: '5555555555',
      isActive: true,
      isVerified: true
    }
  });

  // Create Property
  const property = await prisma.property.create({
    data: {
      hostId: host.id,
      title: 'Beautiful Beachfront Villa',
      slug: 'beautiful-beachfront-villa-123',
      description: 'A beautiful villa right on the beach with amazing sunset views.',
      category: 'Villa',
      propertyType: 'Entire Home',
      status: 'Published',
      address: '123 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      postalCode: '33101',
      latitude: 25.7617,
      longitude: -80.1918,
      pricePerNight: 299,
      cleaningFee: 50,
      serviceFee: 20,
      maxGuests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      featuredImage: 'https://via.placeholder.com/800x600',
      amenities: {
        create: [
          { name: 'WiFi' },
          { name: 'Pool' },
          { name: 'Kitchen' }
        ]
      },
      images: {
        create: [
          { url: 'https://via.placeholder.com/800x600', publicId: 'dummy1' }
        ]
      }
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
