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

  // === HANDLE THEME TOGGLE ===
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // === FETCH CURRENT USER ===
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        const currentUser = await getCurrentUser(); // calls /api/users/user
        if (currentUser && currentUser.email) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
        setUser(null);
        localStorage.removeItem("user");
      }
    };

    fetchUser();
  }, [location.pathname]); // recheck user when navigating

  // === LOGOUT HANDLER ===
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    }
  };

  // === SEARCH HANDLER ===
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", query);
    setShowSearchOverlay(false);
  };

  return (
    <>
      <nav className="glassy-navbar">
        {/* === Logo === */}
        <Link to="/" className="nav-logo">
          <img
            src={darkMode ? DarkLogo : Logo}
            alt="Website Logo"
            className="logo-img"
          />
        </Link>

        {/* === Nav Links === */}
        <ul className="nav-bar">
          {[
            { to: "/Classroom", label: "Classroom" },
            { to: "/Courses", label: "Courses" },
            { to: "/Community", label: "Community" },
            { to: "/About", label: "About Us" },
            { to: "/Contact", label: "Contact Us" },
            { to: "/AI", label: "Talk to Questro" },
          ].map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={location.pathname === to ? "active" : ""}
                id="nav-tabs"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* === Actions (Search / Theme / User) === */}
        <div className="nav-actions">
          {/* Search */}
          <button
            className="glass-btn round-btn"
            onClick={() => setShowSearchOverlay(true)}
            aria-label="Search"
          >
            <FaSearch size={18} />
          </button>

          {/* Theme toggle */}
          <button
            className={`glass-btn round-btn theme-toggle ${
              darkMode ? "active" : ""
            }`}
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* User / Auth */}
          {user ? (
            <div className="user-controls">
              <motion.button
                className="glass-btn round-btn profile-btn"
                onClick={() => navigate("/Dashboard")}
                title={`${user.name} (${user.role})`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserCircle size={22} />
              </motion.button>

              <motion.button
                className="glass-btn logout-btn"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <Link to="/Signup" className="signup-btn">
              Sign Up
            </Link>
          )}
        </div>
      </nav>

      {/* === Search Overlay === */}
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
