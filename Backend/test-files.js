const mongoose = require('mongoose');
const PdfFile = require('./models/pdfFileModel');
require('dotenv').config();

const connectDB = require('./config/db');

// Connect to database
connectDB();

const checkFiles = async () => {
  try {
    const files = await PdfFile.find({});
    console.log('Database files:');
    files.forEach(file => {
      console.log(`- UUID: ${file.uuid}`);
      console.log(`  Original name: ${file.originalname}`);
      console.log(`  Filename: ${file.filename}`);
      console.log(`  Path: ${file.path}`);
      console.log(`  Uploader: ${file.uploader}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error fetching files:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkFiles();