const Highlight = require('../models/highlightModel');
const PdfFile = require('../models/pdfFileModel');

const saveHighlight = async (req, res) => {
  try {
    const { text, position, pageNumber, pdfUuid } = req.body;
    const pdfFile = await PdfFile.findOne({ uuid: pdfUuid });

    if (!pdfFile) {
      return res.status(404).send('PDF file not found');
    }

    const newHighlight = new Highlight({
      text,
      position,
      pageNumber,
      user: req.user._id,
      pdfFile: pdfFile._id,
    });

    const savedHighlight = await newHighlight.save();
    res.status(201).json(savedHighlight);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getHighlightsForPdf = async (req, res) => {
  try {
    const { pdfUuid } = req.params;
    const pdfFile = await PdfFile.findOne({ uuid: pdfUuid });

    if (!pdfFile) {
      return res.status(404).send('PDF file not found');
    }

    const highlights = await Highlight.find({
      pdfFile: pdfFile._id,
      user: req.user._id,
    });

    res.json(highlights);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { saveHighlight, getHighlightsForPdf };
