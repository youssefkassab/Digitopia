import React, { useState } from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="about-wrapper">
        <div className="card">
          <h1>Karim Abraham</h1>
          <h2>Team Leader & Frontend Developer</h2>
        </div>
        <div className="card">
          <h1>Youseff Kassab</h1>
          <h2>Project Manager & Backend Developer</h2>
        </div>
        <div className="card">
          <h1>Jana Yacoub</h1>
          <h2>Tester & Designer</h2>
        </div>
        <div className="card">
          <h1>Youseff Kassab</h1>
          <h2>AI Developer & Data Analyst</h2>
        </div>
        <div className="card">
          <h1>Ahmed Noaman</h1>
          <h2>Database & Frontend Developer</h2>
        </div>
        <div className="txt-banner"></div>
      </div>
    </motion.div>
  );
};

export default AboutUs;
