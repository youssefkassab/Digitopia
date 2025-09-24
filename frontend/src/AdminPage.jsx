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
import AdminLogout from "./AdminComponents/AdminLogout";
import AdminLogin from "./AdminComponents/AdminLogin";
import AdminSignup from "./AdminComponents/AdminSignup";
import "./AdminPage.css";

// Defining admin routes here
function AdminRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Landing page */}
        <Route
          path="/admin"
          element={
            <>
              <Helmet>
                <title>Admin | 3lm Quest</title>
                <meta
                  name="description"
                  content="Welcome to the Admin Dashboard of 3lm Quest"
                />
              </Helmet>
              <AdminDashboard />
            </>
          }
        />

        {/* Admin routes */}
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/teachers" element={<Teachers />} />
        <Route path="/admin/courses" element={<CoursesManage />} />
        <Route path="/admin/messages" element={<Messages />} />
        <Route path="/admin/community" element={<AdminCommunity />} />
        <Route path="/admin/admins" element={<Admins />} />

        {/* Auth routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/logout" element={<AdminLogout />} />

        {/* Catch-all */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
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
