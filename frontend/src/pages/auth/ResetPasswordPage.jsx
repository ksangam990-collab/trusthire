import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '../../api';
import { Spinner } from '../../components/ui/Skeleton';

export default function ResetPasswordPage() {
  const [searchParams]    = useSearchParams();
  const navigate          = useNavigate();
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading,         setLoading]         = useState(false);
  const [success,         setSuccess]         = useState(false);
  const [error,           setError]           = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) setError('No reset token found. Please request a new password reset link.');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword.length < 8)         { setError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true); setError('');
    try {
      await authApi.resetPassword({ token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired — please request a new one.');
    } finally { setLoading(false); }
  };

  const inputCls = 'w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs';

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 theme-transition">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Set New Password</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">This link expires in 15 minutes.</p>
        </div>

        {success ? (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Password Reset Successful</h3>
            <p className="text-xs text-slate-500">Redirecting you to login…</p>
            <Link to="/login" className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Go to Sign In</Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!token ? (
              <div className="text-center">
                <Link to="/forgot-password" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                  Request a new password reset link →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">New Password (min. 8 characters)</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input type="password" required minLength={8} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 text-xs shadow-sm">
                  {loading && <Spinner className="w-4 h-4 text-white" />}
                  <span>{loading ? 'Resetting…' : 'Reset Password'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}

            <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link to="/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold hover:underline">
                ← Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
