import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { getCurrentUser, getStoredUser } from "../services/auth";
import { Helmet } from "react-helmet-async";

const STORAGE_PREFIX = "classroom_progress_";

const Dashboard = () => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const freshUser = await getCurrentUser();
        setUser(freshUser);

        // load persisted progress if available
        if (freshUser?.id) {
          const raw = localStorage.getItem(STORAGE_PREFIX + freshUser.id);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (typeof parsed.progress === "number") {
                setProgressPercent(parsed.progress);
              }
            } catch (err) {
              localStorage.removeItem(STORAGE_PREFIX + freshUser.id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const persistProgress = useCallback(
    (percent) => {
      if (!user?.id) return;
      const existing = localStorage.getItem(STORAGE_PREFIX + user.id);
      let payload = { unlockedLessons: [1], progress: percent };
      try {
        if (existing) payload = { ...JSON.parse(existing), progress: percent };
      } catch {
        /* ignore parse errors */
      }
      localStorage.setItem(STORAGE_PREFIX + user.id, JSON.stringify(payload));
    },
    [user]
  );

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
    <>
      <Helmet>
        <title>Dashboard | 3lm Quest</title>
      </Helmet>

      <motion.div
        className="dashboard-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left column */}
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

          {/* Replace Card1 + Card2 with Progress Bar */}
          <motion.div
            className="dashboard-card progress-card"
            whileHover={{ scale: 1.03 }}
          >
            <h2>Course Progress</h2>
            <div className="progress-block" title="Your coursework progress">
              <div className="progress-label">Overall Progress</div>
              <div className="progress-bar-outer" aria-hidden>
                <div
                  className="progress-bar-inner"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="progress-percent">{progressPercent}%</div>
            </div>
          </motion.div>
        </div>

        {/* Right column */}
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
    </>
  );
};

export default Dashboard;
