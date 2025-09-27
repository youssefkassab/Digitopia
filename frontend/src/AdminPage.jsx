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

/**
 * Render the admin section's route set and wrap route transitions in an animation controller.
 *
 * Renders routes for the admin dashboard, management pages (students, teachers, courses, messages,
 * community, admins), authentication pages (login, signup, logout), and a catch-all "Page Not Found".
 * Route transitions are keyed to the current location to enable enter/exit animations.
 *
 * @returns {JSX.Element} The routed admin UI wrapped with an animation provider for transitions.
 */
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

/**
 * Top-level layout for the admin interface that composes navigation, routed content, and footer.
 *
 * Renders the admin navigation bar at the top, the routed admin pages in the main area via AdminRoutes,
 * and the site footer at the bottom.
 *
 * @returns {JSX.Element} A React element containing the admin navbar, routed main content, and footer.
 */
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
