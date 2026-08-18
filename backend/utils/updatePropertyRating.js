import prisma from '../config/prisma.js';

/**
 * Utility to calculate and update a property's average rating and total reviews
 * @param {String} propertyId - The ID of the property
 */
export const updatePropertyRating = async (propertyId) => {
  try {
    const aggregate = await prisma.review.aggregate({
      where: { propertyId },
      _count: { id: true },
      _avg: { rating: true },
    });

    const totalReviews = aggregate._count.id;
    let averageRating = aggregate._avg.rating || 0;
    
    if (totalReviews > 0) {
      // Round to 1 decimal place
      averageRating = Math.round(averageRating * 10) / 10;
    }

    await prisma.property.update({
      where: { id: propertyId },
      data: {
        averageRating,
        totalReviews,
      },
    });
  } catch (error) {
    console.error(`Error updating property rating for ${propertyId}:`, error);
  }
};
