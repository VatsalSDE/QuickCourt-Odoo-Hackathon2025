require('dotenv').config();
const { sendSMS, isSMSConfigured } = require('./utils/sms');
const { otpSMSTemplate } = require('./utils/smsTemplates');

async function testSMS() {
  console.log('🧪 Testing SMS Functionality...\n');
  
  try {
    const testPhone = '+1234567890'; // Replace with your test phone number
    const testName = 'Test User';
    const testOtp = '123456';
    
    console.log('📱 Test Details:');
    console.log('To:', testPhone);
    console.log('Name:', testName);
    console.log('OTP:', testOtp);
    console.log('Twilio Configured:', isSMSConfigured());
    console.log('');
    
    const message = otpSMSTemplate({ name: testName, otp: testOtp });
    
    console.log('📝 SMS Content:');
    console.log('Message:', message);
    console.log('');
    
    console.log('📤 Attempting to send SMS...');
    const result = await sendSMS({
      to: testPhone,
      message: message
    });
    
    console.log('✅ SMS test completed successfully!');
    console.log('Result:', result);
    
  } catch (error) {
    console.error('❌ SMS test failed:', error.message);
    console.error('Full error:', error);
  }
}

testSMS();
