import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, ShieldAlert, UploadCloud, CheckCircle2, ArrowLeft, AlertCircle, X } from 'lucide-react';
import { fraudApi, employerApi } from '../../api';
import { Spinner } from '../../components/ui/Skeleton';

const CATEGORIES = [
  'Registration Fee / Security Deposit',
  'Fake Offer Letter',
  'Identity Theft / Document Misuse',
  'Phishing / Impersonation',
  'Unpaid Trial Work',
  'Misleading Salary / Job Role',
  'Other Fraudulent Activity',
];

export default function ReportPage() {
  const [searchParams] = useSearchParams();
  const [employers, setEmployers] = useState([]);
  const [selectedEmployerId, setSelectedEmployerId] = useState(searchParams.get('employerId') || '');
  const [customOrgName, setCustomOrgName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [severity, setSeverity] = useState('High');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    employerApi.getPublicEmployers().then(r => setEmployers(r?.data?.employers || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployerId && !customOrgName.trim()) { setError('Please select or name the company involved.'); return; }
    if (!title.trim() || !description.trim()) { setError('Please fill in a title and description.'); return; }
    setSubmitting(true); setError('');
    try {
      const fd = new FormData();
      fd.append('employerId', selectedEmployerId || '');
      if (customOrgName.trim()) fd.append('customOrgName', customOrgName.trim());
      fd.append('fraudCategory', category);
      fd.append('severity', severity);
      fd.append('title', title.trim());
      fd.append('description', description.trim());
      fd.append('amountDemanded', amount || '0');
      fd.append('isAnonymous', String(anonymous));
      files.forEach(f => fd.append('evidence', f));
      await fraudApi.submitReport(fd);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally { setSubmitting(false); }
  };

  const inputCls = "w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6 theme-transition">
      <Link to="/fraud-board" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
        <ArrowLeft className="w-4 h-4" /> Back to Fraud Board
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Report a Recruitment Scam</h1>
            <p className="text-xs text-slate-500">Help protect others by sharing your experience. All reports are reviewed by our team.</p>
          </div>
        </div>

        {done ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Report Submitted</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">Your report has been received. Our team will review it and publish it to the fraud board if verified. Thank you for keeping the hiring ecosystem safe.</p>
            <Link to="/fraud-board" className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition cursor-pointer">
              View Fraud Board
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Company involved *</label>
              {employers.length > 0 ? (
                <select value={selectedEmployerId} onChange={e => setSelectedEmployerId(e.target.value)} className={inputCls}>
                  <option value="">Select a company...</option>
                  {employers.map(e => (
                    <option key={e._id} value={e._id}>{e.companyName}{e.verificationStatus === 'verified' ? ' (Verified)' : ''}</option>
                  ))}
                </select>
              ) : null}
              {!selectedEmployerId && (
                <input type="text" value={customOrgName} onChange={e => setCustomOrgName(e.target.value)}
                  placeholder="Company name (if not in list above)"
                  className={`${inputCls} ${employers.length > 0 ? 'mt-2' : ''}`} />
              )}
            </div>

            {/* Category + Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Scam type *</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Severity</label>
                <select value={severity} onChange={e => setSeverity(e.target.value)} className={inputCls}>
                  {['Critical','High','Medium','Low'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Amount demanded (INR) — if any</label>
              <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000 (leave blank if none)" className={inputCls} />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Short title *</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Demanded Rs 4,500 before interview via WhatsApp"
                className={inputCls} maxLength={120} />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">What happened? (Details) *</label>
              <textarea rows={5} required value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe the incident clearly. Include dates, how you were contacted, what was asked of you, and any red flags..."
                className={inputCls + ' resize-none'} />
            </div>

            {/* Evidence Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Attach evidence (optional)</label>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-700 rounded-xl p-5 cursor-pointer transition">
                <UploadCloud className="w-7 h-7 text-slate-400" />
                <span className="text-xs text-slate-500">Screenshots, offer letters, chat history (JPG, PNG, PDF — max 5MB each)</span>
                <input type="file" multiple accept="image/*,.pdf" onChange={e => setFiles(Array.from(e.target.files || []))} className="hidden" />
              </label>
              {files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {files.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg">
                      {f.name.slice(0, 20)}{f.name.length > 20 ? '...' : ''}
                      <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-slate-400 hover:text-rose-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Anonymous toggle */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} className="w-4 h-4 mt-0.5 rounded accent-rose-600 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Submit anonymously (recommended)</span>
                <span className="text-[11px] text-slate-500">Your identity will not be visible on the public fraud board.</span>
              </div>
            </label>

            <div className="pt-2 flex justify-end">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-sm">
                {submitting ? <Spinner className="w-4 h-4 text-white" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
