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

const CIN_REGEX = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const validateCINFormat = (cin) => CIN_REGEX.test(cin.toUpperCase().trim());
const validateGSTINFormat = (gstin) => GSTIN_REGEX.test(gstin.toUpperCase().trim());

/**
 * Verify company by CIN using MCA21 API
 * Returns standardized verification result object
 */
const verifyCIN = async (cin) => {
  const cleanCIN = cin.toUpperCase().trim();

  if (!validateCINFormat(cleanCIN)) {
    return {
      success: false,
      error: 'Invalid CIN format. A valid CIN looks like: U74999MH2020PTC123456',
    };
  }

  try {
    // In production: call MCA21 API
    // The MCA company master data is publicly accessible
    // Endpoint: GET https://www.mca.gov.in/mcafoportal/getCompanyMasterData.do?cin={CIN}
    //
    // For now, we simulate the API structure:
    if (process.env.NODE_ENV === 'development' || !process.env.MCA_API_BASE) {
      return simulateCINVerification(cleanCIN);
    }

    const response = await fetch(
      `${process.env.MCA_API_BASE}?cin=${cleanCIN}`,
      {
        headers: { 'User-Agent': 'TrustHire-Verification/1.0' },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      throw new Error(`MCA API responded with status ${response.status}`);
    }

    const data = await response.json();

    // Parse MCA response format
    if (!data || data.errorCode) {
      return { success: false, error: 'Company not found in MCA records.' };
    }

    return {
      success: true,
      data: {
        registeredName: data.company_name || data.companyName,
        cin: cleanCIN,
        incorporationDate: data.date_of_incorporation
          ? new Date(data.date_of_incorporation)
          : null,
        companyType: data.company_class || data.companyClass,
        registeredState: data.registered_state || data.state,
        status: data.company_status,
        verifiedVia: 'cin',
        verifiedAt: new Date(),
      },
    };
  } catch (error) {
    console.error('CIN verification error:', error.message);
    return {
      success: false,
      error: 'Could not reach verification service. Try again later.',
    };
  }
};

/**
 * Verify company by GSTIN
 */
const verifyGSTIN = async (gstin) => {
  const cleanGSTIN = gstin.toUpperCase().trim();

  if (!validateGSTINFormat(cleanGSTIN)) {
    return {
      success: false,
      error: 'Invalid GSTIN format. Example: 27AAPFU0939F1ZV',
    };
  }

  try {
    if (process.env.NODE_ENV === 'development' || !process.env.GST_API_KEY) {
      return simulateGSTINVerification(cleanGSTIN);
    }

    const response = await fetch(
      `${process.env.GST_API_BASE}/${process.env.GST_API_KEY}/${cleanGSTIN}`,
      { signal: AbortSignal.timeout(8000) }
    );

    if (!response.ok) {
      throw new Error(`GST API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (!data?.flag || data.data?.sts !== 'Active') {
      return {
        success: false,
        error: data?.data?.sts === 'Cancelled'
          ? 'GSTIN is cancelled. Company may no longer be active.'
          : 'GSTIN not found or inactive.',
      };
    }

    const gstData = data.data;
    return {
      success: true,
      data: {
        registeredName: gstData.lgnm || gstData.tradeNam,
        gstin: cleanGSTIN,
        incorporationDate: gstData.rgdt ? new Date(gstData.rgdt) : null,
        companyType: gstData.ctb,
        registeredState: getStateFromGSTIN(cleanGSTIN),
        status: gstData.sts,
        verifiedVia: 'gstin',
        verifiedAt: new Date(),
      },
    };
  } catch (error) {
    console.error('GSTIN verification error:', error.message);
    return {
      success: false,
      error: 'Could not reach verification service. Try again later.',
    };
  }
};

// Extract state from first 2 digits of GSTIN
const getStateFromGSTIN = (gstin) => {
  const stateCode = gstin.substring(0, 2);
  const stateMap = {
    '01': 'Jammu & Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab',
    '04': 'Chandigarh', '05': 'Uttarakhand', '06': 'Haryana',
    '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh',
    '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh',
    '13': 'Nagaland', '14': 'Manipur', '15': 'Mizoram',
    '16': 'Tripura', '17': 'Meghalaya', '18': 'Assam',
    '19': 'West Bengal', '20': 'Jharkhand', '21': 'Odisha',
    '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
    '27': 'Maharashtra', '28': 'Andhra Pradesh', '29': 'Karnataka',
    '30': 'Goa', '32': 'Kerala', '33': 'Tamil Nadu',
    '34': 'Puducherry', '36': 'Telangana', '37': 'Andhra Pradesh (New)',
  };
  return stateMap[stateCode] || 'Unknown';
};

// ── Development Simulators ────────────────────────────────────────────────────
// These simulate real API responses so you can develop without API keys.
// Returns verified for even-first-digit CINs, failed for odd.

const simulateCINVerification = (cin) => {
  const firstDigit = parseInt(cin.replace(/\D/g, '')[0]);
  if (firstDigit % 2 !== 0) {
    return { success: false, error: '[DEV] Company not found in MCA records.' };
  }
  return {
    success: true,
    data: {
      registeredName: `${cin.slice(8, 10)} Technologies Private Limited`,
      cin,
      incorporationDate: new Date('2019-06-15'),
      companyType: 'Private Limited',
      registeredState: 'Jharkhand',
      status: 'Active',
      verifiedVia: 'cin',
      verifiedAt: new Date(),
    },
  };
};

const simulateGSTINVerification = (gstin) => {
  const firstDigit = parseInt(gstin[0]);
  if (firstDigit > 5) {
    return { success: false, error: '[DEV] GSTIN not found or inactive.' };
  }
  return {
    success: true,
    data: {
      registeredName: `${gstin.slice(2, 7)} Enterprises`,
      gstin,
      incorporationDate: new Date('2018-04-01'),
      companyType: 'Proprietorship',
      registeredState: getStateFromGSTIN(gstin),
      status: 'Active',
      verifiedVia: 'gstin',
      verifiedAt: new Date(),
    },
  };
};

module.exports = {
  verifyCIN,
  verifyGSTIN,
  validateCINFormat,
  validateGSTINFormat,
};
