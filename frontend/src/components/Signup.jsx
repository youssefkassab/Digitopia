import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signup, login } from "../services/auth";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const steps = ["Name", "Email", "Password", "Role", "National ID", "Grade"];

const stepMessages = [
  "Let's start with your Full Name (4 words required).",
  "Great! Now enter your Email address.",
  "Set up a secure Password for your account.",
  "Choose your Role: Student or Teacher.",
  "Enter your 14-digit National ID.",
  "Finally, tell us your Grade (students only).",
];

// === Temp mail domains (extendable) ===
const tempMailDomains = [
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "dispostable.com",
  "yopmail.com",
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
  const validateName = (name) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      setError("Your full name must have 4 words, not just 1.");
      return false;
    }
    if (words.length === 2) {
      setError("Almost there! Your full name needs 4 words, not 2.");
      return false;
    }
    if (words.length === 3) {
      setError("Good! Add 1 more word to complete your 4-word full name.");
      return false;
    }
    if (words.length === 4) {
      return true;
    }
    if (words.length > 4) {
      setError("Please enter exactly 4 words for your full name.");
      return false;
    }
    return false;
  };

  const validateEmail = (email) => {
    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    const parts = email.split("@");
    if (parts.length !== 2) return false;
    const domain = parts[1].toLowerCase();

    if (tempMailDomains.includes(domain)) {
      setError("Temporary emails are not allowed. Please use a valid one.");
      return false;
    }

    const allowedDomains = [
      "gmail.com",
      "hotmail.com",
      "yahoo.com",
      "outlook.com",
      "live.com",
    ];

    if (!allowedDomains.includes(domain)) {
      setError("Only Gmail, Hotmail, Yahoo, Outlook, and Live are accepted.");
      return false;
    }

    return true;
  };

  const validatePassword = (pw) =>
    pw.length >= 8 &&
    /\d/.test(pw) &&
    /[A-Z]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw);

  const calcPwStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/\d/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length > 12) score++; // bonus
    return score;
  };

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

    if (name === "password") {
      setPasswordStrength(calcPwStrength(value));
    }
  };

  const nextStep = () => {
    if (!validations[step]()) {
      return; // error already set
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

  // === Keyboard Navigation (Enter, Left Arrow, Right Arrow) ===
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (step < steps.length - 1) {
          nextStep();
        } else {
          handleSubmit(e);
        }
      }
      if (e.key === "ArrowLeft" && step > 0) {
        prevStep();
      }
      if (e.key === "ArrowRight" && step < steps.length - 1) {
        nextStep();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, formData]);

  // === Password Checklist ===
  const renderPasswordChecklist = () => {
    const pw = formData.password;
    return (
      <ul className="pw-checklist">
        <li className={pw.length >= 8 ? "valid" : ""}>
          ✓ Minimum 8 characters
        </li>
        <li className={/[A-Z]/.test(pw) ? "valid" : ""}>
          ✓ At least one uppercase letter
        </li>
        <li className={/\d/.test(pw) ? "valid" : ""}>✓ At least one number</li>
        <li className={/[^A-Za-z0-9]/.test(pw) ? "valid" : ""}>
          ✓ At least one symbol
        </li>
      </ul>
    );
  };

  // === Step Renderer ===
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
            {renderPasswordChecklist()}
            <div className="pw-strength-bar">
              <div
                className={`pw-strength-fill strength-${passwordStrength}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
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
            {steps.map((s, i) => (
              <div
                key={i}
                className={`step ${i <= step ? "active" : ""}`}
              ></div>
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

          <form onSubmit={handleSubmit}>
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
