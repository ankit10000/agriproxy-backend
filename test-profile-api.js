const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

const testProfileAPIs = async () => {
  console.log('🚀 Testing Profile Management APIs...\n');

  let token = '';

  // 1. Login to get token
  try {
    console.log('🔐 Step 1: Login to get authentication token...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'bhupeshfarmer@gmail.com',
      password: 'MyStrong123'
    });

    if (loginResponse.data.success) {
      token = loginResponse.data.token;
      console.log('✅ Login successful, token obtained\n');
    } else {
      console.log('❌ Login failed');
      return;
    }
  } catch (error) {
    console.log('❌ Login error:', error.response?.data || error.message);
    return;
  }

  // 2. Get Profile
  try {
    console.log('👤 Step 2: Get user profile...');
    const profileResponse = await axios.get(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (profileResponse.data.success) {
      console.log('✅ Profile retrieved successfully');
      console.log('Profile Completion:', profileResponse.data.data.user.profileCompletion + '%');
      console.log('Current Data:', {
        name: profileResponse.data.data.user.name,
        email: profileResponse.data.data.user.email,
        phone: profileResponse.data.data.user.phone,
        location: profileResponse.data.data.user.location,
        username: profileResponse.data.data.user.username
      });
      console.log('');
    }
  } catch (error) {
    console.log('❌ Get profile error:', error.response?.data || error.message);
  }

  // 3. Update Profile with Extended Fields
  try {
    console.log('✏️  Step 3: Update profile with extended fields...');
    const updateResponse = await axios.put(`${BASE_URL}/profile`, {
      name: 'Bhupesh Kumar Singh',
      phone: '+919876543211',
      username: 'bhupesh_farmer',
      addressLine: 'Village Dhuri',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141001'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (updateResponse.data.success) {
      console.log('✅ Profile updated successfully');
      console.log('Updated Profile Completion:', updateResponse.data.data.user.profileCompletion + '%');
      console.log('Updated Data:', {
        name: updateResponse.data.data.user.name,
        username: updateResponse.data.data.user.username,
        addressLine: updateResponse.data.data.user.addressLine,
        city: updateResponse.data.data.user.city,
        state: updateResponse.data.data.user.state,
        pincode: updateResponse.data.data.user.pincode
      });
      console.log('');
    }
  } catch (error) {
    console.log('❌ Update profile error:', error.response?.data || error.message);
  }

  // 4. Test Username Uniqueness
  try {
    console.log('🔍 Step 4: Test username uniqueness...');
    await axios.put(`${BASE_URL}/profile`, {
      username: 'bhupesh_farmer' // Same username again
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    if (error.response?.data?.message?.includes('Username already taken')) {
      console.log('✅ Username uniqueness validation working correctly');
    } else {
      console.log('❌ Unexpected error:', error.response?.data || error.message);
    }
    console.log('');
  }

  // 5. Test Password Change
  try {
    console.log('🔑 Step 5: Test password change...');
    const passwordResponse = await axios.put(`${BASE_URL}/profile/password`, {
      currentPassword: 'MyStrong123',
      newPassword: 'MyNewStrong123',
      confirmPassword: 'MyNewStrong123'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (passwordResponse.data.success) {
      console.log('✅ Password changed successfully');

      // Test login with new password
      console.log('🔐 Testing login with new password...');
      const newLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'bhupeshfarmer@gmail.com',
        password: 'MyNewStrong123'
      });

      if (newLoginResponse.data.success) {
        console.log('✅ Login with new password successful');

        // Change password back
        await axios.put(`${BASE_URL}/profile/password`, {
          currentPassword: 'MyNewStrong123',
          newPassword: 'MyStrong123',
          confirmPassword: 'MyStrong123'
        }, {
          headers: { Authorization: `Bearer ${newLoginResponse.data.token}` }
        });
        console.log('✅ Password restored to original');
      }
    }
    console.log('');
  } catch (error) {
    console.log('❌ Password change error:', error.response?.data || error.message);
  }

  // 6. Test Validation
  try {
    console.log('📝 Step 6: Test input validation...');

    // Invalid pincode
    await axios.put(`${BASE_URL}/profile`, {
      pincode: '12345' // Invalid - should be 6 digits
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    if (error.response?.data?.errors) {
      console.log('✅ Validation working correctly:', error.response.data.errors[0].msg);
    }
  }

  try {
    // Invalid username
    await axios.put(`${BASE_URL}/profile`, {
      username: 'ab' // Too short
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    if (error.response?.data?.errors) {
      console.log('✅ Username validation working correctly:', error.response.data.errors[0].msg);
    }
    console.log('');
  }

  console.log('✅ All profile management tests completed!');
};

testProfileAPIs();