import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { authAPI } from '../../api';
import { Spinner } from '../../components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-navy-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-navy-600 text-xl">TrustHire</span>
        </Link>

        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h2 className="font-display font-bold text-xl text-slate-900 mb-2">Check your email</h2>
              <p className="text-sm text-slate-500 mb-6">
                If <strong>{email}</strong> is registered, we've sent a password reset link. It expires in 15 minutes.
              </p>
              <Link to="/login" className="btn-primary w-full block text-center">
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
              <h1 className="font-display font-bold text-2xl text-slate-900 mb-2">Forgot password?</h1>
              <p className="text-sm text-slate-500 mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              {error && (
                <div className="mb-4 text-sm text-trust-red bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <button type="submit" disabled={loading || !email} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading && <Spinner className="w-4 h-4" />}
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
