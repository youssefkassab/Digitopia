import React, { useState } from "react";
import { logout } from "../services/auth";

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      window.location.href = "/"; // redirect to home or login
    } catch (err) {
      setError("Logout failed. Please try again.");
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
