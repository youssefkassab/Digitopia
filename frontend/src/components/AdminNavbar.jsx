
import { Link } from "react-router-dom";
import Logo from "../assets/Logos/3Q-Logo.svg";

const AdminNavbar = () => {


  return (
    <nav className="navbar">
      <div></div>

      {/* Logo */}
      <Link to="/admin">
        <img
          src={Logo}
          alt="Admin Logo"
          style={{ width: "120px", height: "120px" }}
        />
      </Link>

      {/* Navigation links */}
      <div className="nav-links">
        <Link to="/admin" className="nav-link">
          Dashboard
        </Link>
        <Link to="/admin/students" className="nav-link">
          Students
        </Link>
        <Link to="/admin/lessons" className="nav-link">
          Lessons
        </Link>
        <Link to="/admin/ai" className="nav-link">
          AI Tools
        </Link>
      </div>
    </nav>
  );
};

export default AdminNavbar;
