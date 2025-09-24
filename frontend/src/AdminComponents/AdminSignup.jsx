import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import adminApi from "../AdminServices/adminApi"; // <-- changed

const steps = ["Name", "Email", "Password", "Master Key"];
const stepMessages = [
  "Enter your full Name (4 words).",
  "Enter your Email.",
  "Create a strong Password (8+ chars, 1 uppercase, 1 number, 1 symbol).",
  "Enter Master Key to authorize admin creation.",
];

const AdminSignup = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    masterKey: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validations = [
    () =>
      formData.name.trim().split(" ").length === 4 || "Name must be 4 words.",
    () =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
      "Invalid email format.",
    () =>
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(formData.password) ||
      "Password must be 8+ chars, include uppercase, number, and symbol.",
    () => formData.masterKey.length > 0 || "Master key is required.",
  ];

  const nextStep = () => {
    const valid = validations[step]();
    if (valid !== true) {
      setError(valid);
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validations.every((fn) => fn())) {
      setError("Complete all fields correctly.");
      return;
    }
    setLoading(true);
    try {
      const res = await adminApi.post("/admin/signup", formData); // <-- use adminApi

      setSuccess(res.data.message || "Admin created successfully!");

      // Store admin token & info separately
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      navigate("/admin/dashboard");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("This email is already registered as admin.");
      } else if (err.response?.status === 400) {
        setError("Invalid signup details. Please check your inputs.");
      } else {
        setError(err.response?.data?.error || "Signup failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="signup-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="signup-card">
        <AnimatePresence mode="wait">
          <motion.h2
            key={step}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
          >
            {stepMessages[step]} (Step {step + 1}/{steps.length})
          </motion.h2>
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
            >
              {step === 0 && (
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name (4 words)"
                />
              )}
              {step === 1 && (
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                />
              )}
              {step === 2 && (
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  type="password"
                />
              )}
              {step === 3 && (
                <input
                  name="masterKey"
                  value={formData.masterKey}
                  onChange={handleChange}
                  placeholder="Master Key"
                  type="password"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div className="stepper-buttons">
            {step > 0 && (
              <button type="button" onClick={prevStep}>
                Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button type="button" onClick={nextStep}>
                Next
              </button>
            ) : (
              <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Admin"}
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminSignup;
