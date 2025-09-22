import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logos/3Q-Logo.svg";
import DarkLogo from "../assets/Logos/Dark_3lm_Quest_Logo.png";
import { getStoredUser, getCurrentUser, logout } from "../services/auth";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
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
        <Link to="/" className="nav-logo">
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
              to="/Classroom"
              className={location.pathname === "/Classroom" ? "active" : ""}
              id="nav-tabs"
            >
              Classroom
            </Link>
          </li>
          <li>
            <Link
              to="/Courses"
              className={location.pathname === "/Courses" ? "active" : ""}
              id="nav-tabs"
            >
              Courses
            </Link>
          </li>
          <li>
            <Link
              to="/Community"
              className={location.pathname === "/Community" ? "active" : ""}
              id="nav-tabs"
            >
              Community
            </Link>
          </li>
          <li>
          </li>
          <li>
            <Link
              to="/About"
              className={location.pathname === "/About" ? "active" : ""}
              id="nav-tabs"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/Contact"
              className={location.pathname === "/Contact" ? "active" : ""}
              id="nav-tabs"
            >
              Contact Us
            </Link>
          </li>
              <Link
              to="/AI"
              className={location.pathname === "/AI" ? "active" : ""}
              id="nav-tabs"
            >
              Talk to Questro
            </Link>
        </ul>

        {/* Right-side controls */}
        <div className="nav-actions">
          {/* Search Button */}
          <button
            className="glass-btn round-btn"
            onClick={() => setShowSearchOverlay(true)}
          >
            <FaSearch size={18} />
          </button>

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
          ) : (
            <Link to="/Signup" className="signup-btn">
              Sign Up
            </Link>
          )}
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearchOverlay && (
          <motion.div
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleSearch}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="search-form"
            >
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button type="button" onClick={() => setShowSearchOverlay(false)}>
                ✕
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
