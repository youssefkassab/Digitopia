import React, { useEffect, useState } from "react";
import { validateAdminAccess } from "./adminAuth";
import AccessDenied from "../assets/Msgs/Access_Denied.png";

const AdminProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const allowed = await validateAdminAccess();

        if (allowed) {
          const token = localStorage.getItem("token");
          const existingAdminToken = localStorage.getItem("adminToken");
          if (token && token !== existingAdminToken) {
            localStorage.setItem("adminToken", token);
          }
        } else {
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

  // Hide navbar/footer by directly targeting them
  useEffect(() => {
    const nav = document.querySelector(".glassy-navbar"); // change if your navbar is different
    const footer = document.querySelector("footer"); // change if your footer is different

    if (isAuthorized === false) {
      if (nav) nav.style.display = "none";
      if (footer) footer.style.display = "none";
    } else {
      if (nav) nav.style.display = "";
      if (footer) footer.style.display = "";
    }

    // Cleanup on unmount
    return () => {
      if (nav) nav.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, [isAuthorized]);

  if (isAuthorized === null) return null;

  if (!isAuthorized) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#1800ad",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          zIndex: 9999,
        }}
      >
        <img
          src={AccessDenied}
          alt="Access Denied"
          style={{
            maxWidth: "100%",
            maxHeight: "100vh",
            objectFit: "contain",
          }}
        />
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
