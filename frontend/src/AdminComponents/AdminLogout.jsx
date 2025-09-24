import React, { useState } from "react";
import { adminLogout } from "../AdminServices/adminAuth";

const AdminLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoading(true);
    try {
      await adminLogout();
      window.location.href = "/admin/login"; // redirect to admin login
    } catch {
      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-signup-container">
      <div className="admin-signup-card">
        <h2>
          Admin <span className="highlight">Logout</span>
        </h2>
        {error && <div className="error">{error}</div>}
        <button onClick={handleLogout} disabled={loading} className="btn">
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default AdminLogout;
