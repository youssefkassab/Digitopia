const db = require('../config/db');
class MessageController {
  static createMessage = (req, res) => {
    const { senderEmail, content } = req.body;

  // Validate request
  if (!senderEmail || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Create message in the database
  const query = 'INSERT INTO messages SET ?';
  const messageData = { sender: senderEmail, content, seen: false ,message_date: new Date(),message_time: new Date() };
  db.query(query, messageData, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create message' });
    }
    res.status(201).json({ id: this.lastID, ...messageData });
  });
};
static getAllMessages = (req, res) => {
    let quer = `SELECT * FROM messages`;
    db.query(quer, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(200).json(results);
    });
};
static getAllUserMessages = (req, res) => {
    let quer = `SELECT * FROM messages WHERE sender = ?`;
    db.query(quer, [req.user.email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(200).json(results);
    });
};
static MarkAsSeen = (req, res) => {
    let quer = `UPDATE messages SET seen = 1 WHERE id = ? `;
    db.query(quer, [req.body.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(200).json(results[0]);
    });
};
static updateMessage = (req, res) => {
    const messageData ={content: req.body.content, seen: false ,message_date: new Date(),message_time: new Date() };
    const seen = false;
    if (!messageData || !req.body.id) {
        return res.status(400).json({ error: 'Content and ID are required.' });
    }
    let quer = `UPDATE messages SET ? WHERE id = ? AND sender = ?`;
    db.query(quer, [messageData, req.body.id, req.user.email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' + err });
        }
        return res.status(200).json({ message: 'Message updated successfully.' });
    });
};
static deleteMessage = (req, res) => {
    let quer = `DELETE FROM messages WHERE id = ? AND sender = ?`;
    if (req.user.role === 'admin') {
        quer = `DELETE FROM messages WHERE id = ?`;
    }
    db.query(quer, [req.body.id, req.user.email || req.user.role === 'admin'], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        return res.status(200).json({ message: 'Message deleted successfully.' });
    });
};


}
module.exports = MessageController;
