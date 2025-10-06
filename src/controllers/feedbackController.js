const Feedback = require('../models/Feedback');
const { sendFeedbackEmail } = require('../config/emailConfig');

// Submit feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { name, occupation, rating, review } = req.body;

        // Validate required fields
        if (!name || !occupation || !rating || !review) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Create feedback
        const feedback = await Feedback.create({
            name,
            occupation,
            rating,
            review
        });

        // Send email to admin
        try {
            await sendFeedbackEmail(feedback);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue even if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: feedback
        });

    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback',
            error: error.message
        });
    }
};

// Get all active feedbacks (for public display)
exports.getActiveFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ isActive: true })
            .select('-__v')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedbacks.length,
            data: feedbacks
        });

    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedbacks',
            error: error.message
        });
    }
};

// Get all feedbacks (Admin only)
exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .select('-__v')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: feedbacks.length,
            data: feedbacks
        });

    } catch (error) {
        console.error('Error fetching all feedbacks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedbacks',
            error: error.message
        });
    }
};

// Toggle feedback active status (Admin only)
exports.toggleFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findById(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        feedback.isActive = !feedback.isActive;
        await feedback.save();

        res.status(200).json({
            success: true,
            message: `Feedback ${feedback.isActive ? 'activated' : 'deactivated'} successfully`,
            data: feedback
        });

    } catch (error) {
        console.error('Error toggling feedback status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle feedback status',
            error: error.message
        });
    }
};

// Delete feedback (Admin only)
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Feedback deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete feedback',
            error: error.message
        });
    }
};

// Get feedback statistics (Admin only)
exports.getFeedbackStats = async (req, res) => {
    try {
        const totalFeedbacks = await Feedback.countDocuments();
        const activeFeedbacks = await Feedback.countDocuments({ isActive: true });

        const avgRating = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);

        const ratingDistribution = await Feedback.aggregate([
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalFeedbacks,
                activeFeedbacks,
                inactiveFeedbacks: totalFeedbacks - activeFeedbacks,
                averageRating: avgRating.length > 0 ? avgRating[0].averageRating.toFixed(2) : 0,
                ratingDistribution
            }
        });

    } catch (error) {
        console.error('Error fetching feedback stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback statistics',
            error: error.message
        });
    }
};
