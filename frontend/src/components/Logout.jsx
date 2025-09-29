import React, { useState } from "react";
import { logout } from "../services/auth";

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout(); // Calls /api/users/logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (err) {
      const message =
        err?.error ||
        err?.message ||
        err?.details?.[0]?.message ||
        "Logout failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogout} disabled={loading} className="btn">
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
};

export default Logout;
