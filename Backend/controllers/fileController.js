const PdfFile = require('../models/pdfFileModel');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const uploadFile = async (req, res) => {
  try {
    const { originalname, filename, path: filePath } = req.file;
    
    // Verify we have all required fields
    if (!originalname || !filename || !filePath) {
      return res.status(400).send('Missing file information');
    }
    
    const newFile = new PdfFile({
      originalname,
      filename,
      path: filePath,
      uuid: uuidv4(),
      uploader: req.user._id,
    });
    const savedFile = await newFile.save();
    res.status(201).json(savedFile);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUserFiles = async (req, res) => {
  try {
    let files = await PdfFile.find({ uploader: req.user._id });
    
    // Filter out files that no longer exist on disk
    const validFiles = [];
    const invalidFiles = [];
    
    for (const file of files) {
      const filePath = path.join(__dirname, '../uploads', file.filename);
      if (fs.existsSync(filePath)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file._id);
      }
    }
    
    // Remove invalid files from database
    if (invalidFiles.length > 0) {
      await PdfFile.deleteMany({ _id: { $in: invalidFiles } });
    }
    
    res.json(validFiles);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getFileByUuid = async (req, res) => {
  try {
    const file = await PdfFile.findOne({ uuid: req.params.uuid, uploader: req.user._id });
    if (!file) {
      return res.status(404).send('File not found');
    }
    
    // Check if file actually exists on disk
    const filePath = path.join(__dirname, '../uploads', file.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found on disk');
    }
    
    // Make sure we have all required fields
    if (!file.filename) {
      return res.status(500).send('File metadata is incomplete');
    }
    
    res.json(file);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { uploadFile, getUserFiles, getFileByUuid };
