// Simple test to check what data is being sent to the highlight endpoint
const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.post('/api/highlights', (req, res) => {
  console.log('Received highlight data:', JSON.stringify(req.body, null, 2));
  console.log('Headers:', req.headers);
  res.status(200).json({ message: 'Data received', data: req.body });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});