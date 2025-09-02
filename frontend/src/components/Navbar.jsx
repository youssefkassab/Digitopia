import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logos/3Q-Logo.svg";

const Navbar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", query);
    // Add your search logic here
  };

  return (
    <nav className="navbar">
      <div></div>
      {/* Logo */}
      <a href="../App.jsx">
        <img
          src={Logo}
          alt="Website Logo"
          style={{ width: "120px", height: "120px" }}
        />
      </a>
      {/* Search bar */}
      <form className="nav-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            borderRadius: "8px",
            border: "1px solid #ddd",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            padding: "16px",
            width: "300px",
          }}
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
        <Link to="/Signup" className="nav-link">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
