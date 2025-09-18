const axios = require('axios');

// Simple test for highlights API
const testHighlights = async () => {
  try {
    console.log('Testing highlights API...');
    
    // Test the base endpoint
    const response = await axios.get('http://localhost:5001/api/highlights/test-uuid');
    console.log('GET /api/highlights/test-uuid response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    } else {
      console.log('Error message:', error.message);
    }
  }
};

testHighlights();