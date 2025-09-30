import React, { useState } from "react";
import { logout } from "../services/auth";
import { useTranslation } from "react-i18next";

const Logout = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout(); // Calls /api/users/logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (err) {
      const message =
        err?.error ||
        err?.message ||
        err?.details?.[0]?.message ||
        t("logout.error"); // Translated fallback
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogout} disabled={loading} className="btn">
        {loading ? t("logout.loading") : t("logout.button")}
      </button>
    </div>
  );
};

export default Logout;
