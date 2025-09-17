const mongoose = require('mongoose');

const pdfFileSchema = new mongoose.Schema({
  originalname: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const PdfFile = mongoose.model('PdfFile', pdfFileSchema);

module.exports = PdfFile;
