import axios from "axios";

// Easy switching between localhost and production
// Change this to switch between environments:
// const USE_PRODUCTION = false; // localhost
// const USE_PRODUCTION = true;  // hemex.ai

const USE_PRODUCTION = false; // Set to true for hemex.ai, false for localhost

const API_URL = USE_PRODUCTION
  ? "https://hemex.ai:3001/api"
  : "http://localhost:3001/api";

console.log(`🔗 API Mode: ${USE_PRODUCTION ? 'PRODUCTION (hemex.ai)' : 'DEVELOPMENT (localhost)'}`);

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
