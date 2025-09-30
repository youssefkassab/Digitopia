import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlurText from "../assets/Animations/BlurText";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const { t } = useTranslation();
  const [showCards, setShowCards] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const teamMembers = t("aboutUs.teamMembers", { returnObjects: true });

  // Auto-slide every 60s
  useEffect(() => {
    if (showCards) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [showCards, teamMembers.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  return (
    <>
      <Helmet>
        <title>{t("aboutUs.pageTitle")}</title>
      </Helmet>

      <BlurText
        text={t("aboutUs.blurText")}
        delay={150}
        animateBy="words"
        direction="top"
        className="BlurText"
      />

      <motion.div
        className="page-container"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="about-wrapper">
          <AnimatePresence mode="wait">
            {!showCards ? (
              <motion.div
                key="intro-card"
                className="intro-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6 }}
              >
                <h1>{t("aboutUs.introCard.title")}</h1>
                <h2>{t("aboutUs.introCard.subtitle")}</h2>
                <p>{t("aboutUs.introCard.description")}</p>
                <motion.button
                  className="intro-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCards(true)}
                >
                  {t("aboutUs.introCard.button")}
                </motion.button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <div className="slider-container">
                  {/* Left Arrow */}
                  <button onClick={handlePrev} className="arrow-btn left-arrow">
                    ←
                  </button>

                  {/* Card */}
                  <motion.div
                    key={currentIndex}
                    className="team-big-card"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <h1>{teamMembers[currentIndex].name}</h1>
                    <h2>{teamMembers[currentIndex].role}</h2>
                    <p>{teamMembers[currentIndex].desc}</p>
                  </motion.div>

                  {/* Right Arrow */}
                  <button
                    onClick={handleNext}
                    className="arrow-btn right-arrow"
                  >
                    →
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-container">
                  {teamMembers.map((_, i) => (
                    <div
                      key={i}
                      className={`progress-dot ${
                        i === currentIndex ? "active" : ""
                      }`}
                    />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default AboutUs;
