import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 theme-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-black text-sm text-slate-900 dark:text-white">TrustHire</span>
            </Link>
            <p className="leading-relaxed text-slate-500 dark:text-slate-400">India's verified job network. Zero scams, upfront salaries, and verified companies only.</p>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Job Seekers</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Browse Jobs</Link></li>
              <li><Link to="/fraud-board" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Scam Board</Link></li>
              <li><Link to="/report-fraud" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Report Incident</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Employers</h4>
            <ul className="space-y-2">
              <li><Link to="/employer/verify" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Verify Company</Link></li>
              <li><Link to="/employer/post-job" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Post a Job</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Dashboard</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Verify</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.mca.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1">
                  MCA21 Registry <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.gst.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1">
                  GST Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="hover:text-rose-600 dark:hover:text-rose-400 transition flex items-center gap-1">
                  Cyber Crime Cell <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} TrustHire. Zero scams, zero fees for candidates.</p>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">MCA Registry Live</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
