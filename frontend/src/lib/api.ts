import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      try {
        const token = window.localStorage.getItem('accessToken');
        if (token) {
          // Axios v1 may use AxiosHeaders; support both shapes
          const headers: any = config.headers || {};
          if (headers && typeof headers.set === 'function') {
            headers.set('Authorization', `Bearer ${token}`);
          } else {
            config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` } as any;
          }
        }
      } catch (_) {
        // noop: accessing localStorage may fail in some environments
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If running on server, don't attempt browser-side refresh
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = window.localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          try {
            window.localStorage.setItem('accessToken', data.accessToken);
            window.localStorage.setItem('refreshToken', data.refreshToken);
          } catch (_) {
            // Ignore storage write errors
          }

          // Ensure Authorization header is set on the retried request
          const headers: any = originalRequest.headers || {};
          if (headers && typeof headers.set === 'function') {
            headers.set('Authorization', `Bearer ${data.accessToken}`);
          } else {
            originalRequest.headers = { ...(originalRequest.headers || {}), Authorization: `Bearer ${data.accessToken}` } as any;
          }

          return api(originalRequest);
        }
      } catch (refreshError) {
        // فشل refresh - تسجيل خروج فقط إذا لم يكن هناك token
        console.error('Token refresh failed:', refreshError);
        try {
          window.localStorage.removeItem('accessToken');
          window.localStorage.removeItem('refreshToken');
          window.localStorage.removeItem('user');
        } catch (_) {}
        
        // تأخير بسيط قبل إعادة التوجيه لتجنب race conditions
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 100);
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: any) =>
    api.post('/auth/register/merchant', data),
  
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
  
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
  
  validateToken: () =>
    api.get('/auth/validate'),
  
  getProfile: () =>
    api.get('/auth/profile'),
};

// Admin API
export const adminApi = {
  getTenants: (page?: number, limit?: number, status?: string) => {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (status) params.status = status;
    return api.get('/admin/tenants', { params });
  },
  
  getPendingPayments: () =>
    api.get('/admin/payments/pending'),
  
  approvePayment: (paymentId: string) =>
    api.post(`/admin/payments/${paymentId}/approve`),
  
  rejectPayment: (paymentId: string, reason: string) =>
    api.post(`/admin/payments/${paymentId}/reject`, { reason }),
  
  suspendTenant: (tenantId: string, reason: string) =>
    api.patch(`/admin/tenants/${tenantId}/suspend`, { reason }),
  
  activateTenant: (tenantId: string) =>
    api.patch(`/admin/tenants/${tenantId}/activate`),
  
  getStats: () =>
    api.get('/admin/stats'),

  // Products
  getAllProducts: (params?: any) =>
    api.get('/admin/products', { params }),

  deleteProduct: (productId: string) =>
    api.post(`/admin/products/${productId}/delete`),

  // Orders
  getAllOrders: (params?: any) =>
    api.get('/admin/orders', { params }),

  // Users
  getAllUsers: (params?: any) =>
    api.get('/admin/users', { params }),

  toggleUserStatus: (userId: string) =>
    api.patch(`/admin/users/${userId}/toggle-status`),

  // Reports
  getReports: (params?: any) =>
    api.get('/admin/reports', { params }),

  // Settings
  getPlanFeatures: () =>
    api.get('/admin/settings/plan-features'),

  updatePlanFeatures: (plan: string, features: any) =>
    api.patch('/admin/settings/plan-features', { plan, features }),

  // Custom Domains
  getCustomDomainRequests: () =>
    api.get('/admin/domains/requests'),

  verifyDomain: (tenantId: string, domain: string) =>
    api.post('/admin/domains/verify', { tenantId, domain }),

  approveDomain: (tenantId: string, domain: string) =>
    api.post('/admin/domains/approve', { tenantId, domain }),

  rejectDomain: (tenantId: string, reason: string) =>
    api.post('/admin/domains/reject', { tenantId, reason }),
};

// Merchant API
export const merchantApi = {
  // Dashboard
  getDashboard: () =>
    api.get('/merchant/dashboard'),
  
  getStats: () =>
    api.get('/merchant/stats'),
  
  checkTrialLimits: () =>
    api.get('/merchant/trial-limits'),

  // Store Settings
  updateStore: (data: any) =>
    api.patch('/merchant/store/settings', data),

  // Products
  getProducts: (params?: any) =>
    api.get('/merchant/products', { params }),
  
  getProduct: (id: string) =>
    api.get(`/merchant/products/${id}`),
  
  createProduct: (data: any) =>
    api.post('/merchant/products', data),
  
  updateProduct: (id: string, data: any) =>
    api.patch(`/merchant/products/${id}`, data),
  
  deleteProduct: (id: string) =>
    api.delete(`/merchant/products/${id}`),

  duplicateProduct: (id: string) =>
    api.post(`/merchant/products/${id}/duplicate`),

  // Categories
  getCategories: () =>
    api.get('/merchant/categories'),

  getCategory: (id: string) =>
    api.get(`/merchant/categories/${id}`),

  createCategory: (data: any) =>
    api.post('/merchant/categories', data),

  updateCategory: (id: string, data: any) =>
    api.patch(`/merchant/categories/${id}`, data),

  deleteCategory: (id: string) =>
    api.delete(`/merchant/categories/${id}`),

  // Orders
  getOrders: (params?: any) =>
    api.get('/merchant/orders', { params }),
  
  getOrder: (id: string) =>
    api.get(`/merchant/orders/${id}`),
  
  updateOrder: (id: string, data: any) =>
    api.patch(`/merchant/orders/${id}`, data),
};

// Storefront API (Customer-facing)
export const storefrontApi = {
  // Store
  getStore: (subdomain: string) =>
    api.get(`/store/${subdomain}`),

  // Products
  getProducts: (subdomain: string, params?: any) =>
    api.get(`/store/${subdomain}/products`, { params }),

  getProduct: (subdomain: string, slug: string) =>
    api.get(`/store/${subdomain}/products/${slug}`),

  // Categories
  getCategories: (subdomain: string) =>
    api.get(`/store/${subdomain}/categories`),

  // Featured
  getFeaturedProducts: (subdomain: string) =>
    api.get(`/store/${subdomain}/featured`),

  // Checkout
  createOrder: (subdomain: string, data: any) =>
    api.post(`/store/${subdomain}/orders`, data),
};

// Legacy Products API (if needed for compatibility)
export const productsApi = {
  getAll: (params?: any) =>
    api.get('/merchant/products', { params }),
  
  getOne: (id: string) =>
    api.get(`/merchant/products/${id}`),
  
  create: (data: any) =>
    api.post('/merchant/products', data),
  
  update: (id: string, data: any) =>
    api.patch(`/merchant/products/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/merchant/products/${id}`),
};

// Legacy Orders API (if needed for compatibility)
export const ordersApi = {
  getAll: (params?: any) =>
    api.get('/merchant/orders', { params }),
  
  getOne: (id: string) =>
    api.get(`/merchant/orders/${id}`),
  
  updateStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/merchant/orders/${id}`, { status, notes }),

  // Track order by order number (public)
  trackOrder: (orderNumber: string) =>
    api.get(`/orders/track/${orderNumber}`),
};

// Subscription API
export const subscriptionApi = {
  getPlans: () =>
    api.get('/subscription/plans'),
  
  getCurrent: () =>
    api.get('/subscription/current'),
  
  submitPayment: (data: FormData) =>
    api.post('/subscription/payment/submit', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getPaymentHistory: () =>
    api.get('/subscription/payments/history'),
};

export default api;
