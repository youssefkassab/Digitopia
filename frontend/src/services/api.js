import axios from "axios";

// Dynamic API URL determination
const getApiUrl = () => {
  // First, try environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Then check if we're in production mode
  if (import.meta.env.MODE === 'production' || import.meta.env.PROD) {
    return "https://3lm-quest.hemex.ai/api";
  }

  // For development, use localhost
  if (typeof window !== 'undefined') {
    // If running in browser, use relative path or same origin
    const currentOrigin = window.location.origin;
    if (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1')) {
      return `${currentOrigin}/api`;
    }
  }

  // Fallback to localhost for development
  return "http://localhost:3001/api";
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach **user token** only
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // user token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
