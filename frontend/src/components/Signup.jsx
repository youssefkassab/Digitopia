import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signup, login } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "../index.css";

const steps = ["Name", "Email", "Password", "Role", "National ID", "Grade"];
const stepMessages = [
  "Let's start with your Full Name (4 words required).",
  "Great! Now enter your Email address.",
  "Set up a secure Password for your account.",
  "Choose your Role: Student or Teacher.",
  "Enter your 14-digit National ID.",
  "Finally, tell us your Grade (students only).",
];

const tempMailDomains = [
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "dispostable.com",
  "yopmail.com",
];
const allowedDomains = [
  "gmail.com",
  "hotmail.com",
  "yahoo.com",
  "outlook.com",
  "live.com",
];

const Signup = () => {
  const navigate = useNavigate();
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
  const validateName = (name) => {
    const words = name.trim().split(/\s+/);
    if (words.length < 4) {
      setError(
        `Your full name must have 4 words, you entered ${words.length}.`
      );
      return false;
    }
    if (words.length > 4) {
      setError("Please enter exactly 4 words for your full name.");
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setError("Name should only contain alphabetic characters.");
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    const domain = email.split("@")[1]?.toLowerCase();
    if (tempMailDomains.includes(domain)) {
      setError("Temporary emails are not allowed. Please use a valid one.");
      return false;
    }
    if (!allowedDomains.includes(domain)) {
      setError("Only Gmail, Hotmail, Yahoo, Outlook, and Live are accepted.");
      return false;
    }
    return true;
  };

  const validatePassword = (pw) => {
    const valid =
      pw.length >= 8 &&
      /\d/.test(pw) &&
      /[A-Z]/.test(pw) &&
      /[^A-Za-z0-9]/.test(pw);
    if (!valid)
      setError(
        "Password must be at least 8 characters, include a number, uppercase, and symbol."
      );
    return valid;
  };

  const calcPwStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/\d/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length > 12) score++;
    return score;
  };

  const validateNationalId = (id) => {
    const isValid = /^\d{14}$/.test(id);
    if (!isValid) setError("National ID must be exactly 14 digits.");
    return isValid;
  };

  const validateGrade = (grade) => {
    if (formData.role === "teacher") return true;
    if (!grade) {
      setError("Grade is required for students.");
      return false;
    }
    const num = parseInt(grade, 10);
    const valid = (!isNaN(num) && num >= 1 && num <= 12) || grade.length <= 5;
    if (!valid) setError("Please enter a valid grade (1–12).");
    return valid;
  };

  const validations = [
    () => validateName(formData.name),
    () => validateEmail(formData.email),
    () => validatePassword(formData.password),
    () => ["student", "teacher"].includes(formData.role),
    () => validateNationalId(formData.nationalId),
    () => validateGrade(formData.grade),
  ];

  // === HANDLERS ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    if (name === "password") setPasswordStrength(calcPwStrength(value));
  };

  const nextStep = useCallback(() => {
    // If teacher, skip the Grade step
    const isTeacher = formData.role === "teacher";
    if (!validations[step]()) return;
    setError("");
    if (isTeacher && step === 4) {
      // Skip grade
      setStep(steps.length - 1); // go directly to last step for submission
    } else {
      setStep((prev) => prev + 1);
    }
  }, [step, formData]);

  const prevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate before submission
    for (const validate of validations) {
      if (!validate()) return;
    }

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      national_number: formData.nationalId.trim(),
      role: formData.role === "student" ? "user" : "teacher",
      Grade:
        formData.role === "student" && formData.grade
          ? formData.grade.trim()
          : null,
    };

    setLoading(true);
    localStorage.removeItem("token");

    try {
      await signup(userData);
      setSuccess("Account created successfully! Logging in...");
      const loginRes = await login(formData.email, formData.password);
      if (loginRes?.token) {
        navigate("/dashboard");
      } else {
        setSuccess("Signup successful. Please login manually.");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      const message =
        err?.response?.data?.error ||
        err?.error ||
        err?.message ||
        "Signup failed. Please check your details and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // === KEYBOARD NAVIGATION ===
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading) return;
      if (e.key === "Enter") {
        e.preventDefault();
        if (step < steps.length - 1) nextStep();
        else handleSubmit(e);
      } else if (e.key === "ArrowLeft" && step > 0) {
        prevStep();
      } else if (e.key === "ArrowRight" && step < steps.length - 1) {
        nextStep();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, formData, loading, nextStep]);

  // === RENDER ===
  const renderPasswordChecklist = () => {
    const pw = formData.password;
    return (
      <ul className="pw-checklist">
        <li className={pw.length >= 8 ? "valid" : ""}>
          ✓ Minimum 8 characters
        </li>
        <li className={/[A-Z]/.test(pw) ? "valid" : ""}>
          ✓ At least one uppercase
        </li>
        <li className={/\d/.test(pw) ? "valid" : ""}>✓ At least one number</li>
        <li className={/[^A-Za-z0-9]/.test(pw) ? "valid" : ""}>
          ✓ At least one symbol
        </li>
      </ul>
    );
  };

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
            required
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
            required
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
              required
              autoComplete="new-password"
            />
            {renderPasswordChecklist()}
            <div className="pw-strength-bar">
              <div
                className={`pw-strength-fill strength-${passwordStrength}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              />
            </div>
            <p className="pw-strength-label">
              {["Very Weak", "Weak", "Medium", "Strong", "Very Strong"][
                passwordStrength - 1
              ] || "Very Weak"}
            </p>
          </>
        );
      case 3:
        return (
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        );
      case 4:
        return (
          <input
            type="text"
            name="nationalId"
            placeholder="Enter National ID (14 digits)"
            value={formData.nationalId}
            onChange={handleChange}
            maxLength="14"
            required
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
              required
            />
          )
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | 3lm Quest</title>
      </Helmet>

      <motion.div
        className="signup-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="signup-card">
          <div className="stepper">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`step ${i <= step ? "active" : ""}`}
                aria-label={`Step ${i + 1}`}
              />
            ))}
          </div>

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

          <form onSubmit={handleSubmit} noValidate>
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
                  disabled={loading}
                >
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  className="btn"
                  onClick={nextStep}
                  disabled={loading}
                >
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
            Already have an account?{" "}
            <Link to="/login" className="LoginLink">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Signup;
