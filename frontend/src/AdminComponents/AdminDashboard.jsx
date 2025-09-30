import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import adminApi from "../AdminServices/adminApi";
import { getStoredAdmin } from "../AdminServices/adminAuth";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(getStoredAdmin());
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    admins: 0,
    courses: 0,
  });
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsRes, teachersRes, adminsRes, coursesRes, messagesRes] =
        await Promise.all([
          adminApi.get("/admin/students"),
          adminApi.get("/admin/teachers"),
          adminApi.get("/admin/admins"),
          adminApi.get("/courses/all"),
          adminApi.get("/messages/receiveAll"),
        ]);

      // Ensure data is arrays
      const students = Array.isArray(studentsRes.data) ? studentsRes.data : [];
      const teachers = Array.isArray(teachersRes.data) ? teachersRes.data : [];
      const admins = Array.isArray(adminsRes.data) ? adminsRes.data : [];
      const courses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
      const msgs = Array.isArray(messagesRes.data) ? messagesRes.data : [];

      setStats({
        students: students.length,
        teachers: teachers.length,
        admins: admins.length,
        courses: courses.length,
      });

      const today = new Date().toISOString().slice(0, 10);
      setLatestUsers(
        [...students, ...teachers, ...admins]
          .filter((u) => u.createdAt?.slice(0, 10) === today)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
      );

      setLatestCourses(
        courses
          .filter((c) => c.createdAt?.slice(0, 10) === today)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
      );

      setMessages(
        msgs
          .sort((a, b) => new Date(b.message_date) - new Date(a.message_date))
          .slice(0, 5)
      );
    } catch (err) {
      console.error("Dashboard fetch error:", err.response || err);
      setError("Failed to load dashboard data. Check backend routes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <motion.div
        className="admin-dashboard-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-card loading">Loading admin dashboard...</div>
      </motion.div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | 3lm Quest</title>
      </Helmet>

      <motion.div
        className="admin-dashboard-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="admin-left">
          <motion.div
            className="admin-card admin-top"
            whileHover={{ scale: 1.02 }}
          >
            <h1>Hi, {admin?.username || "Admin"} 👋</h1>
            <p className="subtext">Here’s today’s summary:</p>
            <button className="refresh-btn" onClick={fetchDashboardData}>
              🔄 Refresh
            </button>
          </motion.div>

          <div className="admin-bottom">
            {["students", "teachers", "admins", "courses"].map((key) => (
              <motion.div
                key={key}
                className="admin-card admin-square"
                whileHover={{ scale: 1.05 }}
              >
                <h2>{stats[key]}</h2>
                <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="admin-card latest-added"
            whileHover={{ scale: 1.02 }}
          >
            <h3>📌 Latest Added Today</h3>
            <ul>
              {latestUsers.map((u) => (
                <li key={u.id}>
                  {u.name || u.email} ({u.role})
                </li>
              ))}
              {latestCourses.map((c) => (
                <li key={c.id}>{c.name} (Course)</li>
              ))}
              {latestUsers.length === 0 && latestCourses.length === 0 && (
                <li>No new additions today.</li>
              )}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="admin-card admin-inbox"
          whileHover={{ scale: 1.01 }}
        >
          <h2>📩 Inbox</h2>
          {messages.length === 0 ? (
            <p>No new messages.</p>
          ) : (
            <ul className="inbox-list">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className={`inbox-item ${msg.seen ? "seen" : "unseen"}`}
                >
                  <div className="inbox-sender">
                    {msg.sender || msg.senderName}
                  </div>
                  <div className="inbox-content">
                    <span className="inbox-preview">{msg.content}</span>
                    <span className="inbox-time">
                      {new Date(msg.message_date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {error && <p className="error">{error}</p>}
      </motion.div>
    </>
  );
};

export default AdminDashboard;
