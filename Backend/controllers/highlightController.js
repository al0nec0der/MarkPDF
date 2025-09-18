const Highlight = require('../models/highlightModel');
const PdfFile = require('../models/pdfFileModel');

const saveHighlight = async (req, res) => {
  try {
    console.log('=== HIGHLIGHT SAVE REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user?._id);
    console.log('Headers:', req.headers);
    
    const { text, position, pdfUuid } = req.body;
    
    // Validate required fields
    if (!text && !position) {
      console.log('Missing required fields: text or position');
      return res.status(400).send('Missing required fields: text or position');
    }
    
    if (!pdfUuid) {
      console.log('Missing required field: pdfUuid');
      return res.status(400).send('Missing required field: pdfUuid');
    }
    
    console.log('Looking for PDF file with uuid:', pdfUuid);
    const pdfFile = await PdfFile.findOne({ uuid: pdfUuid });

    if (!pdfFile) {
      console.log('PDF file not found for uuid:', pdfUuid);
      return res.status(404).send('PDF file not found');
    }

    console.log('Found PDF file:', pdfFile._id);
    
    const highlightData = {
      text: text || '',
      position: position || {},
      pageNumber: (position && position.pageNumber) ? position.pageNumber : 1,
      user: req.user._id,
      pdfFile: pdfFile._id,
    };
    
    console.log('Creating highlight with data:', highlightData);
    const newHighlight = new Highlight(highlightData);
    const savedHighlight = await newHighlight.save();
    console.log('Highlight saved successfully:', savedHighlight);
    res.status(201).json(savedHighlight);
  } catch (error) {
    console.error('=== HIGHLIGHT SAVE ERROR ===');
    console.error('Error saving highlight:', error);
    console.error('Error stack:', error.stack);
    res.status(500).send(error.message);
  }
};

const getHighlightsForPdf = async (req, res) => {
  try {
    console.log('=== GET HIGHLIGHTS REQUEST ===');
    const { pdfUuid } = req.params;
    console.log('Fetching highlights for PDF uuid:', pdfUuid);
    console.log('User ID:', req.user?._id);
    
    const pdfFile = await PdfFile.findOne({ uuid: pdfUuid });

    if (!pdfFile) {
      console.log('PDF file not found for uuid:', pdfUuid);
      return res.status(404).send('PDF file not found');
    }

    console.log('Found PDF file for highlights:', pdfFile._id);
    const highlights = await Highlight.find({
      pdfFile: pdfFile._id,
      user: req.user._id,
    });

    console.log('Found highlights:', highlights.length);
    res.json(highlights);
  } catch (error) {
    console.error('=== GET HIGHLIGHTS ERROR ===');
    console.error('Error fetching highlights:', error);
    res.status(500).send(error.message);
  }
};

module.exports = { saveHighlight, getHighlightsForPdf };
