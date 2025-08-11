const nodemailer = require('nodemailer');
const config = require('../config/config');

let transporter;

function createTransporter() {
  const { host, port, user, pass } = config.smtp;
  console.log('[EMAIL DEBUG] SMTP Config:', { host, port, user: user ? '***' : 'undefined', pass: pass ? '***' : 'undefined' });
  
  if (!user || !pass) {
    console.log('[EMAIL DEBUG] No SMTP credentials, using console fallback');
    // Fallback transport that logs emails to console if SMTP is not configured
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });
  }
  
  console.log('[EMAIL DEBUG] Creating SMTP transporter');
  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });
}

function getTransporter() {
  if (!transporter) transporter = createTransporter();
  return transporter;
}

function isEmailConfigured() {
  return Boolean(config.smtp.user && config.smtp.pass);
}

async function sendEmail({ to, subject, text, html }) {
  const tx = getTransporter();
  const from = config.smtp.user ? `QuickCourt <${config.smtp.user}>` : 'QuickCourt <no-reply@quickcourt.local>';
  
  console.log(`[EMAIL DEBUG] Attempting to send email to: ${to}`);
  console.log(`[EMAIL DEBUG] From: ${from}`);
  console.log(`[EMAIL DEBUG] Subject: ${subject}`);
  
  try {
    const info = await tx.sendMail({ from, to, subject, text, html });
    
    if (!isEmailConfigured()) {
      // Log the message content to console in dev fallback mode
      console.log('\n[EMAIL FALLBACK] Email content logged to console:');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Text:', text);
      console.log('HTML:', html);
      console.log('---\n');
    } else {
      console.log('[EMAIL DEBUG] Email sent successfully via SMTP');
    }
    
    return info;
  } catch (err) {
    console.error('[EMAIL ERROR] Email send failed:', err.message);
    console.error('[EMAIL ERROR] Full error:', err);
    
    // Always log the email content when there's an error
    console.log('\n[EMAIL ERROR FALLBACK] Email content (due to SMTP error):');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    console.log('HTML:', html);
    console.log('---\n');
    
    throw err;
  }
}

module.exports = { sendEmail, isEmailConfigured };


