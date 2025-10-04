import axios from "axios";

// Use Vite env or fallback to production/localhost
const API_URL = import.meta.env.VITE_ADMIN_API_URL || 
  (import.meta.env.PROD ? "https://hemex.ai:3001/api" : "http://localhost:3001/api");

const adminApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // keep this if your backend uses cookies
});

// Attach admin token if present (key: adminToken)
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Pass through responses / errors
adminApi.interceptors.response.use(
  (resp) => resp,
  (err) => Promise.reject(err)
);

export default adminApi;
