import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const ContactUs = () => {
  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="contact-wrapper">
        <div className="card">
          <h2 style={{ textAlign: "center" }}>Get In Touch Through</h2>

          {/* Email */}
          <a href="mailto:edudevexperts@email.com" className="email-link">
            <Mail size={20} />
            edudevexperts@gmail.com
          </a>

          {/* Social Icons */}
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactUs;
