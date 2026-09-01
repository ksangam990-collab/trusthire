import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"TrustHire" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email send error:', error.message);
    throw error;
  }
};

const sendVerificationEmail = async (user, token) => {
  const url = `${process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your TrustHire account',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#1a3c5e">Welcome to TrustHire, ${user.name}!</h2>
        <p>Click the button below to verify your email address. This link expires in 24 hours.</p>
        <a href="${url}" style="display:inline-block;background:#1a3c5e;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600">
          Verify Email
        </a>
        <p style="color:#666;font-size:13px;margin-top:20px">
          If the button doesn't work, paste this link in your browser:<br/>
          <a href="${url}">${url}</a>
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#999;font-size:12px">TrustHire — India's Verified Job Board</p>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (user, token) => {
  const url = `${process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your TrustHire password',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#1a3c5e">Password Reset</h2>
        <p>Hi ${user.name}, someone requested a password reset for your account. If this wasn't you, ignore this email.</p>
        <a href="${url}" style="display:inline-block;background:#1a3c5e;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600">
          Reset Password
        </a>
        <p style="color:#666;font-size:13px;margin-top:20px">This link expires in 15 minutes.</p>
      </div>
    `,
  });
};

const sendApplicationNotification = async (employer, jobTitle, seekerName) => {
  await sendEmail({
    to: employer.email,
    subject: `New application for ${jobTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#1a3c5e">New Application Received</h2>
        <p><strong>${seekerName}</strong> has applied for <strong>${jobTitle}</strong>.</p>
        <a href="${process.env.CLIENT_URL}/employer/applications" 
           style="display:inline-block;background:#1a3c5e;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600">
          View Application
        </a>
      </div>
    `,
  });
};

const sendFraudReportConfirmation = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Fraud report received — TrustHire',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#1a3c5e">Your report has been received</h2>
        <p>Thank you for helping keep TrustHire safe. Your fraud report has been logged and will be reviewed by our team.</p>
        <p>Once 3 or more reports of the same type are verified, the listing is automatically suspended pending review.</p>
        <p style="color:#666;font-size:13px">You submitted this report anonymously — your identity will not be shared.</p>
      </div>
    `,
  });
};

export {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendApplicationNotification,
  sendFraudReportConfirmation,
};
