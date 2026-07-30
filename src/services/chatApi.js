import axios from "axios";

const chatUrl = import.meta.env.VITE_CHAT_URL || "http://localhost:8000";

const chatApi = axios.create({
  baseURL: chatUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

chatApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("connectimi_token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default chatApi;
