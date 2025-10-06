import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logos/3Q-Logo.svg";
import DarkLogo from "../assets/Logos/Dark_3lm_Quest_Logo.png";
import { getStoredUser, getCurrentUser, logout } from "../services/auth";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { searchQuery } from "../services/searchService";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const { t } = useTranslation();
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
  const [menuOpen, setMenuOpen] = useState(false);

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
      console.error(t("logout.error"), err);
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
            setError(
              err.error ||
                err.message ||
                t("navbar.error", { error: err.message })
            );
          } finally {
            setLoading(false);
          }
        }, 600);
      };
    })(),
    [t]
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

        {/* === Hamburger (visible only on small devices) === */}
        <button
          className={`glass-btn round-btn hamburger-btn ${
            menuOpen ? "active" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* === Nav Links === */}
        <ul className={`nav-bar ${menuOpen ? "open" : ""}`}>
          {[
            { to: "/classroom", label: t("navbar.links.classroom") },
            { to: "/courses", label: t("navbar.links.courses") },
            { to: "/Games", label: t("navbar.links.games") },
            { to: "/community", label: t("navbar.links.community") },
            { to: "/about", label: t("navbar.links.about") },
            { to: "/support", label: t("navbar.links.support") },
            { to: "/questro", label: t("navbar.links.questro") },
          ].map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={location.pathname === to ? "active" : ""}
                id="nav-tabs"
                onClick={() => setMenuOpen(false)} // close menu on click
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
            aria-label={t("navbar.search")}
          >
            <FaSearch size={18} />
          </button>

          <button
            className={`glass-btn round-btn theme-toggle ${
              darkMode ? "active" : ""
            }`}
            onClick={() => setDarkMode(!darkMode)}
            aria-label={t("navbar.toggleTheme")}
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {user ? (
            <div className="user-controls">
              <motion.button
                className="glass-btn round-btn profile-btn"
                onClick={() => navigate("/Dashboard")}
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
                {t("navbar.logout")}
              </motion.button>
            </div>
          ) : (
            <Link to="/Signup" className="signup-btn">
              {t("navbar.signUp")}
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
                placeholder={t("navbar.searchPlaceholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowSearchOverlay(false)}
                aria-label={t("navbar.close")}
              >
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
              {loading && (
                <p className="search-status">{t("navbar.searching")}</p>
              )}
              {error && (
                <p className="search-error">{t("navbar.error", { error })}</p>
              )}
              {!loading && !error && results.length === 0 && query && (
                <p className="search-status">{t("navbar.noResults")}</p>
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
                      {res.subject} — {t("classroom.progress.label")}{" "}
                      {res.grade} — Score: {res.score?.toFixed(3) ?? "?"}
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
