const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL || ''}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important to send cookies if they exist
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || `API Error: ${response.status}`);
  }
  return data;
}

export async function createBooking(propertyId, checkIn, checkOut, guestsCount) {
  if (!propertyId || propertyId.toString().length < 10) {
    throw new Error("Invalid Property ID. Cannot proceed with booking.");
  }

  return fetchAPI('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      propertyId,
      checkIn,
      checkOut,
      guestsCount,
      specialRequests: '',
      bookingNotes: 'Generated via STAYR Frontend'
    })
  });
}

export async function createRazorpayOrder(bookingId) {
  return fetchAPI('/api/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ bookingId })
  });
}

export async function verifyPayment(bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature) {
  return fetchAPI('/api/payments/verify', {
    method: 'POST',
    body: JSON.stringify({
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    })
  });
}
