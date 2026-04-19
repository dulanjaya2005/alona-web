const { pool } = require('../config/database');

const getServices = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services ORDER BY created_at DESC');
    res.json({ success: true, services: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const createService = async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO services (title, description, icon) VALUES (?, ?, ?)',
      [title.trim(), description.trim(), icon || 'code']
    );
    const [newService] = await pool.query('SELECT * FROM services WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, service: newService[0], message: 'Service created.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }
    await pool.query(
      'UPDATE services SET title = ?, description = ?, icon = ? WHERE id = ?',
      [title.trim(), description.trim(), icon || 'code', id]
    );
    const [updated] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    res.json({ success: true, service: updated[0], message: 'Service updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM services WHERE id = ?', [id]);
    res.json({ success: true, message: 'Service deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getServices, createService, updateService, deleteService };
