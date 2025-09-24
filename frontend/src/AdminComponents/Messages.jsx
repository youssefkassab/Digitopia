import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import adminApi from "../AdminServices/adminApi";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await adminApi.get("/messages/all"); // ✅ admin token attached
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = async (id) => {
    if (!replyText[id]) return;
    setLoading(true);
    try {
      await adminApi.post(`/messages/reply/${id}`, { reply: replyText[id] }); // ✅ admin API
      setReplyText({ ...replyText, [id]: "" });
      fetchMessages();
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="messages-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="title">📨 Messages Center</h2>
      <div className="messages-list">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            className={`message-card ${msg.seen ? "seen" : "unseen"}`}
            whileHover={{ scale: 1.02 }}
          >
            <p>
              <strong>From:</strong> {msg.sender}
            </p>
            <p>
              <strong>Message:</strong> {msg.content}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(msg.message_date).toLocaleString()}
            </p>
            {msg.admin_reply && (
              <p className="reply">
                <strong>Reply:</strong> {msg.admin_reply}
              </p>
            )}

            <textarea
              placeholder="Write a reply..."
              value={replyText[msg.id] || ""}
              onChange={(e) =>
                setReplyText({ ...replyText, [msg.id]: e.target.value })
              }
            />
            <button onClick={() => handleReply(msg.id)} disabled={loading}>
              {loading ? "Sending..." : "Send Reply"}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Messages;
