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
      config.headers.Authorization = `Bearer ${token}`;
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
    // If unauthorized (401), we clear token and notify the application via custom event.
    // Skip this for /auth/logout itself — a 401 there (expired token) is not a session
    // expiry we need to react to, and reacting would cause an infinite logout loop.
    const isLogoutEndpoint = error.config?.url?.includes("/auth/logout");
    if (error.response && error.response.status === 401 && !isLogoutEndpoint) {
      console.warn("Session expired or unauthorized. Logging out...");
      localStorage.removeItem("connectimi_token");
      localStorage.removeItem("connectimi_refresh_token");
      localStorage.removeItem("connectimi_user");
      window.dispatchEvent(new CustomEvent("connectimi_unauthorized"));
    }
    return Promise.reject(error);
  },
);

export default API;
