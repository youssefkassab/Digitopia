import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCurrentUser, getStoredUser } from "../services/auth";

const Dashboard = () => {
  const [user, setUser] = useState(getStoredUser()); // instant load from localStorage
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the latest user data from backend
    const fetchUser = async () => {
      try {
        const freshUser = await getCurrentUser();
        setUser(freshUser);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null); // user might be logged out or token invalid
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <motion.div
        className="page-container"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="card">
          <h1>Loading user info...</h1>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        className="page-container"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="card">
          <h1>No user logged in</h1>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="card">
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
        <p>
          <strong>Account Created:</strong>{" "}
          {new Date(user.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Last Updated:</strong>{" "}
          {new Date(user.updated_at).toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};

export default Dashboard;
