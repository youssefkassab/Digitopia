import React, { useState } from "react";
import { motion } from "framer-motion";
import { login } from "../services/auth";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      window.location.href = "/dashboard";
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Login failed.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="card">
        <h2 style={{ marginBottom: "1rem" }}>
          Welcome Back <strong style={{ color: "#007aff" }}>Login</strong>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter Your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
