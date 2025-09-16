import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import AdminNavbar from "./AdminComponents/AdminNavbar";
import Footer from "./components/Footer";
import AdminDashboard from "./AdminComponents/AdminDashboard";
import Students from "./AdminComponents/Students";
import Teachers from "./AdminComponents/Teachers";
import Messages from "./AdminComponents/Messages";
import CoursesManage from "./AdminComponents/CoursesManage";
import AdminCommunity from "./AdminComponents/AdminCommunity";
import Admins from "./AdminComponents/Admins";
import "./AdminPage.css";

// Defining admin routes here
function AdminRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing page */}
        <Route
          path="/"
          element={
            <>
              <Helmet>
                <title>Admin | 3lm Quest</title>
                <meta
                  name="description"
                  content="Welcome to the Admin Dashboard of 3lm Quest"
                />
              </Helmet>
              <h1>Welcome, Admin 🚀</h1>
              {/* Dashboard Components */}
              <AdminDashboard />
            </>
          }
        />

        {/* Admin routes */}
        <Route path="/Admin/Students" element={<Students />} />
        <Route path="/Admin/Teachers" element={<Teachers />} />
        <Route path="/Admin/Courses" element={<CoursesManage />} />
        <Route path="/Admin/Messages" element={<Messages />} />
        <Route path="/Admin/Community" element={<AdminCommunity />} />
        <Route path="/Admin/Admins" element={<Admins />} />

        {/* Catch-all */}
      </Routes>
    </AnimatePresence>
  );
}

// Main AdminPage layout
export default function AdminPage() {
  return (
    <div className="app-wrapper">
      <AdminNavbar />
      <main>
        {/* AdminRoutes */}
        <AdminRoutes />
      </main>
      <Footer />
    </div>
  );
}
