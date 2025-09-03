import api from "./api";

// Signup (POST /users/signup)
export const signup = async (userData) => {
  try {
    const { data } = await api.post("/users/signup", userData, {
      headers: { "Content-Type": "application/json" },
    });
    // data = { message: "User created successfully", userId: <id> }
    return data;
  } catch (error) {
    throw error.response?.data || { error: "Signup failed." };
  }
};

// Login (POST /users/login)
export const login = async (email, password) => {
  try {
    const { data } = await api.post(
      "/users/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    // data = { message, token, user: {id, email, role} }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed." };
  }
};

// Logout (POST /users/logout)
export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { message: "Already logged out" };
    }

    const { data } = await api.post(
      "/users/logout",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Clear local storage on successful logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return data; // { message: "Successfully logged out" }
  } catch (error) {
    // Even if API fails, clear local storage to avoid stale tokens
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw error.response?.data || { error: "Logout failed." };
  }
};

// Get current user (GET /api/users/user)
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const { data } = await api.get("/api/users/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data; // { id, name, email, national_number, role }
  } catch (error) {
    throw error.response?.data || { error: "Unable to fetch user info." };
  }
};

// Utility to read user info locally (no API call)
export const getStoredUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
