import adminApi from "./adminApi";

/**
 * Validate the currently stored admin token and role.
 * - Uses localStorage key "adminToken" and "adminUser"
 * - Decodes JWT to do a quick client-side check (non-trusty)
 * - Confirms role with backend by calling /users/user (requires token)
 *
 * NOTE: For production, prefer secure HttpOnly cookies for tokens.
 */
export const validateAdminAccess = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) return false;

    // Quick client-side decode (not secure, just UX)
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload?.role || payload.role !== "admin") return false;

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      return false;
    }

    // Confirm with backend (endpoint: GET /api/users/user)
    // adminApi already attaches Authorization header from localStorage
    const { data } = await adminApi.get("/users/user");
    return data?.role === "admin";
  } catch (err) {
    console.error("Admin validation failed:", err);
    // on error, be conservative and deny access (frontend will redirect)
    return false;
  }
};

export const getStoredAdmin = () => {
  const admin = localStorage.getItem("adminUser");
  return admin ? JSON.parse(admin) : null;
};

export const isAdminAuthenticated = () => {
  const token = localStorage.getItem("adminToken");
  return !!token;
};
