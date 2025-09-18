import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TextType from "../assets/Animations/TextType";
import {
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/messages";

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
  const [chatMessages, setChatMessages] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // === Fetch chat history (user’s own messages + admin replies) ===
  const fetchMyMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/my`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // user must be logged in
        },
      });
      if (!res.ok) throw new Error("Failed to load chat history");
      const data = await res.json();
      setChatMessages(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchMyMessages();
  }, [refresh]);

  // === Validation before sending ===
  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!senderEmail || !content) return "All Fields Are Required";
    if (!emailRegex.test(senderEmail)) return "Invalid Email Format";
    const domain = senderEmail.split("@")[1]?.toLowerCase();
    if (!ALLOWED_DOMAINS.includes(domain)) return "Enter A Valid Email Address";
    if (content.length < 10)
      return "Message Should Be At Least 10 Characters Long";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    const errorMsg = validateInput();
    if (errorMsg) return setFeedback({ type: "error", message: errorMsg });

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderEmail, content }),
      });

      let data = {};
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!response.ok)
        throw new Error(data.error || `Failed (${response.status})`);

      setFeedback({ type: "success", message: "Message Sent Successfully!" });
      setSenderEmail("");
      setContent("");
      setRefresh(!refresh); // refresh chat history
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | 3lm Quest</title>
      </Helmet>
      <motion.div
        className="page-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <TextType
          text={["Get In Touch Through"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          className="TextType"
        />

        {/* Contact Info & Form */}
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
            <a href="mailto:edudevexperts@email.com" className="email-link">
              <Mail size={20} /> edudevexperts@gmail.com
            </a>

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

        {/* === Chat Banner Section === */}
        <motion.div
          className="chat-banner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="chat-title">💬 Support Chat</h3>
          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <p className="empty-chat">
                No messages yet. Start the conversation!
              </p>
            ) : (
              chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`chat-bubble ${
                    msg.admin_reply ? "admin" : "user"
                  }`}
                  initial={{ opacity: 0, x: msg.admin_reply ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p>
                    <strong>{msg.admin_reply ? "Admin" : "You"}:</strong>{" "}
                    {msg.admin_reply || msg.content}
                  </p>
                  <small>{new Date(msg.message_date).toLocaleString()}</small>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ContactUs;
