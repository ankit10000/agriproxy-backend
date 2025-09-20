const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

const testSignup = async () => {
  try {
    console.log('🔥 Testing Signup API...');
    const response = await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Test Farmer',
      email: 'farmer@test.com',
      password: 'Test123456',
      phone: '+919876543210',
      location: 'Punjab, India'
    });

    console.log('✅ Signup Success:', response.data);
    return response.data.token;
  } catch (error) {
    console.log('❌ Signup Error:', error.response?.data || error.message);
    return null;
  }
};

const testLogin = async () => {
  try {
    console.log('\n🔥 Testing Login API...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'farmer@test.com',
      password: 'Test123456'
    });

    console.log('✅ Login Success:', response.data);
    return response.data.token;
  } catch (error) {
    console.log('❌ Login Error:', error.response?.data || error.message);
    return null;
  }
};

const testProfile = async (token) => {
  try {
    console.log('\n🔥 Testing Profile API...');
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Profile Success:', response.data);
  } catch (error) {
    console.log('❌ Profile Error:', error.response?.data || error.message);
  }
};

const testHealth = async () => {
  try {
    console.log('🔥 Testing Health API...');
    const response = await axios.get(`${BASE_URL.replace('/api', '')}/api/health`);
    console.log('✅ Health Success:', response.data);
  } catch (error) {
    console.log('❌ Health Error:', error.response?.data || error.message);
  }
};

const runTests = async () => {
  console.log('🚀 Starting API Tests...\n');

  await testHealth();

  let token = await testSignup();

  if (!token) {
    token = await testLogin();
  }

  if (token) {
    await testProfile(token);
  }

  console.log('\n✅ All tests completed!');
};

runTests();