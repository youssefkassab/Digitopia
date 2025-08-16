import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/3Q-Logo.svg";

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
      <img
        src={Logo}
        alt="Website Logo"
        style={{ width: "120px", height: "120px" }}
      />

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
        <Link to="/" className="nav-link">
          tab1
        </Link>
        <Link to="/" className="nav-link">
          tab2
        </Link>
        <Link to="/" className="nav-link">
          tab3
        </Link>
        <Link to="/" className="nav-link">
          tab4
        </Link>
        <Link to="/signup" className="nav-link">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
