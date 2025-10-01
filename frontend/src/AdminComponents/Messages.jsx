import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import adminApi from "../AdminServices/adminApi";
import { useTranslation } from "react-i18next";

const Messages = () => {
  const { t } = useTranslation();

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
    if (!window.confirm(t("Messages.confirmDelete"))) return;
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
      <h2>{t("Messages.heading")}</h2>

      {loading ? (
        <p>{t("Messages.loading")}</p>
      ) : messages.length === 0 ? (
        <p>{t("Messages.noMessages")}</p>
      ) : (
        <div className="messages-grid">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className="message-card"
              whileHover={{ scale: 1.02 }}
            >
              <p>
                <strong>{t("Messages.from")}</strong> {msg.sender}
              </p>
              <p>
                <strong>{t("Messages.message")}</strong> {msg.content}
              </p>
              <p className="text-sm text-gray-500">
                <strong>{t("Messages.date")}</strong>{" "}
                {new Date(msg.message_date).toLocaleString()}
              </p>

              <div className="message-actions">
                <a href={`mailto:${msg.sender}`} className="reply">
                  {t("Messages.actions.reply")}
                </a>

                <button
                  onClick={() => handleMarkSeen(msg.id)}
                  disabled={actionLoading[msg.id] === "seen"}
                  className="seen"
                >
                  {actionLoading[msg.id] === "seen"
                    ? t("Messages.actions.marking")
                    : msg.seen
                    ? t("Messages.actions.seenDone")
                    : t("Messages.actions.seen")}
                </button>

                <button
                  onClick={() => handleDelete(msg.id)}
                  disabled={actionLoading[msg.id] === "delete"}
                  className="delete"
                >
                  {actionLoading[msg.id] === "delete"
                    ? t("Messages.actions.deleting")
                    : t("Messages.actions.delete")}
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
