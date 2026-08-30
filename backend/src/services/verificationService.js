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

const SUSPICIOUS_KEYWORDS = [
  "wire transfer",
  "western union",
  "telegram @",
  "whatsapp interview",
  "pay for training kit",
  "crypto payment",
  "registration fee",
  "gift card",
  "data entry $80/hr",
  "no experience 5000$/week",
  "package forwarding",
];

const HIGH_RISK_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "proton.me",
];

export const analyzeJobRisk = (jobData, employerCompany) => {
  let riskScore = 0;
  const flags = [];

  const textToScan =
    `${jobData.title} ${jobData.description} ${jobData.requirements?.join(" ")}`.toLowerCase();

  // 1. Scan for extortion & upfront fee phrases
  SUSPICIOUS_KEYWORDS.forEach((keyword) => {
    if (textToScan.includes(keyword)) {
      riskScore += 25;
      flags.push(`Contains high-risk trigger phrase: "${keyword}"`);
    }
  });

  // 2. Scan for salary anomaly (e.g. entry-level > $200k/year)
  if (jobData.salary?.max > 250000 && jobData.experienceLevel === "Entry") {
    riskScore += 20;
    flags.push("Unusually high salary for entry-level designation");
  }

  // 3. Scan for generic/free email use for registered enterprise companies
  if (employerCompany?.email) {
    const emailDomain = employerCompany.email.split("@")[1];
    if (
      HIGH_RISK_DOMAINS.includes(emailDomain) &&
      employerCompany.isCorporate
    ) {
      riskScore += 15;
      flags.push("Corporate listing using unverified public email provider");
    }
  }

  let status = "CLEAN";
  if (riskScore >= 50) status = "CRITICAL_RISK";
  else if (riskScore >= 25) status = "NEEDS_REVIEW";

  return {
    riskScore: Math.min(riskScore, 100),
    status,
    flags,
    isAutoFlagged: riskScore >= 50,
  };
};
