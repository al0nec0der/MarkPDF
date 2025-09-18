const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const highlightRoutes = require('./routes/highlightRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const path = require('path');

// Connect to database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/highlights', highlightRoutes);

// Serve static files with proper headers
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline'); // This ensures PDFs are displayed inline instead of downloaded
    }
  }
}));

app.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
