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
  } catch {
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
  vectorSearch: async (queryParams = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    return fetchAPI(`/api/properties/search/vector${queryString ? `?${queryString}` : ''}`, { cache: 'no-store' });
  },
  getLiveSuggestions: async (query = '', limit = 5) => {
    if (!query || query.trim() === '') return { suggestions: [], properties: [] };
    return fetchAPI(`/api/properties/search/live?q=${encodeURIComponent(query)}&limit=${limit}`, { cache: 'no-store' });
  },
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
  // Host Property APIs
  getMyProperties: async (queryParams = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    return fetchAPI(`/api/properties/host/my-properties${queryString ? `?${queryString}` : ''}`, { cache: 'no-store' });
  },
  getManageProperty: async (id) => {
    return fetchAPI(`/api/properties/manage/${id}`, { cache: 'no-store' });
  },
  createDraftProperty: async (data = {}) => {
    return fetchAPI('/api/properties/draft', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateDraftProperty: async (id, data) => {
    return fetchAPI(`/api/properties/${id}/draft`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  submitForReview: async (id) => {
    return fetchAPI(`/api/properties/${id}/submit-for-review`, {
      method: 'POST'
    });
  },
  toggleListingStatus: async (id, action) => {
    return fetchAPI(`/api/properties/${id}/toggle-status`, {
      method: 'PUT',
      body: JSON.stringify({ action })
    });
  },
  uploadPropertyImages: async (propertyId, formData) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${API_URL}/api/properties/${propertyId}/images`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Failed to upload images');
    }
    return data;
  },
  deletePropertyImage: async (propertyId, imageId) => {
    return fetchAPI(`/api/properties/${propertyId}/images/${imageId}`, {
      method: 'DELETE'
    });
  },
  setFeaturedImage: async (propertyId, imageId) => {
    return fetchAPI(`/api/properties/${propertyId}/featured-image`, {
      method: 'PUT',
      body: JSON.stringify({ imageId })
    });
  },
  reorderPropertyImages: async (propertyId, imageIds) => {
    return fetchAPI(`/api/properties/${propertyId}/images/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ imageIds })
    });
  }
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

// ----------------------------------------------------------------------------
// REAL ESTATE BUY & SELL PROPERTIES API
// ----------------------------------------------------------------------------
export const salePropertyApi = {
  getSaleListings: async (queryParams = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    const endpoint = `/api/sale-listings${queryString ? `?${queryString}` : ''}`;
    return fetchAPI(endpoint, { cache: 'no-store' });
  },
  getSaleListingBySlug: async (slug) => {
    return fetchAPI(`/api/sale-listings/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  },
  getMySaleListings: async (queryParams = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    return fetchAPI(`/api/sale-listings/seller/my-listings${queryString ? `?${queryString}` : ''}`, { cache: 'no-store' });
  },
  getManageSaleListing: async (id) => {
    return fetchAPI(`/api/sale-listings/manage/${id}`, { cache: 'no-store' });
  },
  createDraft: async (data = {}) => {
    return fetchAPI('/api/sale-listings/draft', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateDraft: async (id, data) => {
    return fetchAPI(`/api/sale-listings/${id}/draft`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  submitForReview: async (id, data = { confirmAccuracy: true }) => {
    return fetchAPI(`/api/sale-listings/${id}/submit-for-review`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  toggleStatus: async (id, action) => {
    return fetchAPI(`/api/sale-listings/${id}/toggle-status`, {
      method: 'PUT',
      body: JSON.stringify({ action })
    });
  },
  deleteSaleListing: async (id) => {
    return fetchAPI(`/api/sale-listings/${id}`, {
      method: 'DELETE'
    });
  },
  uploadImages: async (saleListingId, formData) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${API_URL}/api/sale-listings/${saleListingId}/images`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Failed to upload images');
    }
    return data;
  },
  deleteImage: async (saleListingId, imageId) => {
    return fetchAPI(`/api/sale-listings/${saleListingId}/images/${imageId}`, {
      method: 'DELETE'
    });
  },
  reorderImages: async (saleListingId, imageIds) => {
    return fetchAPI(`/api/sale-listings/${saleListingId}/images/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ imageIds })
    });
  },
  toggleSave: async (saleListingId) => {
    return fetchAPI('/api/sale-listings/saved/toggle', {
      method: 'POST',
      body: JSON.stringify({ saleListingId })
    });
  },
  getSavedListings: async () => {
    return fetchAPI('/api/sale-listings/saved', { cache: 'no-store' });
  }
};

// ----------------------------------------------------------------------------
// SALE INQUIRIES & REPORTS API
// ----------------------------------------------------------------------------
export const saleInquiryApi = {
  createInquiry: async (data) => {
    return fetchAPI('/api/sale-inquiries', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  getMySentInquiries: async () => {
    return fetchAPI('/api/sale-inquiries/my-inquiries', { cache: 'no-store' });
  },
  getSellerInquiries: async (queryParams = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    return fetchAPI(`/api/sale-inquiries/seller-inquiries${queryString ? `?${queryString}` : ''}`, { cache: 'no-store' });
  },
  updateInquiryStatus: async (id, status, notes) => {
    return fetchAPI(`/api/sale-inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    });
  },
  reportListing: async (listingId, data) => {
    return fetchAPI(`/api/sale-inquiries/${listingId}/report`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
