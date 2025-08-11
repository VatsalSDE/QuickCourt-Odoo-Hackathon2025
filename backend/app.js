const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const defaultLocalUri = 'mongodb://localhost:27017/quickcourt';
const mongoURI = process.env.MONGO_URI || defaultLocalUri;
if (mongoURI === defaultLocalUri) {
  console.warn('MONGO_URI not set. Using local MongoDB at mongodb://localhost:27017/quickcourt');
}

mongoose
  .connect(mongoURI)
  .then(() => {
    const { name, host } = mongoose.connection;
    console.log(`MongoDB connected (db: ${name}, host: ${host})`);
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes will be added here
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

module.exports = app;
