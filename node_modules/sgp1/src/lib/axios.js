
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
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
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

    // Add headers to potentially bypass CSRF for auth routes
    if (config.url?.includes('/auth/')) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      config.headers['Accept'] = 'application/json';
    }

    console.log('🚀 Making API request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to log responses and handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });

    // Check for specific error conditions
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }

    return Promise.reject(error);
  }
);

// Special function for authentication requests that might bypass CSRF
export const authRequest = async (method, url, data = null) => {
  try {
    console.log('🔐 Making auth request:', { method, url, data: data ? 'present' : 'none' });

    const config = {
      method,
      url: `${baseURL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: true,
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    console.log('✅ Auth request successful:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Auth request failed:', error);
    throw error;
  }
};

export default api;