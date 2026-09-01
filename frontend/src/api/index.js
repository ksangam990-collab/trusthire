import apiClient from './client';

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (payload) => apiClient.post('/auth/register', payload),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: () => apiClient.post('/auth/refresh'),
  getCurrentUser: () => apiClient.get('/auth/me'),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (payload) => apiClient.post('/auth/reset-password', payload)
};

export const jobsApi = {
  getJobs: (params) => apiClient.get('/jobs', { params }),
  getJobById: (id) => apiClient.get(`/jobs/${id}`),
  createJob: (jobData) => apiClient.post('/jobs', jobData),
  updateJob: (id, jobData) => apiClient.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => apiClient.delete(`/jobs/${id}`)
};

export const fraudApi = {
  getBoard: (params) => apiClient.get('/fraud/board', { params }),
  submitReport: (formData) =>
    apiClient.post('/fraud/report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  updateReportStatus: (reportId, data) => apiClient.patch(`/fraud/reports/${reportId}/status`, data)
};

export const employerApi = {
  getProfile: () => apiClient.get('/employers/profile'),
  updateProfile: (data) => apiClient.put('/employers/profile', data),
  verifyCompany: (credentials) => apiClient.post('/employers/verify', credentials),
  getMetrics: () => apiClient.get('/employers/metrics'),
  getPublicEmployers: (params) => apiClient.get('/employers', { params })
};

export const applicationsApi = {
  apply: (formData) =>
    apiClient.post('/applications/apply', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getCandidateApplications: () => apiClient.get('/applications/my-applications'),
  getEmployerApplicants: (jobId) =>
    apiClient.get(jobId ? `/applications/employer/candidates/${jobId}` : '/applications/employer/candidates'),
  updateStatus: (applicationId, data) => apiClient.patch(`/applications/status/${applicationId}`, data)
};

export const profileApi = {
  getProfile: () => apiClient.get('/profile/me'),
  updateProfile: (data) => apiClient.put('/profile/me', data),
  getCandidateProfile: () => apiClient.get('/profile/candidate'),
  updateCandidateProfile: (data) => apiClient.put('/profile/candidate', data)
};

// Aliases for compatibility
export const authAPI = authApi;
export const jobsAPI = jobsApi;
export const fraudAPI = fraudApi;
export const employerAPI = employerApi;
export const applicationsAPI = applicationsApi;
export const profileAPI = profileApi;