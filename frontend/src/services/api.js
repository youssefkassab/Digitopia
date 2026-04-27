import axios from "axios";

// Dynamic API URL determination
const getApiUrl = () => {
  // First, try environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Check if running in browser
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    
    // If on Render, use the same origin for API
    if (currentOrigin.includes('onrender.com')) {
      return `${currentOrigin}/api`;
    }
    
    // If running on localhost or 127.0.0.1 in development
    if (currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1')) {
      return `${currentOrigin}/api`;
    }
    
    // If on production domain hemex.ai
    if (currentOrigin.includes('hemex.ai')) {
      return `${currentOrigin}/api`;
    }
  }

  // Fallback: use relative URL based on current origin
  return `${currentOrigin}/api`;
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
