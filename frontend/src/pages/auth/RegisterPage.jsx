import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, User, Building, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Spinner } from '../../components/ui/Skeleton';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [role, setRole] = useState('jobseeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Information Technology');
  const [companySize, setCompanySize] = useState('11-50');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setErrorMessage('');
    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      companyName: role === 'employer' ? (companyName.trim() || `${name}'s Org`) : undefined,
      industry: role === 'employer' ? industry : undefined,
      companySize: role === 'employer' ? companySize : undefined
    };

    const res = await register(payload);

    if (res.success) {
      if (role === 'employer') {
        navigate('/employer/verify');
      } else {
        navigate('/jobs');
      }
    } else {
      setErrorMessage(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#111827] border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-glow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create TrustHire Account</h1>
          <p className="text-xs text-slate-400">Join the zero-scam verified recruitment infrastructure.</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole('jobseeker')}
            className={`py-2 rounded-xl transition ${
              role === 'jobseeker' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole('employer')}
            className={`py-2 rounded-xl transition ${
              role === 'employer' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Employer / Recruiter
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohit Sharma"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {role === 'employer' && (
            <>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Organization Name *</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Innovate Tech Labs Pvt Ltd"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="Information Technology">Software / IT</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Education">EdTech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Team Size</label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  >
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501-1000">501-1000</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'employer' ? 'hr@yourcompany.com' : 'you@example.com'}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Password (Min 8 chars) *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center space-x-2 text-xs shadow-glow-sm"
          >
            {isLoading && <Spinner className="w-4 h-4 text-slate-900" />}
            <span>{isLoading ? 'Setting up Profile...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
