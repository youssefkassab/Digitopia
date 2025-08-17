import api from "./api";

// Signup
export const signup = async (userData) => {
  try {
    const { data } = await api.post("/users/signup", userData);
    return data; // { message, userId }
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Login
export const login = async (email, password) => {
  try {
    const { data } = await api.post("/users/login", { email, password });
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
