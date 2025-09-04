import React, {  useState } from "react";
import { Link} from "react-router-dom";
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
<h2>Welcome Admin</h2>
      {/* Logo */}
      <Link to="/">
        <img
          src={Logo}
          alt="Website Logo"
          style={{ width: "120px", height: "120px" }}
        />
      </Link>

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
          Manage Students
        </Link>
        <Link to="/" className="nav-link">
          Manage Lessons
        </Link>
        <Link to="/" className="nav-link">
          Manage Games
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
