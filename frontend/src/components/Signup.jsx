import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signup, login } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import "../index.css";

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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = t("signup.steps", { returnObjects: true });
  const stepMessages = t("signup.stepMessages", { returnObjects: true });
  const placeholders = t("signup.placeholders", { returnObjects: true });
  const buttons = t("signup.buttons", { returnObjects: true });
  const errorsText = t("signup.errors", { returnObjects: true });
  const passwordStrengthLabels = t("signup.passwordStrength", {
    returnObjects: true,
  });
  const loginLinkText = t("signup.loginLink");

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
    if (words.length !== 4) {
      setError(errorsText.fullNameWords);
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setError(errorsText.fullNameLetters);
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(errorsText.emailInvalid);
      return false;
    }
    const domain = email.split("@")[1]?.toLowerCase();
    if (tempMailDomains.includes(domain)) {
      setError(errorsText.emailTemp);
      return false;
    }
    if (!allowedDomains.includes(domain)) {
      setError(errorsText.emailDomain);
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
    if (!valid) setError(errorsText.password);
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
    if (!/^\d{14}$/.test(id)) {
      setError(errorsText.nationalId);
      return false;
    }

    const digits = id.split("").map(Number);
    const [
      first,
      second,
      third,
      fourth,
      fifth,
      sixth,
      seventh,
      eighth,
      ninth,
      tenth,
      eleventh,
      twelfth,
      thirteenth,
      fourteenth,
    ] = digits;

    const secondThird = second * 10 + third;
    const fourthFifth = fourth * 10 + fifth;
    const sixthSeventh = sixth * 10 + seventh;
    const eighthNinth = eighth * 10 + ninth;

    // === Role-based validation ===
    if (formData.role === "student") {
      // Students: first must be 3, and second+third ≥ 06
      if (first !== 3) return invalid();
      if (secondThird < 6) return invalid();
    } else if (formData.role === "teacher") {
      // Teachers: first can be 2, or 3 with second+third ≤ 06
      if (first !== 2 && first !== 3) return invalid();
      if (first === 3 && secondThird > 6) return invalid();
    } else {
      return invalid();
    }

    // === Stable shared rules ===

    // (4th,5th) together must be ≤ 12, OR else follow detailed month/day logic
    if (fourthFifth > 12) return invalid();

    // If fourth = 0, fifth ≤ 9
    if (fourth === 0 && fifth > 9) return invalid();

    // If fourth = 1, fifth ≤ 2
    if (fourth === 1 && fifth > 2) return invalid();

    // (6th,7th) ≤ 31
    if (sixthSeventh < 1 || sixthSeventh > 31) return invalid();

    // (8th,9th) ≤ 35 or == 88
    if (!(eighthNinth <= 35 || eighthNinth === 88)) return invalid();

    return true;

    function invalid() {
      setError(errorsText.nationalId);
      return false;
    }
  };

  const validateGrade = (grade) => {
    if (formData.role === "teacher") return true;
    if (!grade) {
      setError(errorsText.grade);
      return false;
    }
    const num = parseInt(grade, 10);
    const valid = (!isNaN(num) && num >= 1 && num <= 12) || grade.length <= 5;
    if (!valid) setError(errorsText.grade);
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
    const isTeacher = formData.role === "teacher";
    if (!validations[step]()) return;
    setError("");
    if (isTeacher && step === 4) {
      setStep(steps.length - 1);
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
      setSuccess(t("signup.success"));
      const loginRes = await login(formData.email, formData.password);
      if (loginRes?.token) {
        navigate("/dashboard");
      } else {
        setSuccess(t("signup.signupSuccessManual"));
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
      } else if (e.key === "ArrowLeft" && step > 0) prevStep();
      else if (e.key === "ArrowRight" && step < steps.length - 1) nextStep();
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
            placeholder={placeholders.name}
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
            placeholder={placeholders.email}
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
              placeholder={placeholders.password}
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
              {passwordStrengthLabels[passwordStrength - 1] ||
                passwordStrengthLabels[0]}
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
            placeholder={placeholders.nationalId}
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
              placeholder={placeholders.grade}
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
        <title>{t("signup.title")}</title>
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
                {t("login.stepCounter", {
                  current: step + 1,
                  total: steps.length,
                })}
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
                  {buttons.back}
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  className="btn"
                  onClick={nextStep}
                  disabled={loading}
                >
                  {buttons.next}
                </button>
              ) : (
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? buttons.creating : buttons.createAccount}
                </button>
              )}
            </div>
          </form>

          <p className="login-link">
            {loginLinkText.replace("Login here", "")}
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
