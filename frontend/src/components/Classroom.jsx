import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaLock,
  FaCheckCircle,
  FaGamepad,
} from "react-icons/fa";

/**
 * NOTE:
 * - The component expects `getCurrentUser()` to return the user object (with `id`, `name`, `email`, ...).
 * - Progress is persisted in localStorage under key `classroom_progress_<userId>`.
 * - Game navigation goes to `/game/:lessonId`. Create that route in your app or adjust as needed.
 */

const lessonsData = [
  {
    id: 1,
    title: "Bending Light",
    parts: [
      "What is Science?",
      "The Scientific Method",
      "Observation vs Experiment",
    ],
    thumbnail: "thumbnails/BendingLight.png",
  },
  {
    id: 2,
    title: "Physics Fundamentals",
    parts: ["Motion & Force", "Energy & Work", "Newton’s Laws"],
    thumbnail: "/assets/thumbnails/physics.jpg",
  },
  {
    id: 3,
    title: "Chemistry Basics",
    parts: ["Atoms & Molecules", "Chemical Reactions", "Periodic Table"],
    thumbnail: "/assets/thumbnails/chemistry.jpg",
  },
  {
    id: 4,
    title: "Biology Essentials",
    parts: ["Cells", "Genetics", "Evolution & Ecosystems"],
    thumbnail: "/assets/thumbnails/biology.jpg",
  },
];

const STORAGE_PREFIX = "classroom_progress_"; // saved per-user

const Classroom = () => {
  const [user, setUser] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [unlockedLessons, setUnlockedLessons] = useState([1]); // by default only lesson 1 unlocked
  const [progressPercent, setProgressPercent] = useState(0);
  const navigate = useNavigate();

  // load user & persisted progress
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.email) {
          navigate("/login");
          return;
        }
        setUser(currentUser);

        // load persisted progress for this user
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
          } catch (e) {
            // ignore parse errors
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

  // Utility: persist to localStorage
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

  // toggle expansion only if lesson unlocked
  const toggleLesson = (id) => {
    if (!unlockedLessons.includes(id)) return; // locked
    setExpandedLesson((prev) => (prev === id ? null : id));
  };

  // mark as completed: unlock next lesson, update progress
  const markAsCompleted = (id) => {
    const nextId = id + 1;
    setUnlockedLessons((prev) => {
      if (prev.includes(nextId)) return prev;
      const updated = [...prev, nextId].sort((a, b) => a - b);
      // compute percent: unlockedLessons / totalLessons
      const percent = Math.round((updated.length / lessonsData.length) * 100);
      setProgressPercent(percent);
      persistProgress(updated, percent);
      return updated;
    });
  };

  // navigate to game and persist progress before leaving
  const goToGame = (lessonId) => {
    // ensure lesson is unlocked
    if (!unlockedLessons.includes(lessonId)) return;
    // Save current progress snapshot
    persistProgress(unlockedLessons, progressPercent);
    // navigate to game route (adjust if needed)
    navigate(`/game/${lessonId}`);
  };

  // recalc percent when unlockedLessons changes (safe guard)
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
        Welcome, {user?.name?.split(" ")[0] || "Learner"} — Classroom
      </motion.h1>

      <div className="classroom-top">
        <div
          className="progress-block"
          title="Your coursework progress (saved)"
        >
          <div className="progress-label">Course Progress</div>
          <div className="progress-bar-outer" aria-hidden>
            <div
              className="progress-bar-inner"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="progress-percent">{progressPercent}%</div>
        </div>
      </div>

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
                      {isUnlocked ? `${lesson.parts.length} parts` : "Locked"}
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
                        // prevent header click double-fire
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

                      {/* Thumbnail + Game Card */}
                      <div className="game-card">
                        <div className="thumb-wrap">
                          {/* If thumbnail path exists use it, otherwise use placeholder */}
                          <img
                            src={
                              lesson.thumbnail ||
                              "/assets/thumbnails/placeholder.jpg"
                            }
                            alt={`${lesson.title} thumbnail`}
                            className="game-thumb"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/assets/thumbnails/placeholder.jpg";
                            }}
                          />
                        </div>
                        <div className="game-meta">
                          <div className="game-title">
                            {lesson.title} — Mini Game
                          </div>
                          <p className="game-desc">
                            A short, interactive exercise to reinforce this
                            lesson's ideas.
                          </p>
                          <div className="game-actions">
                            <button
                              className="game-btn"
                              onClick={() => goToGame(lesson.id)}
                              disabled={!isUnlocked}
                              aria-disabled={!isUnlocked}
                            >
                              <FaGamepad className="game-icon" /> Play Game
                            </button>
                            {!isCompleted && (
                              <button
                                className="complete-small"
                                onClick={() => markAsCompleted(lesson.id)}
                              >
                                Mark Lesson Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
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
