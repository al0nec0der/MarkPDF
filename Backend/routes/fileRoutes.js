const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { uploadFile, getUserFiles, getFileByUuid } = require('../controllers/fileController');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/upload', protect, upload.single('pdf'), uploadFile);
router.get('/', protect, getUserFiles);
router.get('/:uuid', protect, getFileByUuid);

module.exports = router;
