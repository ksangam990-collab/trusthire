import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Github, ExternalLink, Building, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f17] theme-transition text-xs text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">TrustHire</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
              India's statutory verified recruitment network. Eliminating fake offer letters, deposit scams, and ghost listings via official MCA21 & GST validation.
            </p>
            <div className="inline-flex items-center space-x-2 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>MCA21 REGISTRY CONNECTED</span>
            </div>
          </div>

          {/* Marketplace */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Browse Verified Jobs</Link></li>
              <li><Link to="/fraud-board" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Public Scam Advisory</Link></li>
              <li><Link to="/report-fraud" className="hover:text-rose-600 dark:hover:text-rose-400 transition">Report Recruiter Fraud</Link></li>
            </ul>
          </div>

          {/* Recruiters */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Recruiters</h4>
            <ul className="space-y-2">
              <li><Link to="/employer/verify" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Verify CIN & GSTIN</Link></li>
              <li><Link to="/employer/post-job" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Post Verified Opening</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Recruiter Dashboard</Link></li>
            </ul>
          </div>

          {/* Official Government Verification Portals */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Govt Verification Portals</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.mca.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center space-x-1"
                >
                  <span>MCA21 Corporate Registry</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.gst.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center space-x-1"
                >
                  <span>GSTIN Search Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-rose-600 dark:hover:text-rose-400 transition flex items-center space-x-1"
                >
                  <span>Cyber Crime Reporting</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ncs.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center space-x-1"
                >
                  <span>National Career Service (NCS)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} TrustHire India. In compliance with the Information Technology (Intermediary Guidelines) Rules, 2021.
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Built by Sangam Kumar (RVS College CSE)</span>
            <a href="https://github.com/ksangam990-collab/trusthire" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
