import axios from "axios";

const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API = axios.create({
  baseURL: `${url}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically attach authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("connectimi_token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle session expiration or global errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized (401), we could optionally clear token and redirect
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Logging out...");
      localStorage.removeItem("connectimi_token");
      localStorage.removeItem("connectimi_user");
    }
    return Promise.reject(error);
  },
);

export default API;
