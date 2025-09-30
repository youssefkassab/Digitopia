import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaLock, FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const lessonsData = [
  {
    id: 1,
    title: "Bending Light",
    parts: [
      "What is Science?",
      "The Scientific Method",
      "Observation vs Experiment",
    ],
  },
  {
    id: 2,
    title: "Physics Fundamentals",
    parts: ["Motion & Force", "Energy & Work", "Newton’s Laws"],
  },
  {
    id: 3,
    title: "Chemistry Basics",
    parts: ["Atoms & Molecules", "Chemical Reactions", "Periodic Table"],
  },
  {
    id: 4,
    title: "Biology Essentials",
    parts: ["Cells", "Genetics", "Evolution & Ecosystems"],
  },
];

const STORAGE_PREFIX = "classroom_progress_";

const Classroom = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [unlockedLessons, setUnlockedLessons] = useState([1]);
  const [progressPercent, setProgressPercent] = useState(0);
  const navigate = useNavigate();

  // Load user and saved progress
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.email) {
          navigate("/login");
          return;
        }
        setUser(currentUser);

        const raw = localStorage.getItem(STORAGE_PREFIX + currentUser.id);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (
              Array.isArray(parsed.unlockedLessons) &&
              typeof parsed.progress === "number"
            ) {
              setUnlockedLessons(parsed.unlockedLessons);
              setProgressPercent(parsed.progress);
            }
          } catch {
            localStorage.removeItem(STORAGE_PREFIX + currentUser.id);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const persistProgress = useCallback(
    (unlocked, percent) => {
      if (!user?.id) return;
      const payload = { unlockedLessons: unlocked, progress: percent };
      try {
        localStorage.setItem(STORAGE_PREFIX + user.id, JSON.stringify(payload));
      } catch (e) {
        console.warn("Could not persist classroom progress:", e);
      }
    },
    [user]
  );

  const toggleLesson = (id) => {
    if (!unlockedLessons.includes(id)) return;
    setExpandedLesson((prev) => (prev === id ? null : id));
  };

  const markAsCompleted = (id) => {
    const nextId = id + 1;
    setUnlockedLessons((prev) => {
      if (prev.includes(nextId)) return prev;
      const updated = [...prev, nextId].sort((a, b) => a - b);
      const percent = Math.round((updated.length / lessonsData.length) * 100);
      setProgressPercent(percent);
      persistProgress(updated, percent);
      return updated;
    });
  };

  useEffect(() => {
    const pct = Math.round((unlockedLessons.length / lessonsData.length) * 100);
    setProgressPercent(pct);
    persistProgress(unlockedLessons, pct);
  }, [unlockedLessons, persistProgress]);

  return (
    <div className="classroom-container">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="classroom-title"
      >
        {t("classroom.welcome", {
          user: user?.name?.split(" ")[0] || t("classroom.anonymous"),
        })}
      </motion.h1>

      {/* Progress Bar */}
      <div className="classroom-top">
        <div className="progress-block" title={t("classroom.progress.tooltip")}>
          <div className="progress-label">{t("classroom.progress.label")}</div>
          <div className="progress-bar-outer" aria-hidden>
            <div
              className="progress-bar-inner"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="progress-percent">
            {t("classroom.progress.percent", { percent: progressPercent })}
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="lessons-list">
        {lessonsData.map((lesson, index) => {
          const isUnlocked = unlockedLessons.includes(lesson.id);
          const isExpanded = expandedLesson === lesson.id;
          const isCompleted = unlockedLessons.includes(lesson.id + 1);

          return (
            <motion.article
              key={lesson.id}
              className={`lesson-card ${isUnlocked ? "unlocked" : "locked"} ${
                isExpanded ? "expanded" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
            >
              <header
                className="lesson-header"
                onClick={() => toggleLesson(lesson.id)}
                role="button"
                aria-expanded={isExpanded}
                aria-disabled={!isUnlocked}
              >
                <div className="lesson-head-left">
                  {isUnlocked ? (
                    <FaCheckCircle
                      className={`status-icon ${
                        isCompleted ? "completed" : "in-progress"
                      }`}
                    />
                  ) : (
                    <FaLock className="status-icon locked-icon" />
                  )}
                  <div className="lesson-info">
                    <div className="lesson-title">{lesson.title}</div>
                    <div className="lesson-sub">
                      {isUnlocked
                        ? t("classroom.lesson.parts", {
                            count: lesson.parts.length,
                          })
                        : t("classroom.lesson.locked")}
                    </div>
                  </div>
                </div>

                <div className="lesson-head-right">
                  {isUnlocked && (
                    <motion.button
                      className="expand-btn"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                      aria-label={`Toggle ${lesson.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLesson(lesson.id);
                      }}
                    >
                      <FaChevronDown
                        className={`arrow-icon ${isExpanded ? "rotated" : ""}`}
                      />
                    </motion.button>
                  )}
                </div>
              </header>

              {/* Expanded Lesson Details */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    className="lesson-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="lesson-details">
                      <ul className="parts-list">
                        {lesson.parts.map((part, pIdx) => (
                          <li key={pIdx} className="lesson-part">
                            <span className="part-index">{pIdx + 1}.</span>
                            <span className="part-title">{part}</span>
                          </li>
                        ))}
                      </ul>

                      {!isCompleted && (
                        <button
                          className="complete-small"
                          onClick={() => markAsCompleted(lesson.id)}
                        >
                          {t("classroom.lesson.markComplete")}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
};

export default Classroom;
