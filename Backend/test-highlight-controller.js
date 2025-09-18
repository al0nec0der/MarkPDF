const mongoose = require('mongoose');
const express = require('express');
const { saveHighlight, getHighlightsForPdf } = require('./controllers/highlightController');
const { protect } = require('./middleware/authMiddleware');
require('dotenv').config();

// Mock request and response objects
const mockReq = {
  user: {
    _id: '68cabd512411f15c8553d582' // This is a valid user ID from our test
  },
  params: {
    pdfUuid: 'ade279b2-90b2-460a-8712-35b171dc36f9' // This is a valid PDF UUID from our test
  }
};

const mockRes = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    this.data = data;
    console.log(`Status: ${this.statusCode}`);
    console.log('Response data:', JSON.stringify(data, null, 2));
    return this;
  }
};

// Connect to database
mongoose.connect(process.env.MONGO_URI);

console.log('Testing getHighlightsForPdf controller function...');

// Test the controller function directly
const testController = async () => {
  try {
    console.log('Calling getHighlightsForPdf controller...');
    await getHighlightsForPdf(mockReq, mockRes);
    console.log('Controller test completed');
  } catch (error) {
    console.error('Error in controller test:', error);
  } finally {
    mongoose.connection.close();
  }
};

testController();