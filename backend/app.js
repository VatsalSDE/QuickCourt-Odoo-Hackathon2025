require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// MongoDB Connection
const config = require('./config/config');
const mongoURI = config.mongoURI;

if (mongoURI.includes('localhost')) {
  console.warn('MONGO_URI not set. Using local MongoDB at mongodb://localhost:27017/quickcourt');
} else {
  console.log('Connecting to MongoDB Atlas...');
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const { name, host } = mongoose.connection;
    console.log(`✅ MongoDB Atlas connected successfully!`);
    console.log(`   Database: ${name}`);
    console.log(`   Host: ${host}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('Please check your MONGO_URI in .env file');
  });

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/facilities', require('./routes/facility'));
app.use('/api/courts', require('./routes/court'));
app.use('/api/timeslots', require('./routes/timeslot'));
app.use('/api/bookings', require('./routes/booking'));
app.use('/api/admin', require('./routes/admin'));

module.exports = app;
