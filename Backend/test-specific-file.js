const mongoose = require('mongoose');
const PdfFile = require('./models/pdfFileModel');
require('dotenv').config();

const connectDB = require('./config/db');

// Connect to database
connectDB();

const checkSpecificFile = async () => {
  try {
    const file = await PdfFile.findOne({ uuid: 'a050ab87-7455-4a7b-9e9c-90a688a5ceb9' });
    if (file) {
      console.log('Found file:');
      console.log(`- UUID: ${file.uuid}`);
      console.log(`- Original name: ${file.originalname}`);
      console.log(`- Filename: ${file.filename}`);
      console.log(`- Path: ${file.path}`);
      console.log(`- Uploader: ${file.uploader}`);
      
      // Check if file exists on disk
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, 'uploads', file.filename);
      console.log(`- File path: ${filePath}`);
      console.log(`- File exists: ${fs.existsSync(filePath)}`);
    } else {
      console.log('File with UUID a050ab87-7455-4a7b-9e9c-90a688a5ceb9 not found in database');
    }
  } catch (error) {
    console.error('Error fetching file:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkSpecificFile();