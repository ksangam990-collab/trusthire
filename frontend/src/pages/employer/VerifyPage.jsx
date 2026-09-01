import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, ArrowLeft, Building2, AlertCircle } from 'lucide-react';
import { employerApi } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { Spinner } from '../../components/ui/Skeleton';

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
    setStep(2);

    try {
      const res = await employerApi.verifyCompany({ cin: cin.trim(), gstin: gstin.trim() });
      setVerificationResult(res?.data || null);
      updateUser({ verificationStatus: 'verified' });
      setStep(3);
    } catch (err) {
      setErrorMessage(err.message || 'Verification failed. Please double-check formatting.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 theme-transition">
      <Link
        to="/employer/dashboard"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-10 rounded-3xl bg-white/90 dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl space-y-6"
      >
        {/* Step Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">MCA & GST Statutory Verification</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Validate statutory registry identifiers to attain TrustHire Verified status.</p>
            </div>
          </div>
          <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            STEP {step} OF 3
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs rounded-2xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleVerificationSubmit} className="space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">Statutory Validation Pipeline:</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your 21-digit Corporate Identification Number (CIN) or 15-digit GSTIN is matched against Ministry of Corporate Affairs records. Verified organizations gain +30 TrustScore points, Verified MCA badges, and elevated applicant priority.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Corporate Identification Number (CIN)
              </label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value.toUpperCase())}
                placeholder="e.g. U72900KA2021PTC145678"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-emerald-500 font-semibold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Format: 21 alphanumeric characters</span>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Goods and Services Tax ID (GSTIN)
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="e.g. 29AAAAA0000A1Z5"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-emerald-500 font-semibold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Format: 15 alphanumeric characters</span>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-300 text-white dark:text-slate-900 font-bold rounded-2xl transition flex items-center space-x-2 shadow-sm"
              >
                <span>Validate & Issue Trust Badge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="py-14 flex flex-col items-center space-y-4 text-center">
            <Spinner className="w-12 h-12 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Validating Statutory Registry...</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Performing cryptographic check against Ministry of Corporate Affairs and GST identity nodes.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Corporate Identity Verified</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your organization has attained official TrustHire Verified status.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-w-sm mx-auto text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Updated Trust Score</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black">{verificationResult?.trustScore || 85}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Marketplace Status</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">100% VERIFIED</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/employer/dashboard')}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-300 text-white dark:text-slate-900 font-bold text-xs shadow-sm"
            >
              Enter Employer Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
