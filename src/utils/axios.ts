// src/utils/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api',
  withCredentials: true,
  timeout: 30000, // Increased to 30 seconds
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with timeout handling
instance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received from: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response interceptor error:', error);
    
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      console.log('⏰ Request timed out');
      error.message = 'Request timed out. The server is taking longer than expected to respond.';
    } else if (error.response?.status === 401) {
      console.log('🔐 Unauthorized response - clearing token');
      localStorage.removeItem('token');
    }
    
    return Promise.reject(error);
  }
);

export default instance;
