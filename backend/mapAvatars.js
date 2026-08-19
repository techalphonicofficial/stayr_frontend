import prisma from './config/prisma.js';

const avatarMap = {
  'Amit K.': '/images/avatars/avatar1.jpg',      // Male
  'Guest User': '/images/avatars/avatar3.jpg',   // Male (older)
  'raj': '/images/avatars/avatar1.jpg',          // Male
  'Rahul S.': '/images/avatars/avatar1.jpg',     // Male
  'Suresh D.': '/images/avatars/avatar3.jpg',    // Male (older)
  'Neha P.': '/images/avatars/avatar2.jpg',      // Female
  'Priya M.': '/images/avatars/avatar2.jpg'      // Female
};

async function updateGuestAvatars() {
  try {
    const guests = await prisma.user.findMany({
      where: { role: 'Guest' }
    });
    
    console.log(`Found ${guests.length} guests.`);
    
    for (const guest of guests) {
      const avatarUrl = avatarMap[guest.name];
      if (avatarUrl) {
        await prisma.user.update({
          where: { id: guest.id },
          data: { profileImage: avatarUrl }
        });
        console.log(`Updated guest ${guest.name} with avatar ${avatarUrl}`);
      } else {
        // Fallback for any unknown names
        await prisma.user.update({
          where: { id: guest.id },
          data: { profileImage: '/images/avatars/avatar1.jpg' }
        });
        console.log(`Updated guest ${guest.name} with default avatar /images/avatars/avatar1.jpg`);
      }
    }
    
    console.log("Avatars matched to names successfully.");
  } catch (err) {
    console.error("Error updating avatars:", err);
  } finally {
    await prisma.$disconnect();
  }
}

updateGuestAvatars();
