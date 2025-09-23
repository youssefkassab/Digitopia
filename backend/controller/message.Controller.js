const { sequelize, Sequelize } = require('../db/models');
const { QueryTypes } = Sequelize;
class MessageController {
  static createMessage = (req, res) => {
    const { senderEmail, content } = req.body;

  // Validate request
  if (!senderEmail || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Create message in the database
  const insertSql = `INSERT INTO messages (sender, content, seen, message_date, message_time) VALUES (?, ?, ?, ?, ?)`;
  const now = new Date();
  const messageData = { sender: senderEmail, content, seen: 0 , message_date: now, message_time: now };
  sequelize.query(insertSql, { replacements: [messageData.sender, messageData.content, messageData.seen, messageData.message_date, messageData.message_time] })
    .then(([results, metadata]) => {
      const insertId = (metadata && metadata.insertId) || (results && results.insertId) || undefined;
      return res.status(201).json({ id: insertId, ...messageData });
    })
    .catch(() => res.status(500).json({ error: 'Failed to create message' }));
};
static getAllMessages = (req, res) => {
    let quer = `SELECT * FROM messages`;
    sequelize.query(quer, { type: QueryTypes.SELECT })
      .then((results) => res.status(200).json(results))
      .catch(() => res.status(500).json({ error: 'Internal server error.' }));
};
static getAllUserMessages = (req, res) => {
    let quer = `SELECT * FROM messages WHERE sender = ?`;
    sequelize.query(quer, { replacements: [req.user.email], type: QueryTypes.SELECT })
      .then((results) => res.status(200).json(results))
      .catch(() => res.status(500).json({ error: 'Internal server error.' }));
};
static MarkAsSeen = (req, res) => {
    let quer = `UPDATE messages SET seen = 1 WHERE id = ? `;
    sequelize.query(quer, { replacements: [req.body.id], type: QueryTypes.UPDATE })
      .then(() => res.status(200).json({ message: ' Message marked as seen successfully.' }))
      .catch(() => res.status(500).json({ error: 'Internal server error.' }));
};
static updateMessage = (req, res) => {
    const messageData ={content: req.body.content, seen: false ,message_date: new Date(),message_time: new Date() };
    const seen = false;
    if (!messageData || !req.body.id) {
        return res.status(400).json({ error: 'Content and ID are required.' });
    }
    const quer = `UPDATE messages SET content = ?, seen = ?, message_date = ?, message_time = ? WHERE id = ? AND sender = ?`;
    const params = [messageData.content, messageData.seen ? 1 : 0, messageData.message_date, messageData.message_time, req.body.id, req.user.email];
    sequelize.query(quer, { replacements: params, type: QueryTypes.UPDATE })
      .then(() => res.status(200).json({ message: ' Message updated successfully.' }))
      .catch((err) => res.status(500).json({ error: 'Internal server error.' + err }));
};
static deleteMessage = (req, res) => {
    const isAdmin = req.user.role === 'admin';
    const quer = isAdmin ? 'DELETE FROM messages WHERE id = ?' : 'DELETE FROM messages WHERE id = ? AND sender = ?';
    const params = isAdmin ? [req.body.id] : [req.body.id, req.user.email];
    sequelize.query(quer, { replacements: params, type: QueryTypes.DELETE })
      .then(() => res.status(200).json({ message: 'Message deleted successfully.' }))
      .catch(() => res.status(500).json({ error: 'Internal server error.' }));
};


}
module.exports = MessageController;
