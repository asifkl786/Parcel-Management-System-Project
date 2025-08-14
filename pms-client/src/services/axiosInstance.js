import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_API_BASE ||'http://localhost:8080/api';


// Create Axios instance with token interceptor
const axiosInstance  = axios.create({
  baseURL: BASE_API_URL,
});

// Auto-attach Bearer token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 Unauthorized globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Token expired. Redirecting to login...');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;