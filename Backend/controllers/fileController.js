const PdfFile = require('../models/pdfFileModel');
const { v4: uuidv4 } = require('uuid');

const uploadFile = async (req, res) => {
  try {
    const { originalname, filename, path } = req.file;
    const newFile = new PdfFile({
      originalname,
      filename,
      path,
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
    const files = await PdfFile.find({ uploader: req.user._id });
    res.json(files);
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
    res.json(file);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { uploadFile, getUserFiles, getFileByUuid };
