const { pool } = require('../config/database');

// POST /contact - Public: save contact message
const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    const [result] = await pool.query(
      'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), message.trim()]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Create message error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /messages - Admin: get all messages with pagination
const getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const filter = req.query.filter || 'all'; // all, read, unread, replied

    let whereClause = '';
    const params = [];

    const conditions = [];
    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR message LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (filter === 'read') conditions.push('is_read = 1');
    if (filter === 'unread') conditions.push('is_read = 0');
    if (filter === 'replied') conditions.push('reply IS NOT NULL');

    if (conditions.length > 0) whereClause = 'WHERE ' + conditions.join(' AND ');

    const [rows] = await pool.query(
      `SELECT * FROM messages ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM messages ${whereClause}`,
      params
    );

    const [unreadCount] = await pool.query('SELECT COUNT(*) as count FROM messages WHERE is_read = 0');

    res.json({
      success: true,
      messages: rows,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        totalPages: Math.ceil(countResult[0].total / limit),
      },
      unreadCount: unreadCount[0].count,
    });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PATCH /messages/:id/read - Admin: mark as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE messages SET is_read = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PATCH /messages/:id/unread - Admin: mark as unread
const markAsUnread = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE messages SET is_read = 0 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Marked as unread.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /reply - Admin: reply to message
const replyToMessage = async (req, res) => {
  try {
    const { messageId, reply } = req.body;

    if (!messageId || !reply) {
      return res.status(400).json({ success: false, message: 'Message ID and reply are required.' });
    }

    await pool.query(
      'UPDATE messages SET reply = ?, is_read = 1, replied_at = NOW() WHERE id = ?',
      [reply.trim(), messageId]
    );

    res.json({ success: true, message: 'Reply saved successfully.' });
  } catch (err) {
    console.error('Reply error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /messages/:id - Admin: delete message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM messages WHERE id = ?', [id]);
    res.json({ success: true, message: 'Message deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /messages/stats - Admin: get stats
const getStats = async (req, res) => {
  try {
    const [[{ totalMessages }]] = await pool.query('SELECT COUNT(*) as totalMessages FROM messages');
    const [[{ unreadMessages }]] = await pool.query('SELECT COUNT(*) as unreadMessages FROM messages WHERE is_read = 0');
    const [[{ totalProjects }]] = await pool.query('SELECT COUNT(*) as totalProjects FROM projects');
    const [[{ totalServices }]] = await pool.query('SELECT COUNT(*) as totalServices FROM services');
    const [[{ repliedMessages }]] = await pool.query('SELECT COUNT(*) as repliedMessages FROM messages WHERE reply IS NOT NULL');

    res.json({
      success: true,
      stats: { totalMessages, unreadMessages, totalProjects, totalServices, repliedMessages },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { createMessage, getMessages, markAsRead, markAsUnread, replyToMessage, deleteMessage, getStats };
