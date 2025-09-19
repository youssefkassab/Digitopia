import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logos/3Q-Logo.svg";
import DarkLogo from "../assets/Logos/Dark_3lm_Quest_Logo.png";
import { getStoredUser, getCurrentUser, logout } from "../services/auth";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "../AdminPage.css";

const AdminNavbar = () => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(getStoredUser());
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    const verifyUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    verifyUser();
  }, [darkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", query);
    setShowSearchOverlay(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  return (
    <>
      {/* Navbar */}
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
              to="/Admin/Admins"
              className={location.pathname === "/Admins" ? "active" : ""}
            >
              Admins
            </Link>
          </li>
          <li>
            <Link
              to="/Admin/Teachers"
              className={location.pathname === "/Teachers" ? "active" : ""}
            >
              Teachers
            </Link>
          </li>
          <li>
            <Link
              to="/Admin/Students"
              className={location.pathname === "/Students" ? "active" : ""}
            >
              Students
            </Link>
          </li>
          <li>
            <Link
              to="/Admin/Community"
              className={
                location.pathname === "/AdminCommunity" ? "active" : ""
              }
            >
              Community
            </Link>
          </li>
          <li>
            <Link
              to="/Admin/Courses"
              className={
                location.pathname === "/Courses Manage" ? "active" : ""
              }
            >
              Courses
            </Link>
          </li>
          <li>
            <Link
              to="/Admin/Messages"
              className={location.pathname === "/Messages" ? "active" : ""}
            >
              Messages
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
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* Auth buttons */}
          {user ? (
            <div className="user-controls">
              {/* User icon → Dashboard */}
              <button
                className="glass-btn round-btn"
                onClick={() => navigate("/Dashboard")}
              >
                <FaUserCircle size={20} />
              </button>
              <button onClick={handleLogout} className="glass-btn logout-btn">
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;
