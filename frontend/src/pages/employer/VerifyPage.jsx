import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, ArrowLeft, Building2, AlertCircle } from 'lucide-react';
import { employerApi } from '../../api';
import { useAuthStore } from '../../store/authStore';

export default function VerifyPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const [cin, setCin] = useState('');
  const [gstin, setGstin] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!cin.trim() && !gstin.trim()) {
      setErrorMessage('Please provide either an MCA CIN or GSTIN identifier.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setStep(2); // In processing state

    try {
      const res = await employerApi.verifyCompany({ cin: cin.trim(), gstin: gstin.trim() });
      setVerificationResult(res?.data || null);
      updateUser({ verificationStatus: 'verified' });
      setStep(3); // Success state
    } catch (err) {
      setErrorMessage(err.message || 'Verification failed. Please double-check formatting.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <button
        onClick={() => navigate('/employer/dashboard')}
        className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>

      <div className="p-6 sm:p-10 rounded-2xl bg-[#111827] border border-slate-800 shadow-xl space-y-6">
        {/* Step Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">MCA / GST Corporate Verification</h1>
              <p className="text-xs text-slate-400">Statutory entity validation gateway for Indian registered employers.</p>
            </div>
          </div>
          <div className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            STEP {step} OF 3
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleVerificationSubmit} className="space-y-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-semibold text-slate-200">How verification works:</span>
              <p className="text-slate-400 leading-relaxed">
                Your provided 21-digit Corporate Identification Number (CIN) or 15-digit GSTIN is verified against Ministry of Corporate Affairs records. Verified employers gain +30 TrustScore points and Verified MCA badges.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Corporate Identification Number (CIN)
              </label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value.toUpperCase())}
                placeholder="e.g. U72900KA2021PTC145678"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono uppercase"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Format: 21 alphanumeric characters (e.g. U + 5 digits + 2 letters + 4 digits + 3 letters + 6 digits)</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Goods and Services Tax ID (GSTIN)
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="e.g. 29AAAAA0000A1Z5"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono uppercase"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Format: 15 alphanumeric characters</span>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold rounded-lg transition flex items-center space-x-2"
              >
                <span>Validate & Issue Trust Badge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="py-12 flex flex-col items-center space-y-4 text-center">
            <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <h3 className="text-base font-bold text-white">Validating Statutory Registry...</h3>
            <p className="text-xs text-slate-400 max-w-sm">Querying Ministry of Corporate Affairs & GST verification nodes.</p>
          </div>
        )}

        {step === 3 && (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Corporate Identity Verified</h2>
              <p className="text-xs text-slate-400 mt-1">Your organization has attained official TrustHire Verified status.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-sm mx-auto text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">New Trust Score</span>
                <span className="text-emerald-400 font-mono font-bold">{verificationResult?.trustScore || 80}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-400 font-bold">VERIFIED</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/employer/dashboard')}
              className="px-6 py-3 rounded-lg bg-emerald-400 text-slate-900 font-bold text-xs"
            >
              Enter Employer Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}