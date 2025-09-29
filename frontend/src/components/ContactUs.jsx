import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Mail, Send, Trash2, User, Shield, Check, X } from "lucide-react"; // ✅ CHANGE: added icons for seen/unseen
import TextType from "../assets/Animations/TextType";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const ContactUs = () => {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [canSend, setCanSend] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFeedback("⚠️ Please log in to access your messages.");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("User not authenticated");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("User Fetch Error:", err);
        setFeedback("⚠️ Authentication failed. Please re-login.");
      }
    };
    fetchUser();
  }, []);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/messages/MyMessages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();

      const normalized = data.map((msg, index) => ({
        id: msg.id ?? msg.message_id ?? index,
        ...msg,
      }));
      setMessages(normalized);
    } catch (err) {
      console.error("Message Fetch Error:", err);
      setFeedback("❌ Failed to load messages.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return setFeedback("✉️ Please write a message.");
    if (!canSend) {
      return setFeedback(
        "⚠️ Please wait a few seconds before sending another message."
      );
    }

    setCanSend(false);
    setTimeout(() => setCanSend(true), 8000);
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`${API_BASE}/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: user.email,
          content,
        }),
      });

      let data;
      try {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { error: text };
        }
      } catch (err) {
        throw new Error("Failed to read server response");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message");
      }

      const newMessage = {
        id: data.id ?? Date.now(),
        sender: data.sender ?? user.email,
        content: data.content,
        message_time: data.message_time ?? new Date().toISOString(),
        seen: data.seen ?? 0, // ✅ CHANGE: ensure seen status exists
      };

      setMessages((prev) => [...prev, newMessage]);
      setContent("");
      setFeedback("✅ Message sent successfully!");
      setTimeout(fetchMessages, 300);
    } catch (err) {
      console.error("Send Error:", err);
      if (err.message.toLowerCase().includes("too many")) {
        setFeedback(
          "⚠️ You're sending messages too quickly. Please wait a moment before trying again."
        );
      } else {
        setFeedback(`❌ ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id && id !== 0) {
      console.error("Missing ID:", id);
      setFeedback("❌ Invalid message ID.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setFeedback("⚠️ Please log in first.");
        return;
      }

      const res = await fetch(`${API_BASE}/messages/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete message");

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      setFeedback("🗑️ Message deleted successfully.");
      setTimeout(fetchMessages, 300);
    } catch (err) {
      console.error("Delete Error:", err);
      setFeedback(`❌ ${err.message}`);
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
          text={["Need Help? Chat with Our Support"]}
          typingSpeed={70}
          pauseDuration={1000}
          showCursor
          cursorCharacter="|"
          className="contact-heading"
        />

        <div className="chat-container">
          <motion.div
            className="chat-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="chat-header">
              <Mail size={22} />
              <h2>Support Chat</h2>
            </div>

            <div className="chat-messages">
              <AnimatePresence>
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`message-bubble ${
                        msg.sender === user?.email ? "user" : "admin"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bubble-header">
                        {msg.sender === user?.email ? (
                          <User size={14} />
                        ) : (
                          <Shield size={14} />
                        )}
                        <span>
                          {msg.sender === user?.email ? "You" : "Admin"}
                        </span>
                      </div>

                      <p>{msg.content}</p>

                      <div className="message-meta">
                        {/* ✅ CHANGE: show Seen / Unseen instead of invalid date */}
                        {msg.sender === user?.email ? (
                          <span className="seen-status">
                            {msg.seen ? (
                              <span className="seen">
                                <Check size={14} /> Seen
                              </span>
                            ) : (
                              <span className="unseen">
                                <X size={14} /> Unseen
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="admin-reply-time">
                            {msg.message_time
                              ? new Date(msg.message_time).toLocaleString()
                              : "Admin replied"}
                          </span>
                        )}

                        {msg.sender === user?.email && (
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(msg.id)}
                            title="Delete message"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="no-messages"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No messages yet — start chatting below 💬
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-form" onSubmit={handleSend}>
              <textarea
                rows="2"
                placeholder="Type your message..."
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

            {feedback && (
              <motion.div
                className="feedback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {feedback}
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default ContactUs;
