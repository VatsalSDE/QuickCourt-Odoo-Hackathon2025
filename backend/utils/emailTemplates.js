function otpEmailTemplate({ name, otp }) {
  const plain = `Hi ${name},\n\nYour QuickCourt verification code is: ${otp}\nIt expires in 15 minutes.\n\nIf you did not request this, you can ignore this email.\n\nThanks,\nQuickCourt Team`;

  const html = `
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto;">
    <h2 style="color:#111">Verify your email</h2>
    <p>Hi ${name},</p>
    <p>Your QuickCourt verification code is:</p>
    <div style="font-size:28px; font-weight:700; letter-spacing:6px; background:#f6f6f6; padding:16px 20px; border-radius:8px; text-align:center;">${otp}</div>
    <p style="color:#555">This code expires in 15 minutes.</p>
    <p style="color:#777; font-size: 12px;">If you did not request this, you can ignore this email.</p>
    <p>Thanks,<br/>QuickCourt Team</p>
  </div>`;

  return { plain, html };
}

module.exports = { otpEmailTemplate };


