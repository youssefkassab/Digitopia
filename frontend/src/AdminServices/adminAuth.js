import api from "../services/api";

/**
 * Admin login - stores token under 'adminToken' and admin info under 'admin'.
 * This keeps admin session completely separate from user session (key 'token').
 */
export const adminLogin = async (email, password) => {
  try {
    const { data } = await api.post(
      "/admin/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    // store admin token & info under separate keys
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("admin", JSON.stringify(data.admin));

    return data;
  } catch (error) {
    throw error.response?.data || { error: "Admin login failed." };
  }
};

/**
 * Admin logout - removes adminToken/admin only.
 * Does NOT touch user token or user info.
 */
export const adminLogout = async () => {
  try {
    // If you have a backend admin logout route you can call it here using api (optional)
    // await api.post('/admin/logout', {}, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });

    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    return { message: "Admin logged out (local)" };
  } catch (err) {
    throw { error: "Admin logout failed." };
  }
};

export const getStoredAdmin = () => {
  const raw = localStorage.getItem("admin");
  return raw ? JSON.parse(raw) : null;
};

export const isAdminAuthenticated = () => {
  return !!localStorage.getItem("adminToken");
};
