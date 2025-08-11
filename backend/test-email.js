// test-email.js
const nodemailer = require('nodemailer');

async function test() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: '07darshanpokar@gmail.com',
      pass: 'tggivtwgqrjwpzei',
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"QuickCourt" <07darshanpokar@gmail.com>',
      to: 'YOUR_EMAIL@example.com',
      subject: 'Test Email',
      text: 'This is a test email from Nodemailer',
    });
    console.log('✅ Email sent:', info.response);
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

test();
