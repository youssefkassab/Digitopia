import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login } from "../services/auth";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const steps = ["Email", "Password"];
const stepMessages = [
  "Enter your registered Email address.",
  "Now enter your Password to continue.",
];

const Login = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // === VALIDATIONS ===
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (pw) => pw.length >= 6;

  const validations = [
    () => validateEmail(formData.email),
    () => validatePassword(formData.password),
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const nextStep = () => {
    if (!validations[step]()) {
      setError(`Invalid ${steps[step]}`);
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validations.every((fn) => fn())) {
      setError("Please fix the errors before logging in.");
      return;
    }

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

  // === Stepper Form Fields ===
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
          />
        );
      case 1:
        return (
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  // === Handle Enter Key (acts like Next until last step) ===
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step < steps.length - 1) {
        nextStep();
      } else {
        handleSubmit(e);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Log In | 3lm Quest</title>
      </Helmet>
      <motion.div
        className="signup-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="signup-card">
          <div className="stepper">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`step ${i <= step ? "active" : ""}`}
              ></div>
            ))}
          </div>

          {/* Dynamic Step Message with Animation */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={step}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {stepMessages[step]}{" "}
              <span className="highlight">
                (Step {step + 1} of {steps.length})
              </span>
            </motion.h2>
          </AnimatePresence>

          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {error && <p className="error">{error}</p>}

            <div className="stepper-buttons">
              {step > 0 && (
                <button
                  type="button"
                  className="btn secondary"
                  onClick={prevStep}
                >
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button type="button" className="btn" onClick={nextStep}>
                  Next
                </button>
              ) : (
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? "Logging In..." : "Login"}
                </button>
              )}
            </div>
          </form>

          <p className="login-link">
            Don’t have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Login;
