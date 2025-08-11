require('dotenv').config();

module.exports = {
  // MongoDB Configuration (supports both var names)
  mongoURI: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcourt',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
  
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Twilio Configuration (for SMS OTP)
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  
  // File Upload Configuration
  uploadPath: 'uploads/',
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

