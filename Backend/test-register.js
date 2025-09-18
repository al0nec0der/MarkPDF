// test-register.js
// Simple script to test user registration

const axios = require('axios');

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'testpassword123'
};

// API endpoint
const API_URL = 'http://localhost:5001/api';

async function testRegistration() {
  try {
    console.log('Testing user registration...');
    console.log('Sending request to:', `${API_URL}/users/register`);
    
    const response = await axios.post(`${API_URL}/users/register`, testUser);
    
    console.log('Registration successful!');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.log('Registration failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Run the test
testRegistration();