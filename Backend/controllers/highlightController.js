const Highlight = require("../models/highlightModel");
const PdfFile = require("../models/pdfFileModel");

const saveHighlight = async (req, res) => {
  try {
    const { content, position, pageNumber, pdfUuid, timestamp } = req.body;

    // Validate required fields
    if (!position || !pageNumber || !pdfUuid) {
      return res.status(400).json({
        error: "Missing required fields",
        details: {
          position: !position,
          pageNumber: !pageNumber,
          pdfUuid: !pdfUuid,
        },
      });
    }

    // Validate position object structure
    if (
      !position.boundingRect ||
      !position.rects ||
      !Array.isArray(position.rects)
    ) {
      return res.status(400).json({
        error: "Invalid position structure",
        details: "Position must include boundingRect and rects array",
      });
    }

    const pdfFile = await PdfFile.findOne({ uuid: pdfUuid });
    if (!pdfFile) {
      return res.status(404).json({
        error: "PDF file not found",
        details: `No PDF found with UUID: ${pdfUuid}`,
      });
    }

    // Create highlight with proper validation of content
    const highlightData = {
      content: content || { text: "", image: null }, // Handle missing content
      position,
      pageNumber,
      user: req.user._id,
      pdfFile: pdfFile._id,
      timestamp: timestamp || new Date().toISOString(),
    };

    const newHighlight = new Highlight(highlightData);
    const savedHighlight = await newHighlight.save();

    res.status(201).json(savedHighlight);
  } catch (error) {
    console.error("Error saving highlight:", error);
    res.status(500).json({
      error: "Failed to save highlight",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const getHighlightsForPdf = async (req, res) => {
  try {
    const { pdfUuid } = req.params;

    if (!pdfUuid) {
      return res.status(400).json({
        error: "Missing required parameter",
        details: "pdfUuid is required",
      });
    }

    const pdfFile = await PdfFile.findOne({ uuid: pdfUuid });
    if (!pdfFile) {
      return res.status(404).json({
        error: "PDF file not found",
        details: `No PDF found with UUID: ${pdfUuid}`,
      });
    }

    const highlights = await Highlight.find({
      pdfFile: pdfFile._id,
      user: req.user._id,
    })
      .sort({ timestamp: -1 }) // Sort by newest first
      .lean(); // Convert to plain JavaScript objects for better performance

    // Ensure all highlights have the required structure
    const sanitizedHighlights = highlights.map((highlight) => ({
      ...highlight,
      content: highlight.content || { text: "", image: null },
      timestamp: highlight.timestamp || new Date().toISOString(),
    }));

    res.json(sanitizedHighlights);
  } catch (error) {
    console.error("Error fetching highlights:", error);
    res.status(500).json({
      error: "Failed to fetch highlights",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

module.exports = { saveHighlight, getHighlightsForPdf };
