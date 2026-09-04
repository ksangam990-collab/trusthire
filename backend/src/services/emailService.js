import nodemailer from 'nodemailer';

// ─── HTML escaping ─────────────────────────────────────────────────────────────
// FIX (MEDIUM): All user-supplied values (name, job title, seeker name) used to be
// interpolated directly into HTML email bodies without escaping. A user who
// registered with a name like <script src=//evil.com/x.js></script> would inject
// that payload into every email sent to any recipient (employer, admin, etc.).
const escapeHtml = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

let transporter = null;

if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    // FIX (LOW): secure should be true only when using port 465 (implicit TLS).
    // Previously it was hardcoded to false, which means connections on port 465
    // would fail to establish a proper TLS session.
    secure: parseInt(process.env.EMAIL_PORT || '587', 10) === 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    // FIX (LOW): Enforce TLS certificate validation in production so that the
    // nodemailer transport cannot be MITM'd by a server with an invalid cert.
    tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' },
  });
}

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"TrustHire" <${process.env.EMAIL_FROM || 'noreply@trusthire.in'}>`,
    to,
    subject,
    html,
  };
  try {
    if (!transporter) {
      console.log(`[Email] Dev simulation → To: ${to} | Subject: ${subject}`);
      return { messageId: 'simulated' };
    }
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('[Email] Delivery error:', error.message);
    return { error: error.message };
  }
};

export const sendVerificationEmail = async (user, token) => {
  const url  = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${encodeURIComponent(token)}`;
  const name = escapeHtml(user.name);
  return sendEmail({
    to: user.email,
    subject: 'Verify your TrustHire account',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#059669">Welcome to TrustHire, ${name}!</h2>
        <p>Click the button below to verify your email address. This link expires in 24 hours.</p>
        <a href="${url}" style="display:inline-block;background:#059669;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600">Verify Email</a>
        <p style="color:#666;font-size:13px;margin-top:20px">If the button doesn't work, paste this link in your browser:<br/>
          <span style="word-break:break-all">${url}</span></p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#999;font-size:12px">TrustHire — India's Verified Zero-Scam Hiring Infrastructure</p>
      </div>`,
  });
};

export const sendPasswordResetEmail = async (user, token) => {
  const url  = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${encodeURIComponent(token)}`;
  const name = escapeHtml(user.name);
  return sendEmail({
    to: user.email,
    subject: 'Reset your TrustHire password',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#059669">Password Reset Request</h2>
        <p>Hi ${name}, someone requested a password reset for your account. If this wasn't you, you can safely ignore this email.</p>
        <a href="${url}" style="display:inline-block;background:#059669;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600">Reset Password</a>
        <p style="color:#666;font-size:13px;margin-top:20px">This link expires in <strong>15 minutes</strong>.</p>
        <p style="color:#999;font-size:12px">Never share this link with anyone.</p>
      </div>`,
  });
};

export const sendApplicationNotification = async (employerEmail, jobTitle, seekerName) => {
  const safeJob    = escapeHtml(jobTitle);
  const safeSeeker = escapeHtml(seekerName);
  return sendEmail({
    to: employerEmail,
    subject: `New application for ${safeJob}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#059669">New Application Received</h2>
        <p><strong>${safeSeeker}</strong> has submitted an application for <strong>${safeJob}</strong>.</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/employer/dashboard"
           style="display:inline-block;background:#059669;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600">View in Dashboard</a>
      </div>`,
  });
};

export const sendFraudReportConfirmation = async (userEmail) => {
  if (!userEmail) return;
  return sendEmail({
    to: userEmail,
    subject: 'Fraud report received — TrustHire Security Radar',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#059669">Incident Report Logged</h2>
        <p>Thank you for contributing to TrustHire ecosystem safety. Your report has been queued for moderation review.</p>
      </div>`,
  });
};
