import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#070A0F] border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">TrustHire</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              TrustHire is India's verified hiring network protecting job seekers against recruitment fraud, identity theft, and fake placements through verified employer credentials and live fraud intelligence.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-500 font-mono">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>MCA Verified</span>
              </span>
              <span className="flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>AES-256 Encrypted</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Job Seekers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/jobs" className="hover:text-emerald-400 transition">Browse Verified Jobs</Link></li>
              <li><Link to="/jobs?verifiedOnly=true" className="hover:text-emerald-400 transition">100% TrustScore Listings</Link></li>
              <li><Link to="/candidate/dashboard" className="hover:text-emerald-400 transition">Application Tracker</Link></li>
              <li><Link to="/report-fraud" className="hover:text-rose-400 transition">Submit Scam Report</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Employers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/employer/verify" className="hover:text-emerald-400 transition">CIN & GSTIN Verification</Link></li>
              <li><Link to="/employer/post-job" className="hover:text-emerald-400 transition">Post Verified Opening</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-emerald-400 transition">Candidate Pipeline</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-emerald-400 transition">TrustScore Optimization</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Security & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/fraud-board" className="text-amber-400 hover:underline flex items-center space-x-1"><ShieldAlert className="w-3 h-3" /><span>Public Fraud Board</span></Link></li>
              <li><span className="text-slate-500">Scam Pattern Database</span></li>
              <li><span className="text-slate-500">Security Architecture</span></li>
              <li><span className="text-slate-500">Privacy Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 TrustHire Technologies Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono">STATUS: SYSTEMS NOMINAL • FRAUD ENGINE ACTIVE</p>
        </div>
      </div>
    </footer>
  );
}