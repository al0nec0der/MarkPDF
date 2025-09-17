const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const highlightRoutes = require('./routes/highlightRoutes');
const { errorHandler } = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/highlights', highlightRoutes);

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
