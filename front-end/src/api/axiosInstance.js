import axios from "axios";

// Get the backend URL from environment variables
// In Vite, environment variables prefixed with VITE_ are exposed via import.meta.env
const API_URL = import.meta.env.VITE_BACKEND_URL;

// Ensure the URL is available
if (!API_URL) {
  console.error("VITE_BACKEND_URL is not defined! API calls might fail.");
  // You might want to set a default for local development if not using .env locally
  // API_URL = "http://localhost:5000";
}

const axiosInstance = axios.create({
  baseURL: API_URL, // This sets the base URL for all requests made with this instance
  withCredentials: true, // Important for sending cookies/auth tokens across domains
});

// Optional: Add request/response interceptors for error handling, logging, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add headers here, e.g., for authentication tokens
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling for API responses
    console.error("API Error:", error.response || error.message);
    // You could redirect to a login page if a 401 is received, etc.
    return Promise.reject(error);
  }
);

export default axiosInstance;
