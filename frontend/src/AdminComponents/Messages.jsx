import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import adminApi from "../AdminServices/adminApi";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/messages/receiveAll");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkSeen = async (id) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: "seen" }));
      await adminApi.patch("/messages/seen", { id });
      await fetchMessages();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    try {
      setActionLoading((prev) => ({ ...prev, [id]: "delete" }));
      await adminApi.delete("/messages/delete", { data: { id } });
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  return (
    <motion.div
      className="messages-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>Messages Center</h2>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="messages-grid">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className="message-card"
              whileHover={{ scale: 1.02 }}
            >
              <p>
                <strong>From:</strong> {msg.sender}
              </p>
              <p>
                <strong>Message:</strong> {msg.content}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Date:</strong>{" "}
                {new Date(msg.message_date).toLocaleString()}
              </p>

              <div className="message-actions">
                <a href={`mailto:${msg.sender}`} className="reply">
                  Reply
                </a>

                <button
                  onClick={() => handleMarkSeen(msg.id)}
                  disabled={actionLoading[msg.id] === "seen"}
                  className="seen"
                >
                  {actionLoading[msg.id] === "seen"
                    ? "Marking..."
                    : msg.seen
                    ? "Seen"
                    : "Mark Seen"}
                </button>

                <button
                  onClick={() => handleDelete(msg.id)}
                  disabled={actionLoading[msg.id] === "delete"}
                  className="delete"
                >
                  {actionLoading[msg.id] === "delete"
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Messages;
