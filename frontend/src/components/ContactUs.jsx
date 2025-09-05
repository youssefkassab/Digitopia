import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";

// Use the backend server URL directly (default: http://localhost:3000)
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/messages";

// Allowed email domains
const ALLOWED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "live.com",
  "outlook.com",
];

const ContactUs = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Validation before sending
  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!senderEmail || !content) {
      return "All Fields Are Required";
    }

    if (!emailRegex.test(senderEmail)) {
      return "Invalid Email Format";
    }

    const domain = senderEmail.split("@")[1]?.toLowerCase();
    if (!ALLOWED_DOMAINS.includes(domain)) {
      return "Enter A Valid Email Address";
    }

    if (content.length < 10) {
      return "Message Should Be At Least 10 Characters Long";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    const errorMsg = validateInput();
    if (errorMsg) {
      return setFeedback({ type: "error", message: errorMsg });
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderEmail, content }),
      });

      // Safely parse JSON only if there is content
      let data = {};
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error || `Failed (${response.status})`);
      }

      setFeedback({ type: "success", message: "Message Sent Successfully!" });
      setSenderEmail("");
      setContent("");
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="contact-wrapper"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <motion.div
          className="ContactCard"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 style={{ textAlign: "center" }}>Get In Touch Through</h2>

          {/* Email link */}
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

          {/* Send Message Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="message-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value.trim())}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="content">Your Message</label>
            <textarea
              id="content"
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your message..."
              required
            />

            <motion.button
              type="submit"
              className="send-btn"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {loading ? "Sending..." : "Send Message"} <Send size={18} />
            </motion.button>
          </motion.form>

          {/* Feedback message */}
          {feedback.message && (
            <motion.div
              className={`feedback ${feedback.type}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {feedback.message}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactUs;
