import api from "../services/api";

/**
 * Validate the currently stored token and role.
 * This function checks:
 *  1. If the user has a valid JWT token
 *  2. If the token is still valid (not expired)
 *  3. If the user's role is 'admin'
 */
export const validateAdminAccess = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    // Decode token to check expiration and role
    const [, payload] = token.split(".");
    if (!payload) return false;
    const decoded = JSON.parse(atob(payload));

    if (!decoded?.role || decoded.role !== "admin") return false;

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }

    // Optionally confirm with backend:
    const { data } = await api.get("/users/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data?.role === "admin";
  } catch (err) {
    console.error("Admin validation failed:", err);
    return false;
  }
};

export const getStoredAdmin = () => {
  const admin = localStorage.getItem("user");
  return admin ? JSON.parse(admin) : null;
};

export const isAdminAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};
