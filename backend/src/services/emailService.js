import nodemailer from 'nodemailer';

let transporter = null;

if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"TrustHire Security" <${process.env.EMAIL_FROM || 'noreply@trusthire.in'}>`,
    to,
    subject,
    html,
  };

  try {
    if (!transporter) {
      console.log(`[Email Service Simulation] Sent to: ${to} | Subject: ${subject}`);
      return { messageId: 'simulated-delivery' };
    }
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('[Email Service Warning]:', error.message);
    return { error: error.message };
  }
};

export const sendVerificationEmail = async (user, token) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  return await sendEmail({
    to: user.email,
    subject: 'Verify your TrustHire account',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#059669">Welcome to TrustHire, ${user.name}!</h2>
        <p>Click the button below to verify your email address. This link expires in 24 hours.</p>
        <a href="${url}" style="display:inline-block;background:#059669;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600">
          Verify Email
        </a>
        <p style="color:#666;font-size:13px;margin-top:20px">
          If the button doesn't work, paste this link in your browser:<br/>
          <a href="${url}">${url}</a>
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#999;font-size:12px">TrustHire — India's Verified Zero-Scam Hiring Infrastructure</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (user, token) => {
  const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  return await sendEmail({
    to: user.email,
    subject: 'Reset your TrustHire password',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#059669">Password Reset Request</h2>
        <p>Hi ${user.name}, someone requested a password reset for your account. If this wasn't you, ignore this email.</p>
        <a href="${url}" style="display:inline-block;background:#059669;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600">
          Reset Password
        </a>
        <p style="color:#666;font-size:13px;margin-top:20px">This link expires in 15 minutes.</p>
      </div>
    `,
  });
};

export const sendApplicationNotification = async (employerEmail, jobTitle, seekerName) => {
  return await sendEmail({
    to: employerEmail,
    subject: `New application for ${jobTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#059669">New Application Received</h2>
        <p><strong>${seekerName}</strong> has submitted an application for <strong>${jobTitle}</strong>.</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/employer/dashboard" 
           style="display:inline-block;background:#059669;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600">
          View in Dashboard
        </a>
      </div>
    `,
  });
};

export const sendFraudReportConfirmation = async (userEmail) => {
  if (!userEmail) return;
  return await sendEmail({
    to: userEmail,
    subject: 'Fraud report received — TrustHire Security Radar',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#059669">Incident Report Logged</h2>
        <p>Thank you for contributing to TrustHire ecosystem safety. Your fraud incident report has been securely queued for moderation review.</p>
      </div>
    `,
  });
};

