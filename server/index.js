const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const applicationRoutes = require('./routes/applicationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Placement Tracker API is running 🚀' });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
