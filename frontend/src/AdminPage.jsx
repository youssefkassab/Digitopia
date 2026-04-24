import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import AdminNavbar from "./AdminComponents/AdminNavbar";
import Footer from "./components/Footer";
import AdminDashboard from "./AdminComponents/AdminDashboard";
import Students from "./AdminComponents/Students";
import Teachers from "./AdminComponents/Teachers";
import Messages from "./AdminComponents/Messages";
import CoursesManage from "./AdminComponents/CoursesManage";
import AdminCommunity from "./AdminComponents/AdminCommunity";
import Admins from "./AdminComponents/Admins";
import AdminProtectedRoute from "./AdminServices/AdminProtectedRoute";
import "./AdminPage.css";
import "./i18n";
import { useEffect } from "react";

function AdminRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Protected Admin Area */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <AdminProtectedRoute>
              <Students />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <AdminProtectedRoute>
              <Teachers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <AdminProtectedRoute>
              <CoursesManage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <AdminProtectedRoute>
              <Messages />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/community"
          element={
            <AdminProtectedRoute>
              <AdminCommunity />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/admins"
          element={
            <AdminProtectedRoute>
              <Admins />
            </AdminProtectedRoute>
          }
        />

        {/* Fallback for undefined admin routes */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function AdminPage() {
  const { t, i18n } = useTranslation(); // get translation + i18n instance

  // Handle language and direction
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div className="app-wrapper">
      <Helmet>
        <title>
          {t("AdminDashboard.pageTitle", "Admin Panel | 3lm Quest")}
        </title>
      </Helmet>

      <AdminNavbar />
      <main>
        <AdminRoutes />
      </main>
      <Footer />
    </div>
  );
}
