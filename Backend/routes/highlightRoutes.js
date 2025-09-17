const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { saveHighlight, getHighlightsForPdf } = require('../controllers/highlightController');

router.post('/', protect, saveHighlight);
router.get('/:pdfUuid', protect, getHighlightsForPdf);

module.exports = router;
