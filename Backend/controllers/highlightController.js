// server/controllers/highlightController.js

const Highlight = require("../models/highlightModel");
const PdfFile = require("../models/pdfFileModel");

/**
 * @desc    Save a new highlight
 * @route   POST /api/highlights
 * @access  Private
 */
const saveHighlight = async (req, res) => {
  try {
    const { position, content, comment, pdfUuid } = req.body;

    if (!position || !content || !pdfUuid) {
      return res
        .status(400)
        .json({ message: "Missing required highlight data." });
    }

    const pdfFile = await PdfFile.findOne({
      uuid: pdfUuid,
      uploader: req.user._id,
    });
    if (!pdfFile) {
      return res
        .status(404)
        .json({ message: "PDF file not found for this user." });
    }

    // Extract the highlight text from content
    const highlightText = content.text || " ";
    
    // Extract comment text if provided
    const commentText = comment && comment.text ? comment.text : "";

    const newHighlight = new Highlight({
      text: commentText || highlightText, // Save comment if exists, otherwise save highlight text
      position: position,
      pageNumber: position.pageNumber,
      user: req.user._id,
      pdfFile: pdfFile._id,
    });

    const savedHighlight = await newHighlight.save();

    // After saving, immediately format it correctly before sending back.
    const formattedHighlight = {
      id: savedHighlight._id.toString(),
      content: { text: highlightText }, // Always send back the highlighted text
      position: savedHighlight.position,
      comment: { text: commentText, emoji: "" }, // Send back the comment if exists
    };

    res.status(201).json(formattedHighlight);
  } catch (error) {
    console.error("=== HIGHLIGHT SAVE ERROR ===", error);
    res
      .status(500)
      .json({
        message: "Server error while saving highlight.",
        error: error.message,
      });
  }
};

/**
 * @desc    Get all highlights for a specific PDF
 * @route   GET /api/highlights/:pdfUuid
 * @access  Private
 */
const getHighlightsForPdf = async (req, res) => {
  try {
    const { pdfUuid } = req.params;

    const pdfFile = await PdfFile.findOne({
      uuid: pdfUuid,
      uploader: req.user._id,
    });
    if (!pdfFile) {
      return res.json([]);
    }

    const highlightsFromDb = await Highlight.find({
      pdfFile: pdfFile._id,
      user: req.user._id,
    });

    // THE CRITICAL TRANSFORMATION STEP:
    // Convert the raw database documents into the format the frontend library needs.
    const formattedHighlights = highlightsFromDb.map((dbHighlight) => ({
      id: dbHighlight._id.toString(),
      content: { text: dbHighlight.text }, // For now, we send the same text in content
      position: dbHighlight.position,
      comment: { text: dbHighlight.text, emoji: "" }, // Create a comment object for the popup
    }));

    res.json(formattedHighlights);
  } catch (error) {
    console.error("=== GET HIGHLIGHTS ERROR ===", error);
    res
      .status(500)
      .json({
        message: "Server error while fetching highlights.",
        error: error.message,
      });
  }
};

module.exports = {
  saveHighlight,
  getHighlightsForPdf,
};
