import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '../../api';
import { Spinner } from '../../components/ui/Skeleton';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await authApi.forgotPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send password reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 theme-transition">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Reset Password</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your registered email address to receive password recovery details.
          </p>
        </div>

        {success ? (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reset Email Dispatched</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              If an account exists for <strong className="font-mono">{email}</strong>, you will receive password reset instructions.
            </p>
            <Link to="/login" className="inline-block mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Return to Sign In
            </Link>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center space-x-2 text-xs shadow-sm"
              >
                {loading ? <Spinner className="w-4 h-4 text-white" /> : null}
                <span>{loading ? 'Dispatching...' : 'Send Recovery Link'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link to="/login" className="inline-flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
