const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  position: {
    type: Object,
    required: true,
  },
  pageNumber: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pdfFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PdfFile',
    required: true,
  },
}, { timestamps: true });

const Highlight = mongoose.model('Highlight', highlightSchema);

module.exports = Highlight;
