import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, ShieldAlert, UploadCloud, CheckCircle2, Lock } from 'lucide-react';
import { fraudApi } from '../../api';

export default function ReportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [employerId, setEmployerId] = useState(searchParams.get('employerId') || '');
  const [jobId, setJobId] = useState(searchParams.get('jobId') || '');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employerId.trim() || !title.trim() || !description.trim()) {
      setErrorMessage('Employer ID, summary title, and detailed incident description are required.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('employerId', employerId.trim());
      if (jobId) formData.append('jobId', jobId.trim());
      formData.append('fraudCategory', fraudCategory);
      formData.append('severity', severity);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('amountDemanded', amountDemanded || '0');
      formData.append('isAnonymous', String(isAnonymous));

      for (let i = 0; i < evidenceFiles.length; i++) {
        formData.append('evidence', evidenceFiles[i]);
      }

      await fraudApi.submitReport(formData);
      setSuccessMessage('Your report has been securely registered and flagged for moderation.');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Report Recruitment Fraud</h1>
            <p className="text-xs text-slate-400">Submit evidence of security deposits, fake offers, or impersonations.</p>
          </div>
        </div>

        {successMessage ? (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Report Filed Anonymously</h3>
            <p className="text-xs text-slate-300">{successMessage}</p>
            <button
              onClick={() => navigate('/fraud-board')}
              className="px-4 py-2 bg-emerald-400 text-slate-900 rounded-lg text-xs font-semibold"
            >
              Go to Public Fraud Board
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1">Employer Mongo ID *</label>
              <input
                type="text"
                required
                value={employerId}
                onChange={(e) => setEmployerId(e.target.value)}
                placeholder="e.g. 64d9f10a8b..."
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Scam Category *</label>
                <select
                  value={fraudCategory}
                  onChange={(e) => setFraudCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="Registration Fee / Security Deposit">Registration Fee / Security Deposit</option>
                  <option value="Fake Offer Letter">Fake Offer Letter</option>
                  <option value="Identity Theft / Document Misuse">Identity Theft / Document Misuse</option>
                  <option value="Phishing / Impersonation">Phishing / Impersonation</option>
                  <option value="Unpaid Trial Work">Unpaid Trial Work</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Amount Demanded (INR)</label>
                <input
                  type="number"
                  value={amountDemanded}
                  onChange={(e) => setAmountDemanded(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Summary Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Demanded ₹5,000 laptop security deposit prior to interview"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Detailed Incident Description *</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what transpired, communication channel used (WhatsApp/Email), bank details requested, etc."
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Evidence Documents / Screenshots (Max 4)</label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => setEvidenceFiles(Array.from(e.target.files))}
                className="w-full text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-emerald-400 cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center space-x-2">
              <input
                type="checkbox"
                id="anon"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-emerald-400 focus:ring-0"
              />
              <label htmlFor="anon" className="text-slate-300 cursor-pointer">
                Submit completely anonymously (Your name and email will not be recorded)
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold transition disabled:opacity-50"
            >
              {submitting ? 'Encrypting & Transmitting Report...' : 'Submit Incident Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}