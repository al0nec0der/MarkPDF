import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

export const login = (userData) => api.post('/users/login', userData);
export const register = (userData) => api.post('/users/register', userData);

export default api;
