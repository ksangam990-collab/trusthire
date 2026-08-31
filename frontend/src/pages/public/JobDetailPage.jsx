import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { jobsApi, applicationsApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import TrustScoreBadge from "../../components/ui/TrustScoreBadge";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker } = useAuthStore();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Application Modal / Drawer state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await jobsApi.getJobById(id);
        setJob(res?.data?.job || null);
      } catch (err) {
        setErrorMessage(err.message || "Job listing not found or removed.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setErrorMessage("Please attach your resume document (PDF/DOCX).");
      return;
    }

    setApplying(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("jobId", id);
      formData.append("resume", resumeFile);
      formData.append("coverLetter", coverLetter);
      formData.append("contactPhone", contactPhone);
      formData.append("portfolioUrl", portfolioUrl);

      await applicationsApi.apply(formData);
      setAppliedSuccess(true);
      setShowApplyModal(false);
    } catch (err) {
      setErrorMessage(err.message || "Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Job listing not found</h2>
        <p className="text-xs text-slate-400">
          {errorMessage || "This opening may have expired or been removed."}
        </p>
        <Link
          to="/jobs"
          className="inline-block px-4 py-2 rounded-lg bg-emerald-400 text-slate-900 font-semibold text-xs"
        >
          Browse Active Jobs
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
    employerTrustScore,
  } = job;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to search results</span>
      </Link>

      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xl flex-shrink-0">
            {employer?.logo ? (
              <img
                src={employer.logo}
                alt={employer.companyName}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              employer?.companyName?.charAt(0) || (
                <Building2 className="w-8 h-8 text-slate-500" />
              )
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm font-semibold text-slate-300">
                {employer?.companyName}
              </span>
              {isFromVerifiedEmployer && (
                <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>MCA CIN Verified</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
              <span className="inline-flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />{" "}
                {location?.city}, {location?.country} ({workplaceType})
              </span>
              <span className="inline-flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {jobType} •{" "}
                {experienceLevel}
              </span>
              <span className="inline-flex items-center space-x-1 text-slate-200">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> ₹
                {(salary?.min / 100000).toFixed(1)}L - ₹
                {(salary?.max / 100000).toFixed(1)}L / yr
              </span>
            </div>
          </div>
        </div>

        {/* Trust badge & CTA */}
        <div className="flex flex-col sm:items-end gap-3 flex-shrink-0">
          <TrustScoreBadge
            score={employerTrustScore || employer?.trustScore || 40}
            size="lg"
          />
          {appliedSuccess ? (
            <div className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Application Submitted</span>
            </div>
          ) : (
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login");
                } else if (!isJobSeeker()) {
                  setErrorMessage(
                    "Please log in with a Job Seeker account to apply.",
                  );
                } else {
                  setShowApplyModal(true);
                }
              }}
              className="px-6 py-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold text-sm transition shadow-lg shadow-emerald-500/10"
            >
              Apply with TrustShield
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Job Content */}
        <div className="lg:col-span-8 space-y-6">
          <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs font-mono text-emerald-400">
              Job Description
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </section>

          {responsibilities?.length > 0 && (
            <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-white">
                Key Responsibilities
              </h3>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                {responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </section>
          )}

          {requirements?.length > 0 && (
            <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-white">
                Requirements & Qualifications
              </h3>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                {requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {skills?.length > 0 && (
            <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-white">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700"
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
          <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Trust & Verification Audit</span>
            </h3>

            <div className="space-y-3 text-xs border-t border-slate-800 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Statutory MCA/CIN</span>
                <span className="text-emerald-400 font-medium">
                  {employer?.cin ? "Verified (Govt DB)" : "Unverified"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Domain Authenticity</span>
                <span className="text-emerald-400 font-medium">100% Match</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Verified Fraud Reports</span>
                <span className="text-slate-200 font-mono font-bold">
                  {employer?.verifiedFraudReports || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Overall Integrity Score</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {employerTrustScore || employer?.trustScore || 40}/100
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <Link
                to={`/report-fraud?employerId=${employer?._id}&jobId=${job._id}`}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Notice suspicious demands? Report this listing</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Application Drawer / Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Apply to {title}
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Resume Document (PDF/DOCX) *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Portfolio / LinkedIn Link
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Cover Note
                </label>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Briefly state your core background and why you are a fit..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold rounded-lg disabled:opacity-50 flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {applying ? "Submitting..." : "Submit Application"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
