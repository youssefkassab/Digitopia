import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { getCurrentUser, getStoredUser } from "../services/auth";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const STORAGE_PREFIX = "classroom_progress_";

const Dashboard = () => {
  const { t } = useTranslation();
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
        console.error(t("dashboard.loadingUser"), err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [t]);

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
        <div className="dashboard-card loading-card">
          {t("dashboard.loadingUser")}
        </div>
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
        <div className="dashboard-card error-card">{t("dashboard.noUser")}</div>
      </motion.div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {t("dashboard.welcome", {
            name: user.name || t("dashboard.anonymous"),
          })}
        </title>
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
            <h1>
              {t("dashboard.welcome", {
                name: user.name || t("dashboard.anonymous"),
              })}
            </h1>
            <p>
              <strong>{t("dashboard.profileInfo")}:</strong> {user.email}
            </p>
            <p>
              <strong>{t("dashboard.nationalId", "National Number")}:</strong>{" "}
              {user.national_number || "N/A"}
            </p>
            <p>
              <strong>{t("dashboard.role", "Role")}:</strong> {user.role}
            </p>
            {user.Grade && (
              <p>
                <strong>{t("dashboard.grade", "Grade")}:</strong> {user.Grade}
              </p>
            )}
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="dashboard-card progress-card"
            whileHover={{ scale: 1.03 }}
          >
            <h2>{t("dashboard.courseProgress")}</h2>
            <div
              className="progress-block"
              title={t("dashboard.overallProgress")}
            >
              <div className="progress-label">
                {t("dashboard.overallProgress")}
              </div>
              <div className="progress-bar-outer" aria-hidden>
                <div
                  className="progress-bar-inner"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="progress-percent">{progressPercent}%</div>
            </div>
          </motion.div>

          {/* Admin Page Card */}
          {user.role === "admin" && (
            <motion.div
              className="dashboard-card progress-card"
              whileHover={{ scale: 1.03 }}
              onClick={() => (window.location.href = "/admin")}
              style={{ cursor: "pointer" }}
            >
              <h2>{t("dashboard.adminDashboard")}</h2>
              <div className="progress-block" title={t("dashboard.enterAdmin")}>
                <div className="progress-label">
                  {t("dashboard.enterAdmin")}
                </div>
                <div className="progress-bar-outer" aria-hidden>
                  <div
                    className="progress-bar-inner"
                    style={{ width: `100%`, backgroundColor: "#4f46e5" }}
                  />
                </div>
                <div className="progress-percent">Go →</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right column */}
        <motion.div
          className="dashboard-card card-large"
          whileHover={{ scale: 1.02 }}
        >
          <h2>{t("dashboard.profileInfo")}</h2>
          <p>
            <strong>{t("dashboard.accountCreated") || "Account Created"}:</strong>{" "}
            {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
          </p>
          <p>
            <strong>{t("dashboard.lastUpdated") || "Last Updated"}:</strong>{" "}
            {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
          </p>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Dashboard;
