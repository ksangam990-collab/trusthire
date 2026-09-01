import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '../../api';
import { Spinner } from '../../components/ui/Skeleton';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#111827] border border-slate-800 shadow-2xl space-y-6">
        <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-glow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Password Recovery</h1>
          <p className="text-xs text-slate-400">Enter your registered email address to receive reset instructions.</p>
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-slate-300">
              If an account with <strong>{email}</strong> exists, recovery instructions have been sent.
            </p>
            <Link to="/login" className="inline-block px-5 py-2.5 bg-emerald-400 text-slate-900 font-bold rounded-xl text-xs">
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1">Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center space-x-2 text-xs shadow-glow-sm"
            >
              {loading && <Spinner className="w-4 h-4 text-slate-900" />}
              <span>{loading ? 'Transmitting Request...' : 'Send Recovery Link'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
