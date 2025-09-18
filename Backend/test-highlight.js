const mongoose = require('mongoose');
const Highlight = require('./models/highlightModel');
const PdfFile = require('./models/pdfFileModel');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log('Testing database connection...');

// Test creating a highlight
const testHighlight = async () => {
  try {
    console.log('Creating test highlight...');
    
    // First, let's see what PDF files exist
    const pdfFiles = await PdfFile.find({});
    console.log('Existing PDF files:', pdfFiles);
    
    if (pdfFiles.length > 0) {
      const testHighlightData = {
        text: 'Test highlight',
        position: {
          boundingRect: {
            x1: 100,
            y1: 100,
            x2: 200,
            y2: 200,
            width: 100,
            height: 100,
          },
          rects: [],
          pageNumber: 1,
        },
        pageNumber: 1,
        user: pdfFiles[0].uploader, // Use the uploader of the first PDF as test user
        pdfFile: pdfFiles[0]._id,
      };
      
      console.log('Test highlight data:', testHighlightData);
      const highlight = new Highlight(testHighlightData);
      const savedHighlight = await highlight.save();
      console.log('Highlight saved successfully:', savedHighlight);
    } else {
      console.log('No PDF files found in database');
    }
  } catch (error) {
    console.error('Error creating highlight:', error);
  } finally {
    mongoose.connection.close();
  }
};

testHighlight();