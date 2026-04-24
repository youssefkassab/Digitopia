import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logos/3Q-Logo.svg";
import DarkLogo from "../assets/Logos/Dark_3lm_Quest_Logo.png";
import {
  getStoredAdmin,
  isAdminAuthenticated,
} from "../AdminServices/adminAuth";
import { FaUserCircle } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import "../AdminPage.css";
import { useTranslation } from "react-i18next";

const AdminNavbar = () => {
  const { t } = useTranslation();
  const [admin, setAdmin] = useState(getStoredAdmin());
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    if (isAdminAuthenticated()) {
      setAdmin(getStoredAdmin());
    } else {
      setAdmin(null);
    }
  }, [darkMode]);

  return (
    <nav className="glassy-navbar">
      {/* Logo */}
      <Link to="/admin" className="nav-logo">
        <img
          src={darkMode ? DarkLogo : Logo}
          alt="Website Logo"
          className="logo-img"
        />
      </Link>

      {/* Navigation links */}
      <ul className="nav-bar">
        <li>
          <Link
            to="/admin/admins"
            className={location.pathname === "/admin/admins" ? "active" : ""}
            id="nav-tabs"
          >
            {t("AdminNavbar.admins")}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/teachers"
            className={location.pathname === "/admin/teachers" ? "active" : ""}
            id="nav-tabs"
          >
            {t("AdminNavbar.teachers")}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/students"
            className={location.pathname === "/admin/students" ? "active" : ""}
            id="nav-tabs"
          >
            {t("AdminNavbar.students")}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/community"
            className={location.pathname === "/admin/community" ? "active" : ""}
            id="nav-tabs"
          >
            {t("AdminNavbar.community")}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/courses"
            className={location.pathname === "/admin/courses" ? "active" : ""}
            id="nav-tabs"
          >
            {t("AdminNavbar.courses")}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/messages"
            className={location.pathname === "/admin/messages" ? "active" : ""}
            id="nav-tabs"
          >
            {t("AdminNavbar.messages")}
          </Link>
        </li>
      </ul>

      {/* Right-side controls */}
      <div className="nav-actions">
        {/* Dark mode toggle */}
        <button
          className={`glass-btn round-btn theme-toggle ${
            darkMode ? "active" : ""
          }`}
          onClick={() => setDarkMode(!darkMode)}
          aria-label={t("AdminNavbar.toggleDarkMode")}
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* Admin avatar display only */}
        {admin && (
          <div className="user-controls">
            <span className="hi-admin">
              {t("AdminNavbar.hiAdmin", { name: admin.name || "Admin" })}
            </span>
            <button
              className="glass-btn round-btn"
              onClick={() => navigate("/admin/dashboard")}
            >
              <FaUserCircle size={20} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
