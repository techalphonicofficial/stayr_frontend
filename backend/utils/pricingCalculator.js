/**
 * Utility to calculate booking prices
 * @param {Object} property - Property object (must contain pricePerNight, cleaningFee, serviceFee)
 * @param {String|Date} checkIn - Check-in date
 * @param {String|Date} checkOut - Check-out date
 * @param {Number} taxPercentage - Tax percentage to apply (default 10%)
 * @returns {Object} - { nights, subtotal, tax, grandTotal }
 */
export const calculateBookingPrice = (property, checkIn, checkOut, taxPercentage = 10) => {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  // Calculate difference in time
  const diffTime = Math.abs(outDate - inDate);
  // Calculate difference in days (nights)
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (nights <= 0) {
    throw new Error('Check-out date must be after check-in date');
  }

  const roomSubtotal = property.pricePerNight * nights;
  const subtotal = roomSubtotal + (property.cleaningFee || 0) + (property.serviceFee || 0);
  const tax = (subtotal * taxPercentage) / 100;
  const grandTotal = subtotal + tax;

  return {
    nights,
    subtotal,
    tax,
    grandTotal,
  };
};
