import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signup, login } from "../services/auth";
import { Link } from "react-router-dom";

const steps = ["Name", "Email", "Password", "Role", "National ID", "Grade"];

// === Step-specific messages ===
const stepMessages = [
  "Let's start with your Full Name (4 words required).",
  "Great! Now enter your Email address.",
  "Set up a secure Password for your account.",
  "Choose your Role: Student or Teacher.",
  "Enter your 14-digit National ID.",
  "Finally, tell us your Grade (students only).",
];

const Signup = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    nationalId: "",
    grade: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // === VALIDATIONS ===
  const validateName = (name) => name.trim().split(/\s+/).length === 4;
  const validateEmail = (email) => {
    const allowedDomains = [
      "gmail.com",
      "hotmail.com",
      "yahoo.com",
      "outlook.com",
      "live.com",
    ];
    const parts = email.split("@");
    return (
      parts.length === 2 && allowedDomains.includes(parts[1].toLowerCase())
    );
  };
  const validatePassword = (pw) =>
    /\d/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw) &&
    pw.length >= 8 &&
    pw.length <= 50;
  const calcPwStrength = (pw) =>
    [
      pw.length >= 8,
      /\d/.test(pw),
      /[^A-Za-z0-9]/.test(pw),
      pw.length > 12,
    ].filter(Boolean).length;
  const validateNationalId = (id) =>
    /^\d{14}$/.test(id) && (id[0] === "2" || id[0] === "3");
  const validateGrade = (grade) => {
    const num = parseInt(grade, 10);
    return (
      (!isNaN(num) && num >= 1 && num <= 12) ||
      (/(college|year|grade)/i.test(grade) && /\d/.test(grade))
    );
  };

  const validations = [
    () => validateName(formData.name),
    () => validateEmail(formData.email),
    () => validatePassword(formData.password),
    () => ["student", "teacher"].includes(formData.role),
    () => validateNationalId(formData.nationalId),
    () => (formData.role === "student" ? validateGrade(formData.grade) : true),
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    if (name === "password") setPasswordStrength(calcPwStrength(value));
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
      setError("Please Complete All The Fields Before Submission");
      return;
    }

    const idPrefix = parseInt(formData.nationalId.substring(0, 3), 10);
    if (formData.role === "student" && (isNaN(idPrefix) || idPrefix < 305)) {
      setError("Your National ID is invalid for a student.");
      return;
    }
    if (formData.role === "teacher" && (isNaN(idPrefix) || idPrefix >= 305)) {
      setError("Your National ID is invalid for a teacher.");
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role === "student" ? "user" : "teacher",
      national_number: formData.nationalId,
      Grade: formData.grade,
    };

    setLoading(true);
    try {
      await signup(userData);
      setSuccess("Account created successfully! Logging in...");
      await login(formData.email, formData.password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.error || "Signup failed. Please try again.");
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
            type="text"
            name="name"
            placeholder="Enter Full Name (4 words)"
            value={formData.name}
            onChange={handleChange}
          />
        );
      case 1:
        return (
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />
        );
      case 2:
        return (
          <>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />
            <div className="pw-strength">
              Strength:{" "}
              {["Weak", "Medium", "Strong", "Very Strong"][
                passwordStrength - 1
              ] || "Very Weak"}
            </div>
          </>
        );
      case 3:
        return (
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        );
      case 4:
        return (
          <input
            type="text"
            name="nationalId"
            placeholder="Enter National ID"
            value={formData.nationalId}
            onChange={handleChange}
            maxLength="14"
          />
        );
      case 5:
        return (
          formData.role === "student" && (
            <input
              type="text"
              name="grade"
              placeholder="Enter Grade"
              value={formData.grade}
              onChange={handleChange}
            />
          )
        );
      default:
        return null;
    }
  };

  // === Handle Enter key ===
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
    <motion.div
      className="signup-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="signup-card">
        <div className="stepper">
          {steps.map((s, i) => (
            <div key={i} className={`step ${i <= step ? "active" : ""}`}></div>
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
          {success && <p className="success">{success}</p>}

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
                {loading ? "Creating..." : "Create Account"}
              </button>
            )}
          </div>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Signup;
