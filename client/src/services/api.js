import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (userData) => api.post('/users/login', userData);
export const register = (userData) => api.post('/users/register', userData);
export const getUserFiles = () => api.get('/files');
export const uploadFile = (formData) => api.post('/files/upload', formData);

export default api;
