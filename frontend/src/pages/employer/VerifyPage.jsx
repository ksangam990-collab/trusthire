import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { employersAPI } from '../../api';
import { Spinner, ErrorMessage } from '../../components/ui';
import toast from 'react-hot-toast';

export default function VerifyPage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('cin');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = method === 'cin' ? { cin: value } : { gstin: value };
      const res = await employersAPI.verify(payload);
      setResult(res.data);
      toast.success('Company verified successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Check your number and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result?.verificationStatus === 'verified') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-trust-green" />
        </div>
        <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">
          Company verified!
        </h2>
        <p className="text-slate-500 mb-2">
          Registered as{' '}
          <strong>{result.verificationData?.registeredName}</strong>
        </p>
        <p className="text-sm text-slate-400 mb-6">
          {result.verificationData?.companyType} · {result.verificationData?.registeredState} ·
          Trust score: {result.trustScore}/100
        </p>
        <button onClick={() => navigate('/employer/dashboard')} className="btn-primary">
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-navy-600 rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Verify your company</h1>
          <p className="text-sm text-slate-500">Takes under 2 minutes. Free forever.</p>
        </div>
      </div>

      <div className="card p-6 mb-4">
        <div className="bg-navy-50 border border-navy-100 rounded-xl px-4 py-3 mb-5 text-sm text-navy-700 flex items-start gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            We verify your company against India's official MCA21 (for CIN) and GST records. This is
            the same database used by banks and auditors. Verification confirms your company legally
            exists — it is not an endorsement.
          </p>
        </div>

        {/* Method toggle */}
        <div className="flex rounded-lg border border-slate-200 p-1 mb-5">
          {['cin', 'gstin'].map((m) => (
            <button
              key={m}
              onClick={() => { setMethod(m); setValue(''); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                method === m ? 'bg-navy-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m === 'cin' ? 'CIN (Company ID)' : 'GSTIN'}
            </button>
          ))}
        </div>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        <div className="mb-4">
          <label className="label">
            {method === 'cin' ? 'Company Identification Number (CIN)' : 'GSTIN'}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            className="input font-mono tracking-wider"
            placeholder={method === 'cin' ? 'U74999MH2020PTC123456' : '27AAPFU0939F1ZV'}
            maxLength={method === 'cin' ? 21 : 15}
          />
          <p className="text-xs text-slate-400 mt-1.5">
            {method === 'cin'
              ? 'Find your CIN on your Certificate of Incorporation from MCA.'
              : 'Find your GSTIN on your GST Registration Certificate.'}
          </p>
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || value.length < 10}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading && <Spinner className="w-4 h-4" />}
          {loading ? 'Verifying…' : `Verify via ${method.toUpperCase()}`}
        </button>
      </div>

      <div className="text-xs text-slate-400 space-y-1.5 px-1">
        <p>✓ Verification checks against live government records</p>
        <p>✓ Your CIN/GSTIN is never stored raw — only verification status is kept</p>
        <p>✓ Getting verified doesn't guarantee job listings are legitimate — TrustHire only confirms the company legally exists</p>
      </div>
    </div>
  );
}
