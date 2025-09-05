import React, { useState } from "react";
import AdminNavbar from "./components/AdminNavbar";
import FloatingIcons from "./components/FloatingIcons";
import AdminDashboard from "./components/AdminDashboard";
const AdminPage = () => {
  const [activeSection] = useState("dashboard");

  // Sections content
  const renderSection = () => {
    switch (activeSection) {
     case "dashboard":
  return <AdminDashboard />;;
      case "students":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Manage Students</h2>
            <p>Here you can view, add, or remove students.</p>
          </div>
        );
      case "lessons":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Manage Lessons</h2>
            <p>Here you can create and organize lessons.</p>
          </div>
        );
      case "ai":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">AI Tools</h2>
            <p>Manage AI features, models, and settings.</p>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold">Welcome Admin</h2>
            <p>Select a section from the navigation.</p>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      {/* Floating background */}
      <FloatingIcons />

      {/* Navbar */}
      <AdminNavbar />

      {/* Content */}
      <main className="flex-1 mt-6">{renderSection()}</main>
    </div>
  );
};

export default AdminPage;
