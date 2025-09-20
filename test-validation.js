const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

const testValidationErrors = async () => {
  console.log('🔥 Testing Input Validation...\n');

  // Test 1: Empty name
  try {
    await axios.post(`${BASE_URL}/auth/signup`, {
      name: '',
      email: 'test@test.com',
      password: 'Test123456',
      phone: '+919876543210'
    });
  } catch (error) {
    console.log('✅ Empty name validation:', error.response.data.errors[0].msg);
  }

  // Test 2: Invalid email
  try {
    await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Test User',
      email: 'invalid-email',
      password: 'Test123456',
      phone: '+919876543210'
    });
  } catch (error) {
    console.log('✅ Invalid email validation:', error.response.data.errors[0].msg);
  }

  // Test 3: Weak password
  try {
    await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Test User',
      email: 'test2@test.com',
      password: '123',
      phone: '+919876543210'
    });
  } catch (error) {
    console.log('✅ Weak password validation:', error.response.data.errors[0].msg);
  }

  // Test 4: Invalid phone number
  try {
    await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Test User',
      email: 'test3@test.com',
      password: 'Test123456',
      phone: 'invalid-phone'
    });
  } catch (error) {
    console.log('✅ Invalid phone validation:', error.response.data.errors[0].msg);
  }

  // Test 5: Duplicate email
  try {
    await axios.post(`${BASE_URL}/auth/signup`, {
      name: 'Another User',
      email: 'bhupeshfarmer@gmail.com', // Already exists
      password: 'Test123456',
      phone: '+919876543210'
    });
  } catch (error) {
    console.log('✅ Duplicate email validation:', error.response.data.message);
  }

  // Test 6: Missing login credentials
  try {
    await axios.post(`${BASE_URL}/auth/login`, {
      email: '',
      password: ''
    });
  } catch (error) {
    console.log('✅ Missing login credentials:', error.response.data.errors[0].msg);
  }

  console.log('\n✅ All validation tests passed!');
};

testValidationErrors();