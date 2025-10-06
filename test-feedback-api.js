const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Test data
const feedbackData = {
    name: 'Ramesh Kumar',
    occupation: 'Farmer',
    rating: 5,
    review: 'AGRIPROXY has been extremely helpful for my farming business. The soil testing feature is amazing and has helped me increase my crop yield significantly!'
};

async function testFeedbackAPI() {
    try {
        console.log('🧪 Testing Feedback API...\n');

        // 1. Submit Feedback
        console.log('1️⃣  Submitting feedback...');
        const submitResponse = await axios.post(`${API_BASE}/feedback/submit`, feedbackData);
        console.log('✅ Feedback submitted:', submitResponse.data);
        console.log('\n');

        const feedbackId = submitResponse.data.data._id;

        // 2. Get Active Feedbacks (Public)
        console.log('2️⃣  Getting active feedbacks (public)...');
        const activeResponse = await axios.get(`${API_BASE}/feedback/active`);
        console.log(`✅ Found ${activeResponse.data.count} active feedbacks`);
        console.log('\n');

        // Note: The following tests require authentication
        console.log('⚠️  Admin endpoints require authentication token');
        console.log('   To test admin endpoints:');
        console.log('   1. Login and get token');
        console.log('   2. Add token to Authorization header');
        console.log('\n');

        console.log('📋 Available Admin Endpoints:');
        console.log('   GET    /api/feedback/all                    - Get all feedbacks');
        console.log('   PATCH  /api/feedback/:id/toggle-status      - Toggle active/inactive');
        console.log('   DELETE /api/feedback/:id                    - Delete feedback');
        console.log('   GET    /api/feedback/stats                  - Get statistics');
        console.log('\n');

        console.log('🎉 Test completed successfully!');

    } catch (error) {
        console.error('❌ Error testing feedback API:', error.response?.data || error.message);
    }
}

// Run tests
testFeedbackAPI();
