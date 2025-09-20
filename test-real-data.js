const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

const testRealSignup = async () => {
  try {
    console.log('🔥 Testing Real Signup with Actual Data...');
    const response = await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Bhupesh Kumar',
      email: 'bhupesh.farmer@gmail.com',
      password: 'MyStrong123',
      phone: '+919876543210',
      location: 'Ludhiana, Punjab'
    });

    console.log('✅ Real Signup Success:');
    console.log('User ID:', response.data.data.user._id);
    console.log('Name:', response.data.data.user.name);
    console.log('Email:', response.data.data.user.email);
    console.log('Phone:', response.data.data.user.phone);
    console.log('Location:', response.data.data.user.location);
    console.log('Role:', response.data.data.user.role);
    console.log('Token:', response.data.token.substring(0, 20) + '...');
    return {
      token: response.data.token,
      user: response.data.data.user
    };
  } catch (error) {
    console.log('❌ Real Signup Error:', error.response?.data || error.message);
    return null;
  }
};

const testRealLogin = async () => {
  try {
    console.log('\n🔥 Testing Real Login with Same Credentials...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'bhupesh.farmer@gmail.com',
      password: 'MyStrong123'
    });

    console.log('✅ Real Login Success:');
    console.log('Welcome back:', response.data.data.user.name);
    console.log('Last Login:', response.data.data.user.lastLogin);
    console.log('Profile Completed:', response.data.data.user.profileCompleted);
    console.log('Email Verified:', response.data.data.user.emailVerified);
    console.log('New Token:', response.data.token.substring(0, 20) + '...');
    return {
      token: response.data.token,
      user: response.data.data.user
    };
  } catch (error) {
    console.log('❌ Real Login Error:', error.response?.data || error.message);
    return null;
  }
};

const testRealProfile = async (token) => {
  try {
    console.log('\n🔥 Testing Real Profile Access...');
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Real Profile Success:');
    console.log('Account Created:', new Date(response.data.data.user.createdAt).toLocaleString());
    console.log('Last Updated:', new Date(response.data.data.user.updatedAt).toLocaleString());
    console.log('Account Status:', response.data.data.user.isActive ? 'Active' : 'Inactive');
    return response.data.data.user;
  } catch (error) {
    console.log('❌ Real Profile Error:', error.response?.data || error.message);
    return null;
  }
};

const testUpdateProfile = async (token) => {
  try {
    console.log('\n🔥 Testing Real Profile Update...');
    const response = await axios.put(`${BASE_URL}/auth/profile`, {
      name: 'Bhupesh Kumar Singh',
      phone: '+919876543211',
      location: 'Ludhiana, Punjab, India'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Real Profile Update Success:');
    console.log('Updated Name:', response.data.data.user.name);
    console.log('Updated Phone:', response.data.data.user.phone);
    console.log('Updated Location:', response.data.data.user.location);
    console.log('Profile Completed:', response.data.data.user.profileCompleted);
    return response.data.data.user;
  } catch (error) {
    console.log('❌ Real Profile Update Error:', error.response?.data || error.message);
    return null;
  }
};

const testWrongCredentials = async () => {
  try {
    console.log('\n🔥 Testing Wrong Credentials...');
    await axios.post(`${BASE_URL}/auth/login`, {
      email: 'bhupesh.farmer@gmail.com',
      password: 'WrongPassword123'
    });
  } catch (error) {
    console.log('✅ Wrong Credentials Handled Correctly:', error.response.data.message);
  }
};

const runRealTests = async () => {
  console.log('🚀 Starting Real Data API Tests...\n');

  // Test signup with actual data
  let result = await testRealSignup();

  if (!result) {
    // If signup fails (user already exists), try login
    result = await testRealLogin();
  }

  if (result && result.token) {
    // Test profile access
    await testRealProfile(result.token);

    // Test profile update
    await testUpdateProfile(result.token);
  }

  // Test wrong credentials
  await testWrongCredentials();

  console.log('\n✅ All real data tests completed!');
};

runRealTests();