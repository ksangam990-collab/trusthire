import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, CheckCircle2, AlertCircle, Send, ArrowLeft, Building2, X, Share2, Copy, Clock } from 'lucide-react';
import { jobsApi, applicationsApi } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../components/ui/Toast';
import TrustScoreBadge from '../../components/ui/TrustScoreBadge';
import { Spinner } from '../../components/ui/Skeleton';

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">{title}</h2>
      {children}
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { addToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [portfolio, setPortfolio] = useState('');
  const [resume, setResume] = useState(null);

  useEffect(() => {
    jobsApi.getJobById(id)
      .then(r => setJob(r?.data?.job || null))
      .catch(err => setError(err.message || 'Job not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) { setError('Please upload your resume.'); return; }
    setApplying(true); setError('');
    try {
      const fd = new FormData();
      fd.append('jobId', id); fd.append('resume', resume);
      fd.append('coverLetter', coverLetter); fd.append('contactPhone', phone);
      fd.append('portfolioUrl', portfolio);
      await applicationsApi.apply(fd);
      setApplied(true); setShowModal(false);
      addToast('Application sent to ' + (job?.employer?.companyName || 'the employer'));
    } catch (err) {
      setError(err.message || 'Application failed.');
    } finally { setApplying(false); }
  };

  const timeAgo = (d) => {
    if (!d) return '';
    const days = Math.floor((Date.now() - new Date(d)) / 86400000);
    if (days <= 0) return 'Posted today';
    return `Posted ${days} day${days !== 1 ? 's' : ''} ago`;
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
      <div className="h-6 w-32 animate-pulse bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-48 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="h-64 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />
    </div>
  );

  if (!job) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Job not found</h2>
      <p className="text-sm text-slate-500">{error || 'This listing may have been filled or removed.'}</p>
      <Link to="/jobs" className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition">Browse Jobs</Link>
    </div>
  );

  const { title, employer, location, salary, jobType, workplaceType, experienceLevel, description, responsibilities, requirements, skills, isFromVerifiedEmployer, employerTrustScore, createdAt } = job;
  const midSalary = salary?.max ? (salary.min + salary.max) / 2 : salary?.min || 0;
  const inHand = Math.round((midSalary / 12) * 0.80);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 theme-transition">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> All Jobs
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); addToast('Link copied!'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
            <Copy className="w-3.5 h-3.5" /> Copy Link
          </button>
          <button onClick={() => { const t = `Job at ${employer?.companyName}: ${title} — ${window.location.href}`; window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(t)}`, '_blank'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl hover:bg-emerald-100 transition cursor-pointer">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xl text-slate-600 dark:text-slate-300 flex-shrink-0 overflow-hidden">
                {employer?.logo ? <img src={employer.logo} alt="" className="w-full h-full object-cover" /> : (employer?.companyName?.charAt(0) || <Building2 className="w-7 h-7 text-slate-400" />)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 truncate">{employer?.companyName}</span>
                  {isFromVerifiedEmployer && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Verified Company
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{location?.city}, {location?.country || 'India'} · {workplaceType}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{jobType} · {experienceLevel}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{timeAgo(createdAt)}</span>
                </div>
              </div>
            </div>

            {salary?.min > 0 && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide block">Annual CTC</span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />{(salary.min / 100000).toFixed(1)}L – {((salary.max || salary.min) / 100000).toFixed(1)}L
                  </span>
                </div>
                {midSalary > 0 && (
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">Estimated monthly in-hand</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">~Rs {inHand.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Apply / Applied */}
            {applied ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Application submitted! The employer will contact you directly.
              </div>
            ) : !isAuthenticated ? (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-700 dark:text-blue-300 flex items-center justify-between">
                <span>Sign in to apply for this job.</span>
                <Link to="/login" state={{ from: { pathname: `/jobs/${id}` } }} className="font-bold underline">Sign In</Link>
              </div>
            ) : user?.role === 'jobseeker' ? (
              <button onClick={() => setShowModal(true)}
                className="w-full py-3 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-sm">
                <Send className="w-4 h-4" /> Apply for This Job
              </button>
            ) : null}

            <p className="text-[11px] text-center text-slate-400">No application fee. Employers on TrustHire are never allowed to charge candidates.</p>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            {description && (
              <Section title="About This Role">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{description}</p>
              </Section>
            )}
            {responsibilities?.length > 0 && (
              <Section title="What You Will Do">
                <ul className="space-y-1.5">
                  {responsibilities.map((r, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>{r}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {requirements?.length > 0 && (
              <Section title="What You Need">
                <ul className="space-y-1.5">
                  {requirements.map((r, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>{r}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {skills?.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">{s}</span>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Company Info</h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between"><span>Company</span><span className="font-semibold text-slate-900 dark:text-white text-right max-w-[140px] truncate">{employer?.companyName}</span></div>
              <div className="flex justify-between"><span>Industry</span><span className="font-semibold text-slate-900 dark:text-white">{employer?.industry || 'N/A'}</span></div>
              <div className="flex justify-between"><span>Size</span><span className="font-semibold text-slate-900 dark:text-white">{employer?.companySize || 'N/A'}</span></div>
              <div className="flex justify-between"><span>Trust Score</span><TrustScoreBadge score={employerTrustScore || employer?.trustScore} size="sm" /></div>
            </div>
            {employer?.website && (
              <a href={employer.website} target="_blank" rel="noreferrer" className="block text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Visit Company Website</a>
            )}
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">Red flag checklist</h4>
            <ul className="text-[11px] text-amber-700 dark:text-amber-400 space-y-1.5">
              {['Never pay a registration fee to apply','Don\'t share Aadhaar/PAN with unverified contacts','Real jobs have a proper interview process','Verify company on MCA21 before sharing documents'].map((t, i) => (
                <li key={i} className="flex items-start gap-1.5"><span className="mt-0.5">⚠️</span> {t}</li>
              ))}
            </ul>
          </div>

          <Link to={`/report-fraud?employerId=${employer?._id}`} className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer">
            Report suspicious activity
          </Link>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 dark:text-white">Apply for {title}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer text-slate-500"><X className="w-5 h-5" /></button>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Resume *</label>
                <label className="flex items-center gap-3 p-3 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-400 rounded-xl cursor-pointer transition">
                  <div className="text-xs text-slate-500 flex-1">{resume ? resume.name : 'Choose PDF or DOCX file...'}</div>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => { if (e.target.files[0]) setResume(e.target.files[0]); }} className="hidden" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">Browse</span>
                </label>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Contact phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Portfolio / LinkedIn (optional)</label>
                <input type="url" value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://linkedin.com/in/yourname"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Cover letter (optional)</label>
                <textarea rows={3} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Why are you a good fit for this role?"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none" />
              </div>
              <button type="submit" disabled={applying}
                className="w-full py-3 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition cursor-pointer">
                {applying ? <Spinner className="w-4 h-4 text-white" /> : <Send className="w-4 h-4" />}
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <p className="text-[11px] text-center text-slate-400">This application is completely free. No payment will ever be required.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
