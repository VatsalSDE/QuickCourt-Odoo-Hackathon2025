require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

async function getOTP() {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    
    console.log('🔍 Checking for users with OTP codes...\n');
    
    const users = await User.find({ otp_code: { $exists: true } }, 'email phone fullname otp_code otp_expires_at');
    
    if (users.length === 0) {
      console.log('❌ No users with OTP codes found');
      return;
    }
    
    console.log(`✅ Found ${users.length} user(s) with OTP codes:\n`);
    
    users.forEach((user, index) => {
      const isExpired = new Date() > new Date(user.otp_expires_at);
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   Name: ${user.fullname}`);
      console.log(`   OTP: ${user.otp_code}`);
      console.log(`   Expires: ${user.otp_expires_at}`);
      console.log(`   Status: ${isExpired ? '❌ EXPIRED' : '✅ VALID'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

getOTP();
