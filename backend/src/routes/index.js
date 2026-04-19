const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const { login, verifyToken, changePassword } = require('../controllers/authController');
const { createMessage, getMessages, markAsRead, markAsUnread, replyToMessage, deleteMessage, getStats } = require('../controllers/messageController');
const { getServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');

// Auth routes
router.post('/auth/login', login);
router.get('/auth/verify', authMiddleware, verifyToken);
router.put('/auth/change-password', authMiddleware, changePassword);

// Public routes
router.post('/contact', createMessage);
router.get('/services', getServices);
router.get('/projects', getProjects);

// Admin protected routes
router.get('/messages', authMiddleware, getMessages);
router.get('/messages/stats', authMiddleware, getStats);
router.patch('/messages/:id/read', authMiddleware, markAsRead);
router.patch('/messages/:id/unread', authMiddleware, markAsUnread);
router.post('/reply', authMiddleware, replyToMessage);
router.delete('/messages/:id', authMiddleware, deleteMessage);

router.post('/services', authMiddleware, createService);
router.put('/services/:id', authMiddleware, updateService);
router.delete('/services/:id', authMiddleware, deleteService);

router.post('/projects', authMiddleware, createProject);
router.put('/projects/:id', authMiddleware, updateProject);
router.delete('/projects/:id', authMiddleware, deleteProject);

module.exports = router;
