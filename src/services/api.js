import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const adminApi = {
  getRegistrations: (params = {}) => {
    const { page = 1, limit = 10, search = '', status = '' } = params;
    const query = new URLSearchParams({ page, limit });
    if (search) query.append('search', search);
    if (status) query.append('status', status);
    return api.get(`/admin/registrations?${query.toString()}`);
  },
  getRegistration: (id) => api.get(`/admin/registrations/${id}`),
  updateRegistrationStatus: (id, status) => api.patch(`/admin/registrations/${id}`, { status }),
  deleteRegistration: (id) => api.delete(`/admin/registrations/${id}`),
  getStats: () => api.get('/admin/stats'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.patch('/admin/settings', data)
};

export default api;
