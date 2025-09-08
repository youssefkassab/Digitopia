import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCurrentUser, getStoredUser } from "../services/auth";

const Dashboard = () => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const freshUser = await getCurrentUser();
        setUser(freshUser);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <motion.div
        className="dashboard-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-card loading-card">Loading user info...</div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        className="dashboard-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-card error-card">No user logged in</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Left column (top + bottom squares) */}
      <div className="dashboard-left">
        <motion.div
          className="dashboard-card card-top"
          whileHover={{ scale: 1.02 }}
        >
          <h1>Welcome, {user.name || "User"}!</h1>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>National Number:</strong> {user.national_number || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          {user.Grade && (
            <p>
              <strong>Grade:</strong> {user.Grade}
            </p>
          )}
        </motion.div>

        <div className="dashboard-bottom">
          <motion.div
            className="dashboard-card card-square"
            whileHover={{ scale: 1.03 }}
          >
            <h2>Card 1</h2>
          </motion.div>
          <motion.div
            className="dashboard-card card-square"
            whileHover={{ scale: 1.03 }}
          >
            <h2>Card 2</h2>
          </motion.div>
        </div>
      </div>

      {/* Right column (large vertical card) */}
      <motion.div
        className="dashboard-card card-large"
        whileHover={{ scale: 1.02 }}
      >
        <h2>Profile Info</h2>
        <p>
          <strong>Account Created:</strong>{" "}
          {new Date(user.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Last Updated:</strong>{" "}
          {new Date(user.updated_at).toLocaleString()}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
