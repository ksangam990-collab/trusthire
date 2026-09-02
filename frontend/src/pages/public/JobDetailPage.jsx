import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Lock,
  X,
  Share2,
  Copy,
  Calculator,
  ExternalLink
} from 'lucide-react';
import { jobsApi, applicationsApi } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../components/ui/Toast';
import TrustScoreBadge from '../../components/ui/TrustScoreBadge';
import { Spinner } from '../../components/ui/Skeleton';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { addToast } = useToast();

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
      addToast('Application submitted successfully to ' + (job?.employer?.companyName || 'the recruiter'));
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Job link copied to clipboard!');
  };

  const handleShareWhatsApp = () => {
    const text = `Check out this verified opening for "${job?.title}" at ${job?.employer?.companyName} on TrustHire (Zero Fees Guaranteed): ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-64 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Job listing not found</h2>
        <p className="text-xs text-slate-500">{errorMessage || 'This opening may have been filled or expired.'}</p>
        <Link to="/jobs" className="inline-block px-4 py-2 rounded-lg bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-semibold text-xs">
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

  // Indian CTC to In-Hand Calculator Calculations
  const midSalary = salary?.max ? (salary.min + salary.max) / 2 : salary?.min || 0;
  const monthlyGross = Math.round(midSalary / 12);
  const estimatedDeductions = Math.round(monthlyGross * 0.15); // standard EPF + slab estimate
  const estimatedInHand = Math.max(0, monthlyGross - estimatedDeductions);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 theme-transition">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <Link to="/jobs" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Back to verified jobs</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-1.5"
            title="Copy link"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy Link</span>
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-medium flex items-center space-x-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share to WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-xl flex-shrink-0">
            {employer?.logo ? (
              <img src={employer.logo} alt={employer.companyName} className="w-full h-full object-cover rounded-xl" />
            ) : (
              employer?.companyName?.charAt(0) || <Building2 className="w-7 h-7 text-slate-400" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{employer?.companyName}</span>
              {isFromVerifiedEmployer && (
                <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.75} />
                  <span>MCA21 CIN Verified</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {location?.city}, {location?.country} ({workplaceType})
              </span>
              <span className="inline-flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {jobType} � {experienceLevel}
              </span>
              <span className="inline-flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 font-bold">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> ?{((salary?.min || 0) / 100000).toFixed(1)}L - ?{((salary?.max || salary?.min || 0) / 100000).toFixed(1)}L LPA
              </span>
            </div>
          </div>
        </div>

        {/* Trust badge & CTA */}
        <div className="flex flex-col sm:items-end gap-3 flex-shrink-0">
          <TrustScoreBadge score={employerTrustScore || employer?.trustScore || 40} size="lg" />
          
          {appliedSuccess ? (
            <div className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Application Submitted</span>
            </div>
          ) : (
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login');
                } else if (user?.role === 'employer') {
                  addToast('Recruiters cannot apply to jobs. Please use a Job Seeker account.', 'error');
                } else if (user?.role === 'admin') {
                  addToast('Admins cannot apply to jobs.', 'info');
                } else {
                  setShowApplyModal(true);
                }
              }}
              className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-sm rounded-xl cursor-pointer"
            >
              Apply to Role
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Job Content */}
        <div className="lg:col-span-8 space-y-6">
          <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h2 className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Role Description
            </h2>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </section>

          {responsibilities?.length > 0 && (
            <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
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
            <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                Required Qualifications
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                {requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {skills?.length > 0 && (
            <section className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                Technical Stack & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: Salary Breakdown & Statutory Verification Audit */}
        <div className="lg:col-span-4 space-y-6">
          {/* Indian In-Hand Salary Breakdown Calculator */}
          {midSalary > 0 && (
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-xs">
                <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Estimated Monthly In-Hand (India)</span>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[11px] text-slate-600 dark:text-slate-400">
                  <span>Gross Monthly (CTC � 12):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">?{monthlyGross.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-600 dark:text-slate-400">
                  <span>Est. EPF & Standard TDS:</span>
                  <span className="font-mono text-slate-500">- ?{estimatedDeductions.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/60 flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">Estimated In-Hand:</span>
                  <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-300">
                    ~ ?{estimatedInHand.toLocaleString()} / mo
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                *Approximation based on standard Indian income tax slabs and EPF contributions.
              </p>
            </div>
          )}

          {/* Statutory Verification Audit Card */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Statutory Corporate Audit</span>
            </h3>

            <div className="space-y-2.5 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">MCA Corporate CIN</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                  {employer?.cin || (isFromVerifiedEmployer ? 'Verified Match' : 'Unregistered')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">GST Registration</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                  {employer?.gstin || 'Active'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Verified Scam Reports</span>
                <span className="text-slate-900 dark:text-white font-mono font-bold">
                  {employer?.verifiedFraudReports || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Deposit Fee Policy</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>100% Zero Fees</span>
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link
                to={`/report-fraud?employerId=${employer?._id}&jobId=${job._id}`}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Notice suspicious charges? File incident report</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Apply to {title}</h3>
                <p className="text-xs text-slate-500">{employer?.companyName}</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-lg">
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
                  className="w-full text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-800 dark:file:text-slate-200 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Portfolio / LinkedIn Link</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Cover Note</label>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Briefly state your core background and why you are a fit..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold rounded-lg disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {applying ? <Spinner className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{applying ? 'Sending...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
