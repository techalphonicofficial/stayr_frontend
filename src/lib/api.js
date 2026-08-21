const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  // Create a clean options object
  const fetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // If we are in the browser, send credentials (cookies).
  // In Next.js server components, this might need manual cookie forwarding depending on the setup.
  if (typeof window !== 'undefined') {
    fetchOptions.credentials = 'include';
  }

  // Allow cache control overrides
  if (options.cache) fetchOptions.cache = options.cache;
  if (options.next) fetchOptions.next = options.next;

  const response = await fetch(url, fetchOptions);

  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return null; // Empty response (e.g. 204 No Content)
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || `API Error: ${response.status}`);
  }
  return data;
}

// ----------------------------------------------------------------------------
// PROPERTIES API
// ----------------------------------------------------------------------------
export const propertyApi = {
  getProperties: async (queryParams = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/api/properties${queryString ? `?${queryString}` : ''}`;
    // Properties fetch usually happens on the server or client. 
    return fetchAPI(endpoint, { next: { revalidate: 60 } });
  },
  getPropertyById: async (id) => {
    return fetchAPI(`/api/properties/${id}`, { next: { revalidate: 60 } });
  },
  getPropertyBySlug: async (slug) => {
    return fetchAPI(`/api/properties/slug/${slug}`, { next: { revalidate: 60 } });
  },
};

// ----------------------------------------------------------------------------
// BOOKING API
// ----------------------------------------------------------------------------
export const bookingApi = {
  createBooking: async (propertyId, checkIn, checkOut, guestsCount, options = {}) => {
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
        specialRequests: options.specialRequests || '',
        bookingNotes: options.bookingNotes || 'Generated via STAYR Frontend'
      })
    });
  },
  checkAvailability: async (propertyId, checkIn, checkOut) => {
    return fetchAPI(`/api/properties/${propertyId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`);
  },
  getMyBookings: async () => {
    return fetchAPI('/api/bookings/me');
  }
};

// ----------------------------------------------------------------------------
// PAYMENT API
// ----------------------------------------------------------------------------
export const paymentApi = {
  createRazorpayOrder: async (bookingId) => {
    return fetchAPI('/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ bookingId })
    });
  },
  verifyPayment: async (bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
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
};

// ----------------------------------------------------------------------------
// AUTH API
// ----------------------------------------------------------------------------
export const authApi = {
  getProfile: async () => {
    return fetchAPI('/api/auth/me');
  },
  login: async (email, password) => {
    return fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  register: async (name, email, password, phone) => {
    return fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone })
    });
  },
  logout: async () => {
    return fetchAPI('/api/auth/logout', { method: 'POST' });
  },
  becomeHost: async () => {
    return fetchAPI('/api/auth/become-host', { method: 'PUT' });
  }
};

// ----------------------------------------------------------------------------
// REVIEWS API
// ----------------------------------------------------------------------------
export const reviewApi = {
  getPropertyReviews: async (propertyId) => {
    return fetchAPI(`/api/reviews/property/${propertyId}`);
  },
  createReview: async (bookingId, propertyId, rating, comment) => {
    return fetchAPI('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ bookingId, propertyId, rating, comment })
    });
  }
};

// ----------------------------------------------------------------------------
// USER/NOTIFICATIONS API
// ----------------------------------------------------------------------------
export const notificationApi = {
  getNotifications: async () => {
    return fetchAPI('/api/notifications');
  },
  markAsRead: async (id) => {
    return fetchAPI(`/api/notifications/${id}/read`, { method: 'PATCH' });
  }
};

// Legacy exports for existing code (will be refactored eventually)
export const createBooking = bookingApi.createBooking;
export const createRazorpayOrder = paymentApi.createRazorpayOrder;
export const verifyPayment = paymentApi.verifyPayment;

// ----------------------------------------------------------------------------
// SETTINGS API
// ----------------------------------------------------------------------------
export const settingsApi = {
  getTaxes: async () => {
    return fetchAPI('/api/public/settings/taxes');
  }
};

// ----------------------------------------------------------------------------
// WISHLIST API
// ----------------------------------------------------------------------------
export const wishlistApi = {
  getWishlist: async () => {
    return fetchAPI('/api/wishlist');
  },
  toggleWishlist: async (propertyId) => {
    return fetchAPI('/api/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ propertyId })
    });
  }
};
