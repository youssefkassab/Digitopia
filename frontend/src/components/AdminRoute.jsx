import { Navigate } from "react-router-dom";
import { getStoredUser } from "../services/auth";

// Wrapper for admin-only routes
const AdminRoute = ({ children }) => {
  const user = getStoredUser();

  if (!user) {
    // not logged in → go to login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    // logged in but not admin → go home
    return <Navigate to="/" replace />;
  }

  // authorized → show admin page
  return children;
};

export default AdminRoute;
