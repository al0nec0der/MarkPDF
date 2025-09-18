const mongoose = require('mongoose');
const Highlight = require('./models/highlightModel');
const PdfFile = require('./models/pdfFileModel');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGO_URI);

console.log('Testing get highlights functionality...');

// Test getting highlights
const testGetHighlights = async () => {
  try {
    console.log('Getting highlights...');
    
    // First, let's see what PDF files exist
    const pdfFiles = await PdfFile.find({});
    console.log('Existing PDF files:', pdfFiles.length);
    
    if (pdfFiles.length > 0) {
      const pdfFile = pdfFiles[0];
      console.log('Using PDF file:', pdfFile.uuid);
      
      // Try to get highlights for this PDF
      const highlightsFromDb = await Highlight.find({
        pdfFile: pdfFile._id,
        user: pdfFile.uploader,
      });
      
      console.log('Found highlights:', highlightsFromDb.length);
      
      // Format them like the controller does
      const formattedHighlights = highlightsFromDb.map((dbHighlight) => ({
        id: dbHighlight._id.toString(),
        content: { text: dbHighlight.text },
        position: dbHighlight.position,
        comment: { text: dbHighlight.text, emoji: "" },
      }));
      
      console.log('Formatted highlights:', formattedHighlights);
    } else {
      console.log('No PDF files found in database');
    }
  } catch (error) {
    console.error('Error getting highlights:', error);
  } finally {
    mongoose.connection.close();
  }
};

testGetHighlights();