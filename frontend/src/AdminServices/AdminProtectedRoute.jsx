import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { validateAdminAccess } from "./adminAuth";

const AdminProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const allowed = await validateAdminAccess();

        // ✅ If validated as admin, issue an admin token
        if (allowed) {
          const token = localStorage.getItem("token");
          const existingAdminToken = localStorage.getItem("adminToken");

          // Only store if not already set or changed
          if (token && token !== existingAdminToken) {
            localStorage.setItem("adminToken", token);
            console.log("✅ Admin access confirmed — adminToken stored.");
          }
        } else {
          // If not admin, make sure no admin token is lingering
          localStorage.removeItem("adminToken");
        }

        setIsAuthorized(allowed);
      } catch (err) {
        console.error("Admin access check failed:", err);
        setIsAuthorized(false);
      }
    };

    checkAccess();
  }, []);

  if (isAuthorized === null) {
    // Loading placeholder
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Checking admin access...
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
