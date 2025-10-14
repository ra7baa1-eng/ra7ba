import axios from 'axios';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === '1';
// Prefer local Next API when using mock; otherwise use provided API URL, and fallback to local API
const API_URL = USE_MOCK
  ? '/api'
  : (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== ''
      ? process.env.NEXT_PUBLIC_API_URL
      : '/api');

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
        try {
          window.localStorage.clear();
        } catch (_) {}
        window.location.href = '/auth/login';
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
  getTenants: (params?: any) =>
    api.get('/admin/tenants', { params }),
  
  getPendingPayments: () =>
    api.get('/admin/payments/pending'),
  
  approvePayment: (paymentId: string) =>
    api.post(`/admin/payments/${paymentId}/approve`),
  
  rejectPayment: (paymentId: string, reason: string) =>
    api.post(`/admin/payments/${paymentId}/reject`, { reason }),
  
  getStats: () =>
    api.get('/admin/stats'),
};

// Merchant API
export const merchantApi = {
  getDashboard: () =>
    api.get('/merchant/dashboard'),
  
  updateStore: (data: any) =>
    api.patch('/merchant/store/settings', data),
};

// Products API
export const productsApi = {
  getAll: (params?: any) =>
    api.get('/products/merchant', { params }),
  
  getOne: (id: string) =>
    api.get(`/products/merchant/${id}`),
  
  create: (data: any) =>
    api.post('/products', data),
  
  update: (id: string, data: any) =>
    api.patch(`/products/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/products/${id}`),
  
  // Store products (public)
  getStoreProducts: (params?: any) =>
    api.get('/products/store', { params }),
};

// Orders API
export const ordersApi = {
  getAll: (params?: any) =>
    api.get('/orders/merchant', { params }),
  
  getOne: (id: string) =>
    api.get(`/orders/merchant/${id}`),
  
  updateStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/orders/merchant/${id}/status`, { status, notes }),
  
  assignDelivery: (id: string, data: any) =>
    api.patch(`/orders/merchant/${id}/delivery`, data),
  
  // Public
  checkout: (data: any) =>
    api.post('/orders/checkout', data),
  
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
