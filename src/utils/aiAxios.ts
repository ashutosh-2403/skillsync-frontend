// src/utils/aiAxios.ts
import axios from 'axios';

const aiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api',
  withCredentials: true,
  timeout: 60000, // 60 seconds for AI requests
});

// Request interceptor
aiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🤖 Making AI request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ AI request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with AI-specific error handling
aiInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ AI response received from: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ AI response error:', error);
    
    if (error.code === 'ECONNABORTED') {
      console.log('⏰ AI request timed out');
      error.message = 'AI processing is taking longer than expected. Please try again with a shorter question.';
    }
    
    return Promise.reject(error);
  }
);

export default aiInstance;
