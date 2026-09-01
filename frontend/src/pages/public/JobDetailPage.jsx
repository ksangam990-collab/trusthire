import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  AlertCircle, 
  Send, 
  ArrowLeft, 
  Building2, 
  UploadCloud,
  FileCheck,
  Lock,
  X
} from 'lucide-react';
import { jobsApi, applicationsApi } from '../../api';
import { useAuthStore } from '../../store/authStore';
import TrustScoreBadge from '../../components/ui/TrustScoreBadge';
import { Spinner } from '../../components/ui/Skeleton';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobsApi.getJobById(id);
        setJob(res?.data?.job || null);
      } catch (err) {
        setErrorMessage(err.message || 'Job listing not found or expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setErrorMessage('Please attach your resume document (PDF/DOCX).');
      return;
    }

    setApplying(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('resume', resumeFile);
      formData.append('coverLetter', coverLetter);
      formData.append('contactPhone', contactPhone);
      formData.append('portfolioUrl', portfolioUrl);

      await applicationsApi.apply(formData);
      setAppliedSuccess(true);
      setShowApplyModal(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Job listing not found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{errorMessage || 'This opening may have been filled or expired.'}</p>
        <Link to="/jobs" className="inline-block px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs">
          Browse Active Openings
        </Link>
      </div>
    );
  }

  const {
    title,
    employer,
    location,
    salary,
    jobType,
    workplaceType,
    experienceLevel,
    description,
    responsibilities,
    requirements,
    skills,
    isFromVerifiedEmployer,
    employerTrustScore
  } = job;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 theme-transition">
      {/* Back button */}
      <Link to="/jobs" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to search results</span>
      </Link>

      {/* Hero Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#0f172a]/85 border border-slate-200/90 dark:border-slate-800 shadow-sm backdrop-blur-xl flex flex-col md:flex-row md:items-start justify-between gap-6"
      >
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-xl flex-shrink-0">
            {employer?.logo ? (
              <img src={employer.logo} alt={employer.companyName} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              employer?.companyName?.charAt(0) || <Building2 className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{employer?.companyName}</span>
              {isFromVerifiedEmployer && (
                <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>MCA CIN Verified</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {location?.city}, {location?.country} ({workplaceType})
              </span>
              <span className="inline-flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {jobType} • {experienceLevel}
              </span>
              <span className="inline-flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 font-bold">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> ₹{(salary?.min / 100000).toFixed(1)}L - ₹{(salary?.max / 100000).toFixed(1)}L / yr
              </span>
            </div>
          </div>
        </div>

        {/* Trust badge & CTA */}
        <div className="flex flex-col sm:items-end gap-3 flex-shrink-0">
          <TrustScoreBadge score={employerTrustScore || employer?.trustScore || 40} size="lg" />
          {appliedSuccess ? (
            <div className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Application Submitted</span>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login');
                } else if (user?.role === 'employer') {
                  setErrorMessage('Recruiters cannot apply to jobs. Please use a Job Seeker account.');
                } else {
                  setShowApplyModal(true);
                }
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-300 text-white dark:text-slate-900 font-bold text-xs sm:text-sm transition shadow-sm"
            >
              Apply with TrustShield
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Job Content */}
        <div className="lg:col-span-8 space-y-6">
          <section className="p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-[#0f172a]/75 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl shadow-sm space-y-4">
            <h2 className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Job Description
            </h2>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </section>

          {responsibilities?.length > 0 && (
            <section className="p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-[#0f172a]/75 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl shadow-sm space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                Key Responsibilities
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                {responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </section>
          )}

          {requirements?.length > 0 && (
            <section className="p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-[#0f172a]/75 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl shadow-sm space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                Requirements & Qualifications
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                {requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {skills?.length > 0 && (
            <section className="p-6 sm:p-7 rounded-3xl bg-white/90 dark:bg-[#0f172a]/75 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl shadow-sm space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                Required Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: Security & Employer Integrity Profile */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0f172a]/85 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Trust & Verification Audit</span>
            </h3>

            <div className="space-y-3 text-xs border-t border-slate-200 dark:border-slate-800 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Statutory MCA/CIN</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                  {employer?.cin ? employer.cin : (employer?.verificationStatus === 'verified' ? 'Verified' : 'Unverified')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Corporate GSTIN</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                  {employer?.gstin ? employer.gstin : 'Verified'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Verified Fraud Reports</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold">
                  {employer?.verifiedFraudReports || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Application Security</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>No Fee Guarantee</span>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <Link
                to={`/report-fraud?employerId=${employer?._id}&jobId=${job._id}`}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Notice suspicious charges? Report listing</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Apply to {title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{employer?.companyName}</p>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Resume Document (PDF/DOCX) *
                  </label>
                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="w-full text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 dark:file:bg-slate-800 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Portfolio / LinkedIn Link</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Cover Note</label>
                  <textarea
                    rows={3}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly state your core background and why you are a fit..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-300 text-white dark:text-slate-900 font-bold rounded-xl disabled:opacity-50 flex items-center space-x-2 shadow-sm"
                  >
                    {applying ? <Spinner className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    <span>{applying ? 'Sending...' : 'Submit Application'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
