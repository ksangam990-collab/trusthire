import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#06090e] theme-transition text-xs text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">TrustHire</span>
            </Link>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              India's statutory verified hiring infrastructure. Eliminating recruitment scams with MCA21 and GST verification.
            </p>
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>MCA21 NETWORK OPERATIONAL</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white font-mono text-[11px] uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Browse Verified Openings</Link></li>
              <li><Link to="/fraud-board" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Public Fraud Radar</Link></li>
              <li><Link to="/report-fraud" className="hover:text-rose-600 dark:hover:text-rose-400 transition">File a Scam Report</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white font-mono text-[11px] uppercase tracking-wider">Recruiters</h4>
            <ul className="space-y-2">
              <li><Link to="/employer/verify" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Statutory Verification (CIN / GST)</Link></li>
              <li><Link to="/employer/post-job" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Post Verified Opening</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Recruiter Dashboard</Link></li>
            </ul>
          </div>

          {/* Security Standards & Grievance */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white font-mono text-[11px] uppercase tracking-wider">Statutory Compliance</h4>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              MCA21 registry verified. In compliance with the Information Technology (Intermediary Guidelines) Rules, 2021.
            </p>
            <div className="text-[10px] text-slate-400 font-mono">
              Grievance Officer: grievance@trusthire.in
            </div>
            <div className="pt-1 flex items-center space-x-3 text-slate-400">
              <a href="https://github.com/ksangam990-collab/trusthire" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} TrustHire India. 100% Zero-Fee Candidate Protection Guarantee.</div>
          <div className="flex items-center space-x-4">
            <span>Built by Sangam Kumar (RVS College CSE)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
