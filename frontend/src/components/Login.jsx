import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login } from "../services/auth";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import "../index.css";

const Login = () => {
  const { t } = useTranslation();

  const steps = [t("login.steps.0"), t("login.steps.1")];
  const stepMessages = [t("login.stepMessages.0"), t("login.stepMessages.1")];

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      setError(t("login.errors.invalidStep", { field: steps[step] }));
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
    setLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
      }
      if (res?.adminToken) {
        localStorage.setItem("adminToken", res.adminToken);
      }
      window.location.href = "/dashboard";
    } catch (err) {
      const message =
        err?.error ||
        err?.message ||
        err?.details?.[0]?.message ||
        t("login.errors.loginFailed");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // === Step Fields ===
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <input
            type="email"
            name="email"
            placeholder={t("login.placeholders.email")}
            value={formData.email}
            onChange={handleChange}
          />
        );
      case 1:
        return (
          <input
            type="password"
            name="password"
            placeholder={t("login.placeholders.password")}
            value={formData.password}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step < steps.length - 1) nextStep();
      else handleSubmit(e);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("login.title")}</title>
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
                {t("login.stepCounter", {
                  current: step + 1,
                  total: steps.length,
                })}
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
                  {t("login.buttons.back")}
                </button>
              )}
              {step < steps.length - 1 ? (
                <button type="button" className="btn" onClick={nextStep}>
                  {t("login.buttons.next")}
                </button>
              ) : (
                <button type="submit" className="btn" disabled={loading}>
                  {loading
                    ? t("login.buttons.submitting")
                    : t("login.buttons.submit")}
                </button>
              )}
            </div>
          </form>

          <p className="LoginLink">
            {t("login.links.signup").split(/[|]/)[0]}{" "}
            <Link to="/signup">{t("login.links.signup").split(/[|]/)[1]}</Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Login;
