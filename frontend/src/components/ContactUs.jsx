// frontend/pages/ContactUs.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Mail, Send, User, Shield } from "lucide-react";
import TextType from "../assets/Animations/TextType";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/messages";

const ContactUs = () => {
  const [userEmail, setUserEmail] = useState("");
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === AUTH + Load current user's messages ===
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFeedback("Please log in to access chat.");
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/MyMessages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Message load failed:", err);
        setFeedback("Could not fetch your messages.");
      }
    };
    fetchMessages();
  }, []);

  // === SEND message ===
  const handleSend = async (e) => {
    e.preventDefault();
    if (!userEmail || !content.trim())
      return setFeedback("Email and message are required.");
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`${API_BASE}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderEmail: userEmail, content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setMessages((prev) => [...prev, data]);
      setContent("");
      setFeedback("✅ Message sent successfully!");
    } catch (err) {
      setFeedback(`❌ ${err.message}`);
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
        className="contact-page"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <TextType
          text={["Need Help? Chat With Our Admin"]}
          typingSpeed={70}
          pauseDuration={1000}
          showCursor
          cursorCharacter="|"
          className="contact-heading"
        />

        {/* Chat Container */}
        <div className="chat-container">
          <div className="chat-box">
            <div className="chat-header">
              <Mail size={22} />
              <h2>Messages</h2>
            </div>

            <div className="chat-messages">
              <AnimatePresence>
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`message-bubble ${
                        msg.sender === userEmail ? "user" : "admin"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bubble-header">
                        {msg.sender === userEmail ? (
                          <User size={16} />
                        ) : (
                          <Shield size={16} />
                        )}
                        <span>{msg.sender}</span>
                      </div>
                      <p>{msg.content}</p>
                      <span className="message-time">
                        {new Date(msg.message_time).toLocaleString()}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="no-messages"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No messages yet. Start a chat!
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Send Message Form */}
            <form className="chat-form" onSubmit={handleSend}>
              <input
                type="email"
                placeholder="Your Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value.trim())}
                required
              />
              <textarea
                rows="2"
                placeholder="Write your message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <motion.button
                type="submit"
                className="send-btn"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? "Sending..." : "Send"} <Send size={16} />
              </motion.button>
            </form>

            {/* Feedback Message */}
            {feedback && (
              <motion.div
                className="feedback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {feedback}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ContactUs;
