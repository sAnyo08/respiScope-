// src/services/api.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send cookies (refresh token cookie set by backend)
});

// Attach access token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

// Basic refresh logic (tries refresh when 401)
let isRefreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach(p => error ? p.reject(error) : p.resolve(token));
  queue = [];
};

api.interceptors.response.use(response => response, async (err) => {
  const originalRequest = err.config;
  if (err.response && err.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;
    try {
      // role stored in localStorage by authService
      const role = localStorage.getItem('role') || 'doctor';
      const res = await api.post(`/auth/${role}/refresh`); // backend must return { accessToken }
      const newToken = res.data?.accessToken;
      if (!newToken) throw new Error('No access token returned');
      localStorage.setItem('accessToken', newToken);
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      throw refreshErr;
    } finally {
      isRefreshing = false;
    }
  }
  throw err;
});

export default api;
