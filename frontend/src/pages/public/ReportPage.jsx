import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, UploadCloud, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { fraudApi, employerApi } from '../../api';
import { Spinner } from '../../components/ui/Skeleton';

export default function ReportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [employersList, setEmployersList] = useState([]);
  const [selectedEmployerId, setSelectedEmployerId] = useState(searchParams.get('employerId') || '');
  const [jobId, setJobId] = useState(searchParams.get('jobId') || '');
  const [customOrgName, setCustomOrgName] = useState('');
  const [fraudCategory, setFraudCategory] = useState('Registration Fee / Security Deposit');
  const [severity, setSeverity] = useState('High');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amountDemanded, setAmountDemanded] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const res = await employerApi.getPublicEmployers();
        setEmployersList(res?.data?.employers || []);
      } catch (err) {
        console.error('Failed to load employers list:', err);
      }
    };
    fetchEmployers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const targetEmployerId = selectedEmployerId || (employersList[0]?._id);
    if (!targetEmployerId && !customOrgName.trim()) {
      setErrorMessage('Please select or specify the reported organization.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setErrorMessage('Summary title and detailed incident description are required.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('employerId', targetEmployerId);
      if (jobId) formData.append('jobId', jobId.trim());
      formData.append('fraudCategory', fraudCategory);
      formData.append('severity', severity);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('amountDemanded', amountDemanded || '0');
      formData.append('isAnonymous', String(isAnonymous));

      for (let i = 0; i < evidenceFiles.length; i++) {
        formData.append('evidence', evidenceFiles[i]);
      }

      await fraudApi.submitReport(formData);
      setSuccessMessage('Your report has been securely registered and queued on the TrustHire Fraud Radar for verification.');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 theme-transition">
      <Link to="/fraud-board" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Fraud Radar</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-10 rounded-3xl bg-white/90 dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-6"
      >
        <div className="flex items-center space-x-3.5 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Report Recruitment Fraud</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Submit evidence of security deposits, fake offer letters, or phishing scams.</p>
          </div>
        </div>

        {successMessage ? (
          <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Incident Report Filed</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">{successMessage}</p>
            <div className="pt-2">
              <Link
                to="/fraud-board"
                className="inline-block px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                View Public Fraud Board
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-2xl">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target Organization / Entity *</label>
              {employersList.length > 0 ? (
                <select
                  value={selectedEmployerId}
                  onChange={(e) => setSelectedEmployerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="">Select an entity from directory</option>
                  {employersList.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.companyName} {emp.verificationStatus === 'verified' ? '(Verified)' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={selectedEmployerId}
                  onChange={(e) => setSelectedEmployerId(e.target.value)}
                  placeholder="Employer MongoDB ObjectId or identifier..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Scam Category *</label>
                <select
                  value={fraudCategory}
                  onChange={(e) => setFraudCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:outline-none font-medium"
                >
                  <option value="Registration Fee / Security Deposit">Registration Fee / Security Deposit</option>
                  <option value="Fake Offer Letter">Fake Offer Letter</option>
                  <option value="Identity Theft / Document Misuse">Identity Theft / Document Misuse</option>
                  <option value="Phishing / Impersonation">Phishing / Impersonation</option>
                  <option value="Unpaid Trial Work">Unpaid Trial Work</option>
                  <option value="Misleading Salary / Job Role">Misleading Salary / Job Role</option>
                  <option value="Other Fraudulent Activity">Other Fraudulent Activity</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Amount Demanded (INR)</label>
                <input
                  type="number"
                  value={amountDemanded}
                  onChange={(e) => setAmountDemanded(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Summary Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Demanded ₹4,500 background check charge via WhatsApp before interview"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Detailed Incident Description *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the timeline, channel used (WhatsApp/Telegram/Email), UPI / payment details requested, etc."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Evidence Files / Screenshots (Max 4)</label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => setEvidenceFiles(Array.from(e.target.files))}
                className="w-full text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 dark:file:bg-slate-800 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-slate-200 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center space-x-2.5">
              <input
                type="checkbox"
                id="anon"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-0"
              />
              <label htmlFor="anon" className="text-slate-700 dark:text-slate-300 cursor-pointer select-none font-medium">
                Submit completely anonymously (Your name & contact info will not be revealed)
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md shadow-rose-500/20"
            >
              {submitting && <Spinner className="w-4 h-4 text-white" />}
              <span>{submitting ? 'Transmitting Incident Report...' : 'Submit Incident Report'}</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
