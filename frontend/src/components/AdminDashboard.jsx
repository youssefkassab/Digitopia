import React from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSlider from "./AdminSlider";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="dashboard-page">
      {/* Navbar */}
      <AdminNavbar />

      {/* Content */}
      <div className="dashboard-content">
        <h2 className="section-title">Latest Announcements</h2>
        <AdminSlider />
      </div>
    </div>
  );
};

export default AdminDashboard;
