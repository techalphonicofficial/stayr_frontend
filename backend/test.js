import prisma from './config/prisma.js';

async function test() {
  try {
    const reviews = await prisma.review.findMany({ take: 1 });
    if (reviews.length === 0) {
      console.log("No reviews found");
      return;
    }
    const reviewId = reviews[0].id;
    console.log("Updating review:", reviewId);
    
    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        images: ["https://example.com/test.jpg"]
      }
    });
    console.log("Success:", updated);
  } catch (err) {
    console.error("Error updating review:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
