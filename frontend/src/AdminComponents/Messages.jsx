import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import adminApi from "../AdminServices/adminApi"; // axios instance with admin token

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [actionLoading, setActionLoading] = useState({}); // track individual message actions

  // 📨 Fetch all messages (Admin endpoint)
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/messages/receiveAll");
      setMessages(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 👁️ Mark message as seen
  const handleMarkSeen = async (id) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: "seen" }));
      await adminApi.patch("/messages/seen", { id });
      await fetchMessages();
    } catch (err) {
      console.error("❌ Failed to mark message as seen:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  // 💬 Send reply (using PATCH /messages/update if admin wants to modify content or send response)
  const handleReply = async (id) => {
    const reply = replyText[id]?.trim();
    if (!reply) return;
    try {
      setActionLoading((prev) => ({ ...prev, [id]: "reply" }));
      await adminApi.patch("/messages/update", {
        id,
        content: reply,
      });
      setReplyText((prev) => ({ ...prev, [id]: "" }));
      await fetchMessages();
    } catch (err) {
      console.error("❌ Failed to send reply:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  // 🗑️ Delete message (admin or owner)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    try {
      setActionLoading((prev) => ({ ...prev, [id]: "delete" }));
      await adminApi.delete("/messages/delete", { data: { id } });
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error("❌ Failed to delete message:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  return (
    <motion.div
      className="p-6 flex flex-col gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-semibold text-center">
        📨 Admin Messages Center
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-500">No messages found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`rounded-xl p-4 shadow-lg border transition ${
                msg.seen
                  ? "bg-gray-100 border-gray-200"
                  : "bg-white border-blue-200"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <p>
                <strong>From:</strong> {msg.sender}
              </p>
              <p className="mt-2 break-words">
                <strong>Message:</strong> {msg.content}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Date:</strong>{" "}
                {new Date(msg.message_date).toLocaleString()}
              </p>

              {/* Reply Section */}
              <div className="mt-3 flex flex-col gap-2">
                <textarea
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Write a reply or update content..."
                  value={replyText[msg.id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [msg.id]: e.target.value,
                    }))
                  }
                />

                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => handleReply(msg.id)}
                    disabled={actionLoading[msg.id] === "reply"}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-md"
                  >
                    {actionLoading[msg.id] === "reply"
                      ? "Sending..."
                      : "Send Reply"}
                  </button>

                  <button
                    onClick={() => handleMarkSeen(msg.id)}
                    disabled={actionLoading[msg.id] === "seen"}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-md"
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
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-md"
                  >
                    {actionLoading[msg.id] === "delete"
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Messages;
