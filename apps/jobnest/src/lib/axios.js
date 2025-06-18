
import axios from 'axios';

// Debug environment variables
console.log('🔍 JobNest API Configuration:', {
  VITE_JOBNEST_API_URL: import.meta.env.VITE_JOBNEST_API_URL,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  PROD: import.meta.env.PROD
});

// Determine the correct base URL
const baseURL = import.meta.env.VITE_JOBNEST_API_URL ||
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? '/jobnest/api'  // Use Vercel proxy in production
    : 'http://localhost:8000');

console.log('🚀 Using API Base URL:', baseURL);

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL,
  timeout: 60000, // Increased timeout to 60 seconds for Gemini AI calls
  headers: {
    'Content-Type': 'application/json',
  },
  // Add withCredentials to handle cookies properly
  withCredentials: true,
});

// Add a request interceptor to attach the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check for specific error conditions
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userData');

    }

    return Promise.reject(error);
  }
);

export default api;