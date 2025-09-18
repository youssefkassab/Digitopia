const db = require("../config/db");

class MessageController {
  static createMessage = (req, res) => {
    const { senderEmail, content } = req.body;

    if (!senderEmail || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO messages SET ?";
    const messageData = {
      sender: senderEmail,
      content,
      seen: false,
      message_date: new Date(),
    };

    db.query(query, messageData, function (err, results) {
      if (err) {
        return res.status(500).json({ error: "Failed to create message" });
      }
      res.status(201).json({ id: results.insertId, ...messageData });
    });
  };

  static getAllMessages = (req, res) => {
    db.query(
      "SELECT * FROM messages ORDER BY message_date DESC",
      (err, results) => {
        if (err)
          return res.status(500).json({ error: "Internal server error." });
        res.status(200).json(results);
      }
    );
  };

  static getAllUserMessages = (req, res) => {
    db.query(
      "SELECT * FROM messages WHERE sender = ? ORDER BY message_date ASC",
      [req.user.email],
      (err, results) => {
        if (err)
          return res.status(500).json({ error: "Internal server error." });
        res.status(200).json(results);
      }
    );
  };

  static MarkAsSeen = (req, res) => {
    const { id } = req.params;
    db.query("UPDATE messages SET seen = 1 WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).json({ error: "Internal server error." });
      res.status(200).json({ message: "Marked as seen" });
    });
  };

  static updateMessage = (req, res) => {
    const { id, content } = req.body;
    if (!id || !content) {
      return res.status(400).json({ error: "Content and ID are required." });
    }
    const messageData = {
      content,
      seen: false,
      message_date: new Date(),
    };
    db.query(
      "UPDATE messages SET ? WHERE id = ? AND sender = ?",
      [messageData, id, req.user.email],
      (err) => {
        if (err)
          return res.status(500).json({ error: "Internal server error." });
        res.status(200).json({ message: "Message updated successfully." });
      }
    );
  };

  static deleteMessage = (req, res) => {
    const { id } = req.params;
    let query = "DELETE FROM messages WHERE id = ? AND sender = ?";
    let values = [id, req.user.email];

    if (req.user.role === "admin") {
      query = "DELETE FROM messages WHERE id = ?";
      values = [id];
    }

    db.query(query, values, (err) => {
      if (err) return res.status(500).json({ error: "Internal server error." });
      res.status(200).json({ message: "Message deleted successfully." });
    });
  };

  static replyToMessage = (req, res) => {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ error: "Reply content is required." });
    }

    const query = `UPDATE messages 
                   SET admin_reply = ?, reply_date = NOW(), seen = 0 
                   WHERE id = ?`;
    db.query(query, [reply, id], (err) => {
      if (err) return res.status(500).json({ error: "Database error." });
      res.status(200).json({ message: "Reply sent successfully." });
    });
  };
}

module.exports = MessageController;
