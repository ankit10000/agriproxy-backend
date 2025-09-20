const axios = require('axios');

const BASE_URL = 'http://192.168.1.8:3001/api';

const testExistingUserLogin = async () => {
  try {
    console.log('🔥 Testing Login with Existing User...');
    console.log('Email: bhupeshfarmer@gmail.com');
    console.log('Password: MyStrong123\n');

    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'bhupeshfarmer@gmail.com',
      password: 'MyStrong123'
    });

    console.log('✅ Login Successful!');
    console.log('---------------------------');
    console.log('Welcome back:', response.data.data.user.name);
    console.log('Email:', response.data.data.user.email);
    console.log('Phone:', response.data.data.user.phone);
    console.log('Location:', response.data.data.user.location);
    console.log('Role:', response.data.data.user.role);
    console.log('Account Status:', response.data.data.user.isActive ? '🟢 Active' : '🔴 Inactive');
    console.log('Email Verified:', response.data.data.user.emailVerified ? '✅ Yes' : '❌ No');
    console.log('Profile Completed:', response.data.data.user.profileCompleted ? '✅ Yes' : '❌ No');
    console.log('Account Created:', new Date(response.data.data.user.createdAt).toLocaleString());
    console.log('Last Login:', new Date(response.data.data.user.lastLogin).toLocaleString());
    console.log('JWT Token:', response.data.token.substring(0, 30) + '...');
    console.log('Token Valid Until:', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString());

    return response.data;
  } catch (error) {
    console.log('❌ Login Failed:', error.response?.data?.message || error.message);
    return null;
  }
};

const testAnotherSignup = async () => {
  try {
    console.log('\n🔥 Testing Signup with Another User...');
    const response = await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Rajesh Sharma',
      email: 'rajesh.farmer@gmail.com',
      password: 'Rajesh123',
      phone: '+919988776655',
      location: 'Amritsar, Punjab'
    });

    console.log('✅ New User Registration Successful!');
    console.log('---------------------------');
    console.log('New User:', response.data.data.user.name);
    console.log('Email:', response.data.data.user.email);
    console.log('Phone:', response.data.data.user.phone);
    console.log('Location:', response.data.data.user.location);
    console.log('User ID:', response.data.data.user._id);

    return response.data;
  } catch (error) {
    console.log('❌ Signup Failed:', error.response?.data?.message || error.message);
    return null;
  }
};

const runLoginTests = async () => {
  console.log('🚀 Testing Login & Signup with Real Data...\n');

  // Test existing user login
  await testExistingUserLogin();

  // Test new user signup
  await testAnotherSignup();

  console.log('\n✅ All login tests completed!');
};

runLoginTests();