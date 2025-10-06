const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test data
const testSoilTestRequest = {
  crop: 'Banana',
  farmArea: '5',
  surveyNumber: 'S123',
  addressLine: 'Haradi Dwan',
  city: 'Belapur',
  state: 'Rajasthan',
  pincode: '302029',
  contact: '9636819197',
  packageType: 'onFarm',
  packagePrice: '₹500/test',
  bagItems: [
    {
      id: '1',
      name: 'Soil Sample 1',
      quantity: 2
    },
    {
      id: '2',
      name: 'Soil Sample 2',
      quantity: 1
    }
  ],
  totalBags: 3
};

async function testSoilTestingAPIs() {
  console.log('🧪 Testing Soil Testing APIs...\n');

  try {
    // Test 1: Send Email to Support
    console.log('1. Testing Send Email to Support API...');
    try {
      const emailResponse = await axios.post(`${API_BASE_URL}/soil-testing/send-email-support`, testSoilTestRequest);
      console.log('✅ Email sent successfully!');
      console.log('Response:', JSON.stringify(emailResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Email API failed:');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('Error:', error.message);
      }
    }
    console.log('');

    // Test 2: Create Request
    console.log('2. Testing Create Request API...');
    try {
      const createResponse = await axios.post(`${API_BASE_URL}/soil-testing/requests`, {
        crop: testSoilTestRequest.crop,
        farmArea: testSoilTestRequest.farmArea,
        surveyNumber: testSoilTestRequest.surveyNumber,
        addressLine: testSoilTestRequest.addressLine,
        city: testSoilTestRequest.city,
        state: testSoilTestRequest.state,
        pincode: testSoilTestRequest.pincode,
        packageType: testSoilTestRequest.packageType,
        bagItems: testSoilTestRequest.bagItems
      });
      console.log('✅ Request created successfully!');
      console.log('Response:', JSON.stringify(createResponse.data, null, 2));

      const requestId = createResponse.data.data.id;

      // Test 3: Get All Requests
      console.log('3. Testing Get All Requests API...');
      try {
        const getAllResponse = await axios.get(`${API_BASE_URL}/soil-testing/requests`);
        console.log('✅ Got all requests successfully!');
        console.log('Response:', JSON.stringify(getAllResponse.data, null, 2));
      } catch (error) {
        console.log('❌ Get all requests failed:', error.response?.data || error.message);
      }
      console.log('');

      // Test 4: Get Request by ID
      console.log('4. Testing Get Request by ID API...');
      try {
        const getByIdResponse = await axios.get(`${API_BASE_URL}/soil-testing/requests/${requestId}`);
        console.log('✅ Got request by ID successfully!');
        console.log('Response:', JSON.stringify(getByIdResponse.data, null, 2));
      } catch (error) {
        console.log('❌ Get by ID failed:', error.response?.data || error.message);
      }
      console.log('');

      // Test 5: Update Request Status
      console.log('5. Testing Update Request Status API...');
      try {
        const updateResponse = await axios.patch(`${API_BASE_URL}/soil-testing/requests/${requestId}/status`, {
          status: 'in_progress'
        });
        console.log('✅ Status updated successfully!');
        console.log('Response:', JSON.stringify(updateResponse.data, null, 2));
      } catch (error) {
        console.log('❌ Update status failed:', error.response?.data || error.message);
      }
      console.log('');

      // Test 6: Delete Request
      console.log('6. Testing Delete Request API...');
      try {
        const deleteResponse = await axios.delete(`${API_BASE_URL}/soil-testing/requests/${requestId}`);
        console.log('✅ Request deleted successfully!');
        console.log('Response:', JSON.stringify(deleteResponse.data, null, 2));
      } catch (error) {
        console.log('❌ Delete request failed:', error.response?.data || error.message);
      }

    } catch (error) {
      console.log('❌ Create request failed:');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('Error:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test with invalid data
async function testValidation() {
  console.log('\n🔍 Testing Validation...\n');

  // Test missing required fields
  try {
    console.log('Testing missing required fields...');
    const invalidResponse = await axios.post(`${API_BASE_URL}/soil-testing/send-email-support`, {
      crop: 'Banana'
      // Missing other required fields
    });
  } catch (error) {
    console.log('✅ Validation working correctly!');
    console.log('Error response:', JSON.stringify(error.response.data, null, 2));
  }
  console.log('');

  // Test invalid pincode
  try {
    console.log('Testing invalid pincode...');
    const invalidPincodeResponse = await axios.post(`${API_BASE_URL}/soil-testing/send-email-support`, {
      ...testSoilTestRequest,
      pincode: '12345' // Invalid pincode (should be 6 digits)
    });
  } catch (error) {
    console.log('✅ Pincode validation working correctly!');
    console.log('Error response:', JSON.stringify(error.response.data, null, 2));
  }
}

// Run tests
console.log('🚀 Starting Soil Testing API Tests...\n');

// First check if server is running
axios.get(`${API_BASE_URL}/../`)
  .then(() => {
    console.log('✅ Server is running!\n');
    return testSoilTestingAPIs();
  })
  .then(() => {
    return testValidation();
  })
  .then(() => {
    console.log('\n🎉 All tests completed!');
  })
  .catch((error) => {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running. Please start the agriproxy-backend server first.');
      console.log('Run: cd agriproxy-backend && npm start');
    } else {
      console.error('❌ Test setup failed:', error.message);
    }
  });