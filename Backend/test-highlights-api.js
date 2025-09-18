const axios = require('axios');
require('dotenv').config();

// Mock authentication middleware for testing
const mockAuthMiddleware = (req, res, next) => {
  // Add a mock user to the request
  req.user = {
    _id: 'test-user-id'
  };
  next();
};

// Test the highlights API endpoint
const testHighlightsAPI = async () => {
  try {
    console.log('Testing highlights API...');
    
    // First, let's get a list of PDF files to get a valid pdfUuid
    console.log('Getting PDF files...');
    const fileResponse = await axios.get('http://localhost:5001/api/files', {
      headers: {
        'Authorization': 'Bearer test-token' // Placeholder token for testing
      }
    });
    
    console.log('PDF files:', fileResponse.data);
    
    if (fileResponse.data && fileResponse.data.length > 0) {
      const pdfUuid = fileResponse.data[0].uuid;
      console.log('Using PDF UUID:', pdfUuid);
      
      // Test saving a highlight
      const highlightData = {
        text: 'Test highlight from API test',
        position: {
          boundingRect: {
            x1: 150,
            y1: 150,
            x2: 250,
            y2: 250,
            width: 100,
            height: 100,
          },
          rects: [],
          pageNumber: 1,
        },
        pageNumber: 1,
        pdfUuid: pdfUuid,
        timestamp: new Date().toISOString()
      };
      
      console.log('Sending highlight data:', highlightData);
      
      try {
        const saveResponse = await axios.post('http://localhost:5001/api/highlights', highlightData, {
          headers: {
            'Authorization': 'Bearer YOUR_TEST_TOKEN_HERE' // Replace with a valid token
          }
        });
        
        console.log('Highlight saved successfully:', saveResponse.data);
      } catch (saveError) {
        console.error('Error saving highlight:', saveError.response?.data || saveError.message);
      }
      
      // Test getting highlights
      try {
        const getResponse = await axios.get(`http://localhost:5001/api/highlights/${pdfUuid}`, {
          headers: {
            'Authorization': 'Bearer test-token' // Placeholder token for testing
          }
        });
        
        console.log('Highlights retrieved successfully:', getResponse.data);
      } catch (getError) {
        console.error('Error getting highlights:', getError.response?.data || getError.message);
      }
    } else {
      console.log('No PDF files found');
    }
  } catch (error) {
    console.error('Error testing highlights API:', error.response?.data || error.message);
  }
};

testHighlightsAPI();