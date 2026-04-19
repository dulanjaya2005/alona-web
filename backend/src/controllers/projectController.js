const { pool } = require('../config/database');

const getProjects = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json({ success: true, projects: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, image, tech_stack, demo_url, github_url } = req.body;
    if (!title || !description || !tech_stack) {
      return res.status(400).json({ success: false, message: 'Title, description, and tech stack are required.' });
    }
    const [result] = await pool.query(
      'INSERT INTO projects (title, description, image, tech_stack, demo_url, github_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title.trim(), description.trim(), image || null, tech_stack.trim(), demo_url || null, github_url || null]
    );
    const [newProject] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, project: newProject[0], message: 'Project created.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, tech_stack, demo_url, github_url } = req.body;
    if (!title || !description || !tech_stack) {
      return res.status(400).json({ success: false, message: 'Title, description, and tech stack are required.' });
    }
    await pool.query(
      'UPDATE projects SET title = ?, description = ?, image = ?, tech_stack = ?, demo_url = ?, github_url = ? WHERE id = ?',
      [title.trim(), description.trim(), image || null, tech_stack.trim(), demo_url || null, github_url || null, id]
    );
    const [updated] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    res.json({ success: true, project: updated[0], message: 'Project updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
