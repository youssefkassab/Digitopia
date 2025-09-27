import axios from "axios";

const API_URL = "http://localhost:3000/api";

const adminApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach **admin token** only
adminApi.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken"); // admin token
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

export default adminApi;
