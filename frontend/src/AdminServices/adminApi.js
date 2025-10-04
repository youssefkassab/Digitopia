import axios from "axios";

// Easy switching between localhost and production
// Change this to switch between environments:
// const USE_PRODUCTION = false; // localhost
// const USE_PRODUCTION = true;  // hemex.ai

const USE_PRODUCTION = false; // Set to true for hemex.ai, false for localhost

const API_URL = USE_PRODUCTION
  ? "https://hemex.ai:3001/api"
  : "http://localhost:3001/api";

console.log(`🔗 Admin API Mode: ${USE_PRODUCTION ? 'PRODUCTION (hemex.ai)' : 'DEVELOPMENT (localhost)'}`);

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
