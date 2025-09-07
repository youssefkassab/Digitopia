import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logos/3Q-Logo.svg";
import DarkLogo from "../assets/Logos/Dark_3lm_Quest_Logo.png";
import { getStoredUser, getCurrentUser, logout } from "../services/auth";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(getStoredUser());
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Apply saved theme on mount
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    // Verify token with API
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
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      navigate("/"); // redirect to home
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/">
        {darkMode ? (
          <img
            src={DarkLogo}
            alt="Dark Website Logo"
            style={{ width: "80px", height: "80px" }}
          />
        ) : (
          <img
            src={Logo}
            alt="Website Logo"
            style={{ width: "80px", height: "80px" }}
          />
        )}
      </Link>

      {/* Search bar */}
      <form className="nav-search" onSubmit={handleSearch}>
        <input
          className="search_txt_area"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {/* Navigation links */}
      <div className="nav-links">
        <Link to="/Classroom" className="nav-link">
          Classroom
        </Link>
        <Link to="/Courses" className="nav-link">
          Courses
        </Link>
        <Link to="/Community" className="nav-link">
          Community
        </Link>
        <Link to="/About" className="nav-link">
          About Us
        </Link>
        <Link to="/Contact" className="nav-link">
          Contact Us
        </Link>

        {/* Dark mode toggle */}
        <button
          className={`theme-toggle ${darkMode ? "active" : ""}`}
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          <span className="toggle-circle"></span>
        </button>

        {/* Auth buttons */}
        {user ? (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span>Hi, {user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="btn btn-small"
              style={{
                padding: "6px 12px",
                backgroundColor: "#ff4d4f",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/Signup" className="nav-link">
            Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
