function otpSMSTemplate({ name, otp }) {
  return `Hi ${name}, your QuickCourt verification code is: ${otp}. It expires in 15 minutes. If you didn't request this, please ignore.`;
}

module.exports = { otpSMSTemplate };
