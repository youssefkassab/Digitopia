import React, { useState } from "react";
import { motion } from "framer-motion";
import { signup, login } from "../services/auth";

const Signup = () => {
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

  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const validLength = password.length >= 8 && password.length <= 50;
    return hasNumber && hasSymbol && validLength;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    if (password.length > 12) strength += 1;
    return strength; // 0 to 4
  };

  // --- National ID validation with additional conditions ---
  const validateNationalId = (id) => {
    if (!/^\d{14}$/.test(id)) return false;
    if (id[0] !== "2" && id[0] !== "3") return false;

    const eighthDigit = parseInt(id[7], 10);
    const ninthDigit = parseInt(id[8], 10);
    const combined = parseInt(id.substring(7, 9), 10);

    if (!(eighthDigit <= 3 || eighthDigit === 8)) return false;
    if (isNaN(ninthDigit) || ninthDigit > 9) return false;
    if (!(combined <= 35 || combined === 88)) return false;

    return true;
  };

  const validateGrade = (grade) => {
    const num = parseInt(grade, 10);
    return (
      (!isNaN(num) && num >= 1 && num <= 12) ||
      (/(college|year|grade)/i.test(grade) && /\d/.test(grade))
    );
  };

  const validateName = (name) => {
    const words = name.trim().split(/\s+/);
    return words.length === 4; // must have exactly 4 names
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateName(formData.name)) {
      setError("Full name must contain exactly 4 Words.");
      return;
    }

    if (!validateNationalId(formData.nationalId)) {
      setError("Invalid National ID");
      return;
    }

    if (formData.role === "student" && !validateGrade(formData.grade)) {
      setError(
        "Grade must be 1-12 or contain 'college/year/grade' AND a number."
      );
      return;
    }

    if (!validateEmail(formData.email)) {
      setError(
        "Enter A Vaild Email Address"
      );
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "Password must be 8-50 chars, contain at least one symbol and one number"
      );
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
          Join Us <strong style={{ color: "#007aff" }}>NOW !!!</strong>
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter Your Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter Your Email Address"
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
            <input
              type="range"
              min="0"
              max="4"
              value={passwordStrength}
              readOnly
              style={{ width: "100%", marginTop: "5px" }}
            />
            <small>
              {passwordStrength <= 1
                ? "Weak"
                : passwordStrength === 2
                ? "Medium"
                : passwordStrength === 3
                ? "Strong"
                : "Very Strong"}
            </small>
          </div>

          <div className="form-group">
            <select
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="nationalId"
              className="form-input"
              placeholder="Enter Your National ID"
              value={formData.nationalId}
              onChange={handleChange}
              maxLength="14"
              required
            />
          </div>

          {formData.role === "student" && (
            <div className="form-group">
              <input
                type="text"
                name="grade"
                className="form-input"
                placeholder="Enter Your Grade"
                value={formData.grade}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Signup;
