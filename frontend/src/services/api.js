import axios from "axios";

// Use production URL or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? "https://3lm-quest.hemex.ai/api" : "http://localhost:3001/api");

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
