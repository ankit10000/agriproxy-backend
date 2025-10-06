const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/submit', feedbackController.submitFeedback);
router.get('/active', feedbackController.getActiveFeedbacks);

// Admin routes (protected)
router.get('/all', protect, feedbackController.getAllFeedbacks);
router.patch('/:id/toggle-status', protect, feedbackController.toggleFeedbackStatus);
router.delete('/:id', protect, feedbackController.deleteFeedback);
router.get('/stats', protect, feedbackController.getFeedbackStats);

module.exports = router;
