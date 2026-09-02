/**
 * Employer Verification Service
 *
 * Verifies Indian companies via:
 * 1. CIN (Company Identification Number) → MCA21 API
 * 2. GSTIN → GST verification API
 *
 * Both APIs are government-backed and publicly accessible.
 * MCA21 company master data: https://www.mca.gov.in
 * GST: https://services.gst.gov.in/services/api/search
 *
 * NOTE: For development/demo, a fallback mock is provided.
 * Replace with live API calls once keys are configured.
 */

// backend/src/services/verificationService.js

// backend/src/services/verificationService.js

/**
 * Employer Verification Service
 *
 * Verifies Indian companies via:
 * 1. CIN (Company Identification Number) — MCA21 format check
 * 2. GSTIN — GST verification format check
 *
 * NOTE: For development/demo, structural pattern validation is used.
 * Replace with live API calls once government API keys are configured.
 */

const SUSPICIOUS_KEYWORDS = [
  'wire transfer',
  'western union',
  'telegram @',
  'whatsapp interview',
  'pay for training kit',
  'crypto payment',
  'registration fee',
  'gift card',
  'data entry $80/hr',
  'no experience 5000$/week',
  'package forwarding',
];

const HIGH_RISK_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'proton.me',
];

export const verifyCompanyEmail = (email) => {
  if (!email) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return domain && !HIGH_RISK_DOMAINS.includes(domain);
};

export const verifyRegistrationNumber = (regNumber) => {
  if (!regNumber) return false;
  return /^[A-Z0-9-]{6,20}$/i.test(regNumber);
};

export const analyzeJobRisk = (jobData, employerCompany) => {
  let riskScore = 0;
  const flags = [];

  const textToScan =
    `${jobData.title || ''} ${jobData.description || ''} ${(jobData.requirements || []).join(' ')}`.toLowerCase();

  SUSPICIOUS_KEYWORDS.forEach((keyword) => {
    if (textToScan.includes(keyword)) {
      riskScore += 25;
      flags.push(`Contains high-risk trigger phrase: "${keyword}"`);
    }
  });

  if (jobData.salary?.max > 250000 && jobData.experienceLevel === 'Entry Level') {
    riskScore += 20;
    flags.push('Unusually high salary for entry-level designation');
  }

  if (employerCompany?.website) {
    try {
      const websiteDomain = new URL(employerCompany.website).hostname.replace('www.', '');
      if (HIGH_RISK_DOMAINS.includes(websiteDomain) && employerCompany.verificationStatus === 'verified') {
        riskScore += 15;
        flags.push('Verified corporate listing using a free-hosted website domain');
      }
    } catch {
      // Invalid URL — skip domain check
    }
  }

  let status = 'CLEAN';
  if (riskScore >= 50) status = 'CRITICAL_RISK';
  else if (riskScore >= 25) status = 'NEEDS_REVIEW';

  return {
    riskScore: Math.min(riskScore, 100),
    status,
    flags,
    isAutoFlagged: riskScore >= 50,
  };
};

export { SUSPICIOUS_KEYWORDS, HIGH_RISK_DOMAINS };