import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, HelpCircle } from 'lucide-react';
import { employerApi } from '../../api';
import { useAuthStore } from '../../store/authStore';
import { Spinner } from '../../components/ui/Skeleton';

const steps = ['Enter Details', 'Checking...', 'Verified!'];

export default function VerifyPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const [cin, setCin] = useState('');
  const [gstin, setGstin] = useState('');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cin.trim() && !gstin.trim()) { setError('Please enter your CIN or GSTIN number.'); return; }
    setError(''); setLoading(true); setStep(1);
    try {
      const res = await employerApi.verifyCompany({ cin: cin.trim(), gstin: gstin.trim() });
      setResult(res?.data || null);
      updateUser({ verificationStatus: 'verified' });
      setStep(2);
    } catch (err) {
      setError(err.message || 'Verification failed. Please double-check your details and try again.');
      setStep(0);
    } finally { setLoading(false); }
  };

  const inputCls = "w-full px-3.5 py-2.5 text-sm font-mono uppercase bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition tracking-wider";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6 theme-transition">
      <Link to="/employer/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Step Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${i === step ? 'text-emerald-600 dark:text-emerald-400' : i < step ? 'text-slate-500' : 'text-slate-300 dark:text-slate-600'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] border ${i === step ? 'bg-emerald-600 text-white border-emerald-600' : i < step ? 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-500' : 'border-slate-200 dark:border-slate-700 text-slate-400'}`}>{i + 1}</span>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Company Verification</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Verify your company via MCA21 or GST Portal to get a Verified badge.</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 0 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-700 dark:text-blue-300 flex gap-2">
              <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong>What happens after verification?</strong>
                <p className="mt-1 opacity-80">Your company gets a Verified badge on all job listings. Trust Score jumps by +30 points. Candidates are more likely to apply to verified employers.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Corporate Identification Number (CIN)</label>
              <input type="text" value={cin} onChange={e => setCin(e.target.value.toUpperCase())} placeholder="U72900KA2021PTC145678" className={inputCls} />
              <p className="mt-1 text-[11px] text-slate-400">21 characters — find it on the MCA21 portal</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs text-slate-400 font-semibold">OR</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">GST Identification Number (GSTIN)</label>
              <input type="text" value={gstin} onChange={e => setGstin(e.target.value.toUpperCase())} placeholder="29AAAAA0000A1Z5" className={inputCls} />
              <p className="mt-1 text-[11px] text-slate-400">15 characters — find it on the GST Portal</p>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-sm disabled:opacity-60">
                <span>Verify Company</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <div className="py-14 flex flex-col items-center gap-4 text-center">
            <Spinner className="w-10 h-10 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Checking your details...</h3>
            <p className="text-xs text-slate-500 max-w-xs">We are matching your CIN/GSTIN against official government records. This usually takes a few seconds.</p>
          </div>
        )}

        {step === 2 && (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">You are now Verified!</h2>
              <p className="text-xs text-slate-500 mt-1">Your company has been confirmed. A Verified badge will now appear on all your job listings.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-w-xs mx-auto text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Trust Score</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">{result?.trustScore || 85} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Company Status</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Verified</span>
              </div>
            </div>
            <button onClick={() => navigate('/employer/dashboard')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer transition shadow-sm">
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
