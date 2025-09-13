import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlurText from "../assets/Animations/BlurText";
import { Helmet } from "react-helmet-async";

const teamMembers = [
  {
    name: "Karim Abraham",
    role: "Team Leader & Frontend Developer",
    desc: "Kareem Magdy is a dedicated full-stack developer and the team leader at EduDev Experts. With over two years of experience in web development, he brings together technical expertise, creative design, and a strong focus on collaboration. Kareem is passionate about guiding his team, driving projects forward, and creating impactful digital solutions that blend innovation with quality. Always eager to learn and grow, he strives to lead by example and inspire his team toward excellence.",
  },
  {
    name: "Youseff Kassab",
    role: "Project Manager & Backend Developer",
    desc: "Project Manager & Backend Developer at EduDev Experts. With over 2 years of experience in full-stack development and Programming Instructor, Youssef specializes in Node.js, Express, and MySQL, with strong knowledge of AI and web security. He leads the project’s technical direction and ensures smooth coordination between the team and platform vision.",
  },
  {
    name: "Jana Yacoub",
    role: "Tester & Designer",
    desc: "Talented designer , tester , and presenter with the EduDev Experts team. She brings creativity to life using Canva and Pinterest, crafting engaging visuals and delivering presentations that inspire and connect with audiences.",
  },
  {
    name: "Abdallah Maamoon",
    role: "AI Developer & Data Analyst",
    desc: "Professional software developer.With over two years experience in AI development, data cleaning and analysing and full stack development.With great knowledge in automation and has worked as programming Instructor.He is working in EduDev Experts team to make sure that each student has the full assistance around the 24 hour, 7 days per week with accuracy in answering questions higher that teacher accuracy.",
  },
  {
    name: "Ahmed Noaman",
    role: "Database & Frontend Developer",
    desc: "Frontend and Database Developer at EduDev Experts, He specializes in building scalable web applications using Node.js, Express, and MySQL, and brings a strong foundation in artificial intelligence to enhance functionality and performance.",
  },
];

const AboutUs = () => {
  const [showCards, setShowCards] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 60s
  useEffect(() => {
    if (showCards) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [showCards]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  return (
    <>
      <Helmet>
        <title>About Us | 3lm Quest</title>
      </Helmet>

      <BlurText
        text="Meet EduDev Experts Team Founders Of 3lm Quest"
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
                <h1>Our Creative Family</h1>
                <h2>Innovation, Passion & Teamwork</h2>
                <p>
                  We’re a diverse group of developers, designers, and dreamers,
                  all working together to create something wonderful. EduDev
                  Experts — Empowering Every Learner Founded in 2025 by Karim,
                  Youssef, Jana, Abdallah, and Ahmed, EduDev Experts launched
                  from a shared conviction: learning should be engaging,
                  equitable, and future-ready. The team debuted on the national
                  stage at the Digitopia Competition (2025), and has since been
                  building a learning ecosystem designed to serve every Egyptian
                  student and teacher — with a clear ambition to scale
                  worldwide. At our core we combine pedagogical insight,
                  thoughtful design, and modern technology to gamify learning,
                  spark curiosity, and scaffold real-world application. We
                  create adaptive courses, community-driven experiences, and
                  tools that support learners at every stage and age — from
                  early education to adult upskilling — and empower teachers
                  with practical resources and analytics that make teaching more
                  effective and joyful. EduDev Experts is more than a platform:
                  it’s an active, growing community where collaboration,
                  mentorship, and hands-on projects accelerate learning. We
                  focus on future-facing skills and meaningful application, so
                  learners walk away with knowledge they can use — not just
                  facts to memorize. Ambitious but grounded, EduDev Experts aims
                  to make high-quality, motivating education accessible to all.
                  Join us as we build a smarter, more inclusive learning future
                  — one course, one teacher, and one community at a time.
                </p>
                <motion.button
                  className="intro-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCards(true)}
                >
                  Meet our team →
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
