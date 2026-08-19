const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class AdminAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AdminAuthError';
  }
}

export async function fetchAdminAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Get token from localStorage if it exists (assuming we store it there upon login)
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('adminToken');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: 'omit', // We use Bearer token from localStorage for Admin
    });
  } catch (error) {
    // This catches network errors (e.g. server down, CORS preflight failed)
    console.error("Network or CORS error:", error);
    throw new Error('Unable to connect to the backend server.');
  }

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text(); // fallback for empty or non-json
  }

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      }
      throw new AdminAuthError('Your admin session has expired. Please log in again.');
    }
    
    if (response.status === 403) {
      throw new Error('You do not have permission to perform this action.');
    }

    if (response.status === 500) {
      throw new Error('Server error processing your request.');
    }
    
    if (response.status === 404) {
      throw new Error('Requested resource or endpoint not found.');
    }

    // Default to the backend's provided message for 400, 422, etc.
    const errorMsg = data?.message || data?.error || `Admin API Error: ${response.status}`;
    const err = new Error(errorMsg);
    err.errors = data?.errors || [];
    throw err;
  }

  return data;
}

export const adminApi = {
  // Auth
  login: (email, password) => 
    fetchAdminAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
    
  // Dashboard
  getDashboardStats: () => fetchAdminAPI('/api/admin/dashboard'),
  
  // Users
  getUsers: (query = '') => fetchAdminAPI(`/api/admin/users${query}`),
  updateUserStatus: (id, status) => fetchAdminAPI(`/api/admin/users/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  
  // Properties
  getProperties: (query = '') => fetchAdminAPI(`/api/admin/properties${query}`),
  getPropertyById: (id) => fetchAdminAPI(`/api/properties/${id}`),
  createProperty: (data) => fetchAdminAPI(`/api/properties`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateProperty: (id, data) => fetchAdminAPI(`/api/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteProperty: (id) => fetchAdminAPI(`/api/properties/${id}`, { method: 'DELETE' }),
  
  // Property Images
  uploadPropertyImages: (id, files) => {
    const formData = new FormData();
    // Support multiple files
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });
    
    const url = `${API_URL}/api/properties/${id}/images`;
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('adminToken');
    }
    
    return fetch(url, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    }).then(async res => {
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = { message: await res.text() };
      }
      if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);
      return data;
    });
  },
  deletePropertyImage: (propertyId, imageId) => fetchAdminAPI(`/api/properties/${propertyId}/images/${imageId}`, { method: 'DELETE' }),
  setFeaturedImage: (propertyId, imageId) => fetchAdminAPI(`/api/properties/${propertyId}/featured-image`, { method: 'PUT', body: JSON.stringify({ imageId }) }),
  approveProperty: (id) => fetchAdminAPI(`/api/admin/properties/${id}/approve`, {
    method: 'PUT'
  }),
  rejectProperty: (id, rejectionReason) => fetchAdminAPI(`/api/admin/properties/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ rejectionReason })
  }),
  
  // Bookings
  getBookings: (query = '') => fetchAdminAPI(`/api/admin/bookings${query}`),
  updateBookingStatus: (id, status) => fetchAdminAPI(`/api/admin/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  
  // Payments
  getPayments: (query = '') => fetchAdminAPI(`/api/admin/payments${query}`),
  refundPayment: (id) => fetchAdminAPI(`/api/admin/payments/${id}/refund`, {
    method: 'POST'
  }),
  
  // Reviews
  getReviews: (query = '') => fetchAdminAPI(`/api/admin/reviews${query}`),
  createReview: (data) => fetchAdminAPI('/api/admin/reviews', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateReview: (id, data) => fetchAdminAPI(`/api/admin/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteReview: (id) => fetchAdminAPI(`/api/admin/reviews/${id}`, {
    method: 'DELETE'
  }),
  uploadReviewImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const url = `${API_URL}/api/admin/reviews/upload`;
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('adminToken');
    }
    
    return fetch(url, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    }).then(async res => {
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = { message: await res.text() };
      }
      if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);
      return data;
    });
  },
  
  // Notifications
  getNotifications: (query = '') => fetchAdminAPI(`/api/admin/notifications${query}`),
  broadcastNotification: (payload) => fetchAdminAPI('/api/admin/notifications/broadcast', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  
  // Analytics
  getAnalyticsRevenue: () => fetchAdminAPI('/api/admin/analytics/revenue'),
  getAnalyticsBookings: () => fetchAdminAPI('/api/admin/analytics/bookings'),
  getAnalyticsProperties: () => fetchAdminAPI('/api/admin/analytics/properties'),
  getAnalyticsUsers: () => fetchAdminAPI('/api/admin/analytics/users'),
  
  // CMS Pages
  getPages: (query = '') => fetchAdminAPI(`/api/admin/pages${query}`),
  getPageById: (id) => fetchAdminAPI(`/api/admin/pages/${id}`),
  createPage: (data) => fetchAdminAPI('/api/admin/pages', { method: 'POST', body: JSON.stringify(data) }),
  updatePage: (id, data) => fetchAdminAPI(`/api/admin/pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updatePageStatus: (id, status) => fetchAdminAPI(`/api/admin/pages/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deletePage: (id) => fetchAdminAPI(`/api/admin/pages/${id}`, { method: 'DELETE' }),
  
  // New CMS Page methods
  duplicatePage: async (id) => {
    const page = await fetchAdminAPI(`/api/admin/pages/${id}`);
    const data = page.data;
    return fetchAdminAPI('/api/admin/pages', { 
      method: 'POST', 
      body: JSON.stringify({ ...data, title: data.title + ' (Copy)', slug: data.slug + '-copy', status: 'Draft', isPublished: false }) 
    });
  },
  publishPage: (id) => fetchAdminAPI(`/api/admin/pages/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Published' }) }),
  unpublishPage: (id) => fetchAdminAPI(`/api/admin/pages/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'Draft' }) }),
  uploadPageImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const url = `${API_URL}/api/admin/pages/upload`; // Assumed endpoint
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('adminToken');
    }
    return fetch(url, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    }).then(async res => {
      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = { message: await res.text() };
      }
      
      if (!res.ok) {
        const errorMsg = data?.message || data?.error || `Admin API Error: ${res.status}`;
        console.error(`[Upload Error]\nStatus Code: ${res.status}\nRequest URL: ${url}\nBackend response:`, data, '\nStack trace:', data?.stack || 'No stack trace provided');
        const err = new Error(errorMsg);
        err.errors = data?.errors || [];
        throw err;
      }
      return data;
    });
  },
  // Footer Settings
  getFooterSettings: () => fetchAdminAPI('/api/admin/footer'),
  updateFooterSettings: (data) => fetchAdminAPI('/api/admin/footer', { method: 'PUT', body: JSON.stringify(data) }),
  uploadFooterLogo: (file, type) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    
    // We need to bypass the default JSON Content-Type for FormData
    const url = `${API_URL}/api/admin/footer/logo`;
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('adminToken');
    }
    return fetch(url, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    }).then(async res => {
      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = { message: await res.text() };
      }
      
      if (!res.ok) {
        const errorMsg = data?.message || data?.error || `Admin API Error: ${res.status}`;
        console.error(`[Upload Error]\nStatus Code: ${res.status}\nRequest URL: ${url}\nBackend response:`, data, '\nStack trace:', data?.stack || 'No stack trace provided');
        const err = new Error(errorMsg);
        err.errors = data?.errors || [];
        throw err;
      }
      return data;
    });
  },
  
  createFooterColumn: (data) => fetchAdminAPI('/api/admin/footer/columns', { method: 'POST', body: JSON.stringify(data) }),
  updateFooterColumn: (id, data) => fetchAdminAPI(`/api/admin/footer/columns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFooterColumn: (id) => fetchAdminAPI(`/api/admin/footer/columns/${id}`, { method: 'DELETE' }),
  
  createFooterLink: (data) => fetchAdminAPI('/api/admin/footer/links', { method: 'POST', body: JSON.stringify(data) }),
  updateFooterLink: (id, data) => fetchAdminAPI(`/api/admin/footer/links/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFooterLink: (id) => fetchAdminAPI(`/api/admin/footer/links/${id}`, { method: 'DELETE' }),
  
  reorderFooterItems: (type, items) => fetchAdminAPI('/api/admin/footer/reorder', { method: 'PATCH', body: JSON.stringify({ type, items }) }),

  // CRM Settings
  getCrmSettings: () => fetchAdminAPI('/api/admin/crm/settings'),
  updateCrmSettings: (data) => fetchAdminAPI('/api/admin/crm/settings', { method: 'PUT', body: JSON.stringify(data) }),
  
  getTaxes: () => fetchAdminAPI('/api/admin/crm/settings/taxes'),
  createTax: (data) => fetchAdminAPI('/api/admin/crm/settings/taxes', { method: 'POST', body: JSON.stringify(data) }),
  deleteTax: (id) => fetchAdminAPI(`/api/admin/crm/settings/taxes/${id}`, { method: 'DELETE' }),

  getCancellationRules: () => fetchAdminAPI('/api/admin/crm/settings/cancellation'),
  createCancellationRule: (data) => fetchAdminAPI('/api/admin/crm/settings/cancellation', { method: 'POST', body: JSON.stringify(data) }),
  deleteCancellationRule: (id) => fetchAdminAPI(`/api/admin/crm/settings/cancellation/${id}`, { method: 'DELETE' }),

  getApiKeys: () => fetchAdminAPI('/api/admin/crm/settings/apikeys'),
  createApiKey: (data) => fetchAdminAPI('/api/admin/crm/settings/apikeys', { method: 'POST', body: JSON.stringify(data) }),
  deleteApiKey: (id) => fetchAdminAPI(`/api/admin/crm/settings/apikeys/${id}`, { method: 'DELETE' }),

  getTheme: () => fetchAdminAPI('/api/admin/crm/settings/theme'),
  updateTheme: (data) => fetchAdminAPI('/api/admin/crm/settings/theme', { method: 'PUT', body: JSON.stringify(data) }),
  getThemes: () => fetchAdminAPI('/api/admin/crm/settings/themes'),
  createTheme: (data) => fetchAdminAPI('/api/admin/crm/settings/themes', { method: 'POST', body: JSON.stringify(data) }),
  activateTheme: (id) => fetchAdminAPI(`/api/admin/crm/settings/themes/${id}/activate`, { method: 'PUT' }),
  deleteTheme: (id) => fetchAdminAPI(`/api/admin/crm/settings/themes/${id}`, { method: 'DELETE' }),

  getCategoryMappings: () => fetchAdminAPI('/api/admin/crm/settings/category-mapping'),
  createCategoryMapping: (data) => fetchAdminAPI('/api/admin/crm/settings/category-mapping', { method: 'POST', body: JSON.stringify(data) }),
  deleteCategoryMapping: (id) => fetchAdminAPI(`/api/admin/crm/settings/category-mapping/${id}`, { method: 'DELETE' }),

  // Access Control - Roles
  getRoles: () => fetchAdminAPI('/api/admin/access-control/roles'),
  createRole: (data) => fetchAdminAPI('/api/admin/access-control/roles', { method: 'POST', body: JSON.stringify(data) }),
  updateRole: (id, data) => fetchAdminAPI(`/api/admin/access-control/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRole: (id) => fetchAdminAPI(`/api/admin/access-control/roles/${id}`, { method: 'DELETE' }),

  // Access Control - Modules
  getModules: () => fetchAdminAPI('/api/admin/access-control/modules'),
  createModule: (data) => fetchAdminAPI('/api/admin/access-control/modules', { method: 'POST', body: JSON.stringify(data) }),
  updateModule: (id, data) => fetchAdminAPI(`/api/admin/access-control/modules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteModule: (id) => fetchAdminAPI(`/api/admin/access-control/modules/${id}`, { method: 'DELETE' }),

  // Access Control - Permissions
  getPermissions: () => fetchAdminAPI('/api/admin/access-control/permissions'),
  createPermission: (data) => fetchAdminAPI('/api/admin/access-control/permissions', { method: 'POST', body: JSON.stringify(data) }),
  updatePermission: (id, data) => fetchAdminAPI(`/api/admin/access-control/permissions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePermission: (id) => fetchAdminAPI(`/api/admin/access-control/permissions/${id}`, { method: 'DELETE' }),

  // Access Control - Vendor Requests
  getVendorRequests: (query = '') => fetchAdminAPI(`/api/admin/access-control/vendor-requests${query}`),
  approveVendorRequest: (id) => fetchAdminAPI(`/api/admin/access-control/vendor-requests/${id}/approve`, { method: 'PUT' }),
  rejectVendorRequest: (id) => fetchAdminAPI(`/api/admin/access-control/vendor-requests/${id}/reject`, { method: 'PUT' }),

  // Access Control - Users
  createUser: (data) => fetchAdminAPI('/api/admin/access-control/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUserRole: (id, data) => fetchAdminAPI(`/api/admin/access-control/users/${id}/role`, { method: 'PUT', body: JSON.stringify(data) }),
  
  // Blogs - Categories
  getBlogCategories: () => fetchAdminAPI('/api/admin/blogs/categories'),
  createBlogCategory: (data) => fetchAdminAPI('/api/admin/blogs/categories', { method: 'POST', body: JSON.stringify(data) }),
  deleteBlogCategory: (id) => fetchAdminAPI(`/api/admin/blogs/categories/${id}`, { method: 'DELETE' }),

  // Blogs - Posts
  getBlogPosts: () => fetchAdminAPI('/api/admin/blogs/posts'),
  getBlogPost: (id) => fetchAdminAPI(`/api/admin/blogs/posts/${id}`),
  createBlogPost: (data) => fetchAdminAPI('/api/admin/blogs/posts', { method: 'POST', body: JSON.stringify(data) }),
  updateBlogPost: (id, data) => fetchAdminAPI(`/api/admin/blogs/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBlogPost: (id) => fetchAdminAPI(`/api/admin/blogs/posts/${id}`, { method: 'DELETE' }),

  // Blogs - Image Upload
  uploadBlogImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('adminToken');
    }
    
    return fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/blogs/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    }).then(async res => {
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = { message: await res.text() };
      }
      if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);
      return data;
    });
  },
};
