import React, { useState } from "react";
import { adminLogin } from "../AdminServices/adminAuth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const { admin } = await adminLogin(email, password);

      setSuccess(`Hi, ${admin?.name || "Admin"} 👋 Login successful!`);
      setLoading(false);

      // Redirect after 1s
      setTimeout(() => (window.location.href = "/admin/dashboard"), 1000);
    } catch (err) {
      setLoading(false);
      setError(err.error || "Login failed. Try again.");
    }
  };

  return (
    <div className="admin-signup-container">
      <div className="admin-signup-card">
        <h2>
          Admin <span className="highlight">Login</span>
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <a href="/admin/signup" className="login-link">
          Don't have an account? Sign up
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
