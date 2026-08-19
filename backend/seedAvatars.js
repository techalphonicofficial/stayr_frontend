import prisma from './config/prisma.js';

const avatars = [
  '/images/avatars/avatar1.jpg',
  '/images/avatars/avatar2.jpg',
  '/images/avatars/avatar3.jpg'
];

async function seedAvatars() {
  try {
    // get all guest users
    const guests = await prisma.user.findMany({
      where: { role: 'Guest' }
    });
    
    console.log(`Found ${guests.length} guests.`);
    
    for (let i = 0; i < guests.length; i++) {
      const avatarUrl = avatars[i % avatars.length];
      await prisma.user.update({
        where: { id: guests[i].id },
        data: { profileImage: avatarUrl }
      });
      console.log(`Updated guest ${guests[i].name} with avatar ${avatarUrl}`);
    }
    
    console.log("Avatar seeding completed successfully.");
  } catch (err) {
    console.error("Error seeding avatars:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedAvatars();
