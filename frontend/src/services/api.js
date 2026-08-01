import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Request Interceptor to add Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear client state on 401 Unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // We can also redirect to login if we are in browser environment,
      // but let the AuthContext handle this state transition dynamically.
    }
    return Promise.reject(error);
  }
);

export default api;
