import React, { useEffect, useState } from "react";
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
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, teachersRes, adminsRes, coursesRes, messagesRes] =
          await Promise.all([
            adminApi.get("/admin/students"),
            adminApi.get("/admin/teachers"),
            adminApi.get("/admin/admins"),
            adminApi.get("/courses/all"),
            adminApi.get("/messages/all"),
          ]);

        setStats({
          students: studentsRes.data.length,
          teachers: teachersRes.data.length,
          admins: adminsRes.data.length,
          courses: coursesRes.data.length,
        });

        // latest 3 messages
        setMessages(messagesRes.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching admin stats:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        {/* Left column */}
        <div className="admin-left">
          <motion.div
            className="admin-card admin-top"
            whileHover={{ scale: 1.02 }}
          >
            <h1>Hi, {admin?.username || "Admin"} 👋</h1>
            <p className="subtext">Here’s today’s summary:</p>
          </motion.div>

          <div className="admin-bottom">
            <motion.div
              className="admin-card admin-square"
              whileHover={{ scale: 1.05 }}
            >
              <h2>{stats.students}</h2>
              <p>Students</p>
            </motion.div>
            <motion.div
              className="admin-card admin-square"
              whileHover={{ scale: 1.05 }}
            >
              <h2>{stats.teachers}</h2>
              <p>Teachers</p>
            </motion.div>
          </div>
          <div className="admin-bottom">
            <motion.div
              className="admin-card admin-square"
              whileHover={{ scale: 1.05 }}
            >
              <h2>{stats.admins}</h2>
              <p>Admins</p>
            </motion.div>
            <motion.div
              className="admin-card admin-square"
              whileHover={{ scale: 1.05 }}
            >
              <h2>{stats.courses}</h2>
              <p>Courses</p>
            </motion.div>
          </div>
        </div>

        {/* Right column - Gmail style Inbox */}
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
                <li key={msg.id} className="inbox-item">
                  <div className="inbox-sender">
                    {msg.senderName || msg.sender}
                  </div>
                  <div className="inbox-content">
                    <span className="inbox-preview">{msg.content}</span>
                    <span className="inbox-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
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
      </motion.div>
    </>
  );
};

export default AdminDashboard;
