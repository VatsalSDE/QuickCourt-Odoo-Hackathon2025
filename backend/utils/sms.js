const twilio = require('twilio');
const config = require('../config/config');

let twilioClient;

function createTwilioClient() {
  const { accountSid, authToken } = config.twilio;
  console.log('[SMS DEBUG] Twilio Config:', { 
    accountSid: accountSid ? '***' : 'undefined', 
    authToken: authToken ? '***' : 'undefined' 
  });
  
  if (!accountSid || !authToken) {
    console.log('[SMS DEBUG] No Twilio credentials, using console fallback');
    return null;
  }
  
  console.log('[SMS DEBUG] Creating Twilio client');
  return twilio(accountSid, authToken);
}

function getTwilioClient() {
  if (!twilioClient) twilioClient = createTwilioClient();
  return twilioClient;
}

function isSMSConfigured() {
  return Boolean(config.twilio.accountSid && config.twilio.authToken);
}

async function sendSMS({ to, message }) {
  console.log(`[SMS DEBUG] Attempting to send SMS to: ${to}`);
  console.log(`[SMS DEBUG] Message: ${message}`);
  
  if (!isSMSConfigured()) {
    // Log the message content to console in dev fallback mode
    console.log('\n[SMS FALLBACK] SMS content logged to console:');
    console.log('To:', to);
    console.log('Message:', message);
    console.log('---\n');
    return { success: true, sid: 'fallback' };
  }
  
  try {
    const client = getTwilioClient();
    const result = await client.messages.create({
      body: message,
      from: config.twilio.phoneNumber,
      to: to
    });
    
    console.log('[SMS DEBUG] SMS sent successfully via Twilio');
    console.log('[SMS DEBUG] Message SID:', result.sid);
    
    return { success: true, sid: result.sid };
  } catch (err) {
    console.error('[SMS ERROR] SMS send failed:', err.message);
    console.error('[SMS ERROR] Full error:', err);
    
    // Always log the SMS content when there's an error
    console.log('\n[SMS ERROR FALLBACK] SMS content (due to Twilio error):');
    console.log('To:', to);
    console.log('Message:', message);
    console.log('---\n');
    
    throw err;
  }
}

module.exports = { sendSMS, isSMSConfigured };
