import client from './client';

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  logout: () => client.post('/auth/logout'),
  getMe: () => client.get('/auth/me'),
  verifyEmail: (token) => client.get(`/auth/verify-email?token=${token}`),
  resendVerification: () => client.post('/auth/resend-verification'),
  forgotPassword: (email) => client.post('/auth/forgot-password', { email }),
  resetPassword: (data) => client.post('/auth/reset-password', data),
};

// ── Jobs ──────────────────────────────────────────────────────────────────────
export const jobsAPI = {
  getJobs: (params) => client.get('/jobs', { params }),
  getJob: (id) => client.get(`/jobs/${id}`),
  createJob: (data) => client.post('/jobs', data),
  updateJob: (id, data) => client.patch(`/jobs/${id}`, data),
  updateJobStatus: (id, status) => client.patch(`/jobs/${id}/status`, { status }),
  getMyListings: (params) => client.get('/jobs/employer/mine', { params }),
  toggleSave: (id) => client.post(`/jobs/${id}/save`),
  applyToJob: (id, data) => client.post(`/jobs/${id}/apply`, data),
};

// ── Employers ─────────────────────────────────────────────────────────────────
export const employersAPI = {
  getMyProfile: () => client.get('/employers/me'),
  getPublicProfile: (id) => client.get(`/employers/${id}/profile`),
  verify: (data) => client.post('/employers/verify', data),
  updateProfile: (data) => client.patch('/employers/me', data),
};

// ── Applications ──────────────────────────────────────────────────────────────
export const applicationsAPI = {
  getMyApplications: (params) => client.get('/applications/mine', { params }),
  getJobApplications: (jobId, params) =>
    client.get(`/applications/job/${jobId}`, { params }),
  updateStatus: (id, data) => client.patch(`/applications/${id}/status`, data),
};

// ── Fraud Reports ─────────────────────────────────────────────────────────────
export const fraudAPI = {
  submitReport: (formData) =>
    client.post('/fraud-reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getEmployerSummary: (employerId) =>
    client.get(`/fraud-reports/employer/${employerId}`),
  // Admin
  getAllReports: (params) => client.get('/fraud-reports/admin/all', { params }),
  reviewReport: (id, data) => client.patch(`/fraud-reports/admin/${id}`, data),
};
