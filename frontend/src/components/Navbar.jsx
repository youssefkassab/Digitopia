import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logos/3Q-Logo.svg";
import DarkLogo from "../assets/Logos/Dark_3lm_Quest_Logo.png";
import { getStoredUser, getCurrentUser, logout } from "../services/auth";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import { searchQuery } from "../services/searchService";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(getStoredUser());
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // === THEME TOGGLE ===
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // === FETCH USER ===
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setUser(null);
        const currentUser = await getCurrentUser();
        if (currentUser?.email) {
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
  }, [location.pathname]);

  // === Keyboard shortcut ===
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setShowSearchOverlay(false);
      if (e.key === "/" && !showSearchOverlay) {
        e.preventDefault();
        setShowSearchOverlay(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showSearchOverlay]);

  // === LOGOUT ===
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

  // === SECURE LIVE SEARCH (DEBOUNCED) ===
  const debouncedSearch = useCallback(
    (() => {
      let timer;
      return (val) => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
          if (!val.trim()) return setResults([]);
          const safeQuery = val.trim().replace(/[<>$]/g, ""); // Prevent XSS/NoSQL injection
          setLoading(true);
          setError("");
          try {
            const token = localStorage.getItem("token");
            const res = await searchQuery(
              {
                question: safeQuery,
                grade: "6",
                subject: "Science",
                cumulative: false,
              },
              token
            );
            setResults(res || []);
          } catch (err) {
            console.error("Search error:", err);
            setError(err.error || err.message || "Failed to search");
          } finally {
            setLoading(false);
          }
        }, 600);
      };
    })(),
    []
  );

  // watch query input
  useEffect(() => {
    if (query.length > 1) debouncedSearch(query);
    else setResults([]);
  }, [query, debouncedSearch]);

  // === Result Click Handler ===
  const handleResultClick = (result) => {
    setShowSearchOverlay(false);
    setQuery("");
    setResults([]);
    alert(`You selected: ${result.idea_title || result.lesson_name}`);
    // Optionally navigate to relevant path, e.g.
    // navigate(`/courses/${result.subject}/${result.lesson_number}`);
  };

  return (
    <>
      <nav className="glassy-navbar">
        <Link to="/" className="nav-logo">
          <img
            src={darkMode ? DarkLogo : Logo}
            alt="Logo"
            className="logo-img"
          />
        </Link>

        <ul className="nav-bar">
          {[
            { to: "/classroom", label: "Classroom" },
            { to: "/courses", label: "Courses" },
            { to: "/games", label: "Games" },
            { to: "/community", label: "Community" },
            { to: "/about", label: "About Us" },
            { to: "/support", label: "Support" },
            { to: "/AI", label: "Talk to Quatro" },
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

        <div className="nav-actions">
          <button
            className="glass-btn round-btn"
            onClick={() => setShowSearchOverlay(true)}
            aria-label="Search"
          >
            <FaSearch size={18} />
          </button>

          <button
            className={`glass-btn round-btn theme-toggle ${
              darkMode ? "active" : ""
            }`}
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

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
            <motion.div
              className="search-form"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                placeholder="Search any concept or question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button type="button" onClick={() => setShowSearchOverlay(false)}>
                ✕
              </button>
            </motion.div>

            {/* Results Area */}
            <motion.div
              className="search-results-container"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {loading && <p className="search-status">🔍 Searching...</p>}
              {error && <p className="search-error">⚠️ {error}</p>}
              {!loading && !error && results.length === 0 && query && (
                <p className="search-status">No results found.</p>
              )}
              <ul className="search-results-list">
                {results.map((res, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleResultClick(res)}
                    className="search-result-item"
                  >
                    <strong>{res.idea_title || res.lesson_name}</strong>
                    <span>
                      {res.subject} — Grade {res.grade} — Score:{" "}
                      {res.score?.toFixed(3) ?? "?"}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
