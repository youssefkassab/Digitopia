import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Mail, Send, Trash2, User, Shield, Check, X } from "lucide-react";
import TextType from "../assets/Animations/TextType";
import { useTranslation } from "react-i18next";

// Easy switching between localhost and production
// Change this to switch between environments:
// const USE_PRODUCTION = false; // localhost
// const USE_PRODUCTION = true;  // hemex.ai

const USE_PRODUCTION = false; // Set to true for hemex.ai, false for localhost

const API_BASE = USE_PRODUCTION
  ? "https://hemex.ai:3001/api"
  : "http://localhost:3001/api";

console.log(`🔗 Contact API Mode: ${USE_PRODUCTION ? 'PRODUCTION (hemex.ai)' : 'DEVELOPMENT (localhost)'}`);

const ContactUs = () => {
  const { t } = useTranslation();

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canSend, setCanSend] = useState(true);

  const messagesEndRef = useRef(null);

  // ------------------ Safe JSON parse ------------------
  const safeJsonParse = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text; // return raw text if not JSON
    }
  };

  // ------------------ Fetch Current User ------------------
  useEffect(() => {
    if (!token) {
      setFeedback(t("contactUs.feedback.notLoggedIn"));
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Authentication failed");
        }

        const data = await safeJsonParse(res);
        if (typeof data !== "object") throw new Error("Invalid user data");
        setUser(data);
      } catch (err) {
        console.error("User Fetch Error:", err);
        setFeedback(t("contactUs.feedback.authFailed"));
      }
    };

    fetchUser();
  }, [token, t]);

  // ------------------ Fetch Messages ------------------
  const fetchMessages = async () => {
    if (!user) return;

    try {
      const endpoint =
        user.role.toLowerCase() === "admin"
          ? `${API_BASE}/messages/MyMessages`
          : `${API_BASE}/messages/MyMessages`; // adjust for user endpoint if needed

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch messages");
      }

      const data = await safeJsonParse(res);
      if (!Array.isArray(data)) throw new Error("Unexpected server response");

      setMessages(
        data.map((msg, index) => ({
          id: msg.id ?? index,
          sender: msg.sender ?? "unknown",
          content: msg.content ?? "",
          seen: msg.seen ?? 0,
          message_time: msg.message_time ?? msg.message_date ?? null,
        }))
      );

      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Message Fetch Error:", err);
      setFeedback(`⚠️ ${t("contactUs.feedback.fetchFail")}: ${err.message}`);
    }
  };

  useEffect(() => {
    if (user) fetchMessages();
  }, [user]);

  // ------------------ Handle Send ------------------
  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim())
      return setFeedback(t("contactUs.feedback.writeMessage"));
    if (!canSend) return setFeedback(t("contactUs.feedback.waitBeforeSend"));
    if (!user?.email) return setFeedback(t("contactUs.feedback.notLoggedIn"));
    if (content.length > 5000)
      return setFeedback("Message too long (max 5000 chars)");
    if (!token) return setFeedback(t("contactUs.feedback.notLoggedIn"));

    setCanSend(false);
    setTimeout(() => setCanSend(true), 8000);
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`${API_BASE}/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderEmail: user.email,
          content: content.trim(),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to send message");
      }

      const data = await safeJsonParse(res);
      setContent("");
      setFeedback(t("contactUs.feedback.sendSuccess"));
      await fetchMessages();
    } catch (err) {
      console.error("Send Error:", err);
      setFeedback(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Handle Delete ------------------
  const handleDelete = async (id) => {
    if (id === undefined || id === null)
      return setFeedback(t("contactUs.feedback.invalidId"));
    if (!window.confirm(t("contactUs.chat.deleteMessage"))) return;
    if (!token) return setFeedback(t("contactUs.feedback.notLoggedIn"));

    try {
      const res = await fetch(`${API_BASE}/messages/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || t("contactUs.feedback.deleteFail"));
      }

      const data = await safeJsonParse(res);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      setFeedback(t("contactUs.feedback.deleteSuccess"));
      setTimeout(fetchMessages, 400);
    } catch (err) {
      console.error("Delete Error:", err);
      setFeedback(`❌ ${err.message}`);
    }
  };

  // ------------------ UI ------------------
  return (
    <>
      <Helmet>
        <title>{t("contactUs.pageTitle")}</title>
      </Helmet>

      <motion.div
        className="contact-page"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <TextType
          text={[t("contactUs.heading")]}
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
              <h2>{t("contactUs.chat.supportChat")}</h2>
            </div>

            <div className="chat-messages">
              <AnimatePresence>
                {messages.length ? (
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
                          {msg.sender === user?.email
                            ? t("contactUs.chat.you")
                            : t("contactUs.chat.admin")}
                        </span>
                      </div>

                      <p>{msg.content}</p>

                      <div className="message-meta">
                        {msg.sender === user?.email ? (
                          <span className="seen-status">
                            {msg.seen ? (
                              <span className="seen">
                                <Check size={14} /> {t("contactUs.chat.seen")}
                              </span>
                            ) : (
                              <span className="unseen">
                                <X size={14} /> {t("contactUs.chat.unseen")}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="admin-reply-time">
                            {msg.message_time
                              ? new Date(msg.message_time).toLocaleString()
                              : t("contactUs.chat.adminReplyTime")}
                          </span>
                        )}

                        {(msg.sender === user?.email ||
                          user?.role === "admin") && (
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(msg.id)}
                            title={t("contactUs.chat.deleteMessage")}
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
                    {t("contactUs.chat.noMessages")}
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-form" onSubmit={handleSend}>
              <textarea
                rows="2"
                placeholder={t("contactUs.chat.typeMessagePlaceholder")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                maxLength={5000}
              />
              <motion.button
                type="submit"
                className="send-btn"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading
                  ? t("contactUs.chat.sending")
                  : t("contactUs.chat.sendButton")}{" "}
                <Send size={16} />
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
