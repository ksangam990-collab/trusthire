import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, ExternalLink, Briefcase, AlertTriangle,
  FileText, Building2, CheckCircle2, Mail, Github
} from 'lucide-react';

const NAV = {
  seekers: [
    { to: '/jobs',         label: 'Browse Jobs' },
    { to: '/fraud-board',  label: 'Scam Board' },
    { to: '/report-fraud', label: 'Report Incident' },
    { to: '/register',     label: 'Create Free Account' },
  ],
  employers: [
    { to: '/register',           label: 'Register as Employer' },
    { to: '/employer/verify',    label: 'Verify Company (MCA)' },
    { to: '/employer/post-job',  label: 'Post a Job' },
    { to: '/employer/dashboard', label: 'Recruiter Dashboard' },
  ],
  verify: [
    { href: 'https://www.mca.gov.in',       label: 'MCA21 Registry',    external: true },
    { href: 'https://www.gst.gov.in',       label: 'GST Portal',         external: true },
    { href: 'https://cybercrime.gov.in',    label: 'Cyber Crime Cell',   external: true, danger: true },
    { href: 'https://www.india.gov.in',     label: 'India Gov Portal',   external: true },
  ],
};

const TRUST_BADGES = [
  { icon: ShieldCheck,   text: 'MCA21 Verified'       },
  { icon: CheckCircle2,  text: 'Zero Candidate Fees'  },
  { icon: AlertTriangle, text: 'Fraud-Free Guarantee' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#060a10] theme-transition">

      {/* ── Trust bar ─────────────────────────────────────────── */}
      <div className="border-b border-slate-100 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {TRUST_BADGES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <Icon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main grid ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shadow-sm group-hover:border-emerald-500/50 transition">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
                TrustHire
              </span>
            </Link>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              India's verified job network. Every employer is checked against the Ministry of Corporate Affairs registry before posting. Zero scams, zero candidate fees.
            </p>

            {/* Status dot */}
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">MCA Registry Live</span>
            </div>

            {/* Social / external links */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://github.com/ksangam990-collab/trusthire"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 transition"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="mailto:support@trusthire.in"
                aria-label="Email support"
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 transition"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Job Seekers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                Job Seekers
              </h4>
            </div>
            <ul className="space-y-2.5">
              {NAV.seekers.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition font-medium flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-emerald-500 transition flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-500" />
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                Employers
              </h4>
            </div>
            <ul className="space-y-2.5">
              {NAV.employers.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition font-medium flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-emerald-500 transition flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Verify */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                Verify
              </h4>
            </div>
            <ul className="space-y-2.5">
              {NAV.verify.map(({ href, label, danger }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-xs transition font-medium flex items-center gap-1.5 group ${
                      danger
                        ? 'text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                  >
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 transition ${
                      danger
                        ? 'bg-slate-300 dark:bg-slate-600 group-hover:bg-rose-500'
                        : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-emerald-500'
                    }`} />
                    {label}
                    <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 transition flex-shrink-0" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Emergency report CTA */}
            <Link
              to="/report-fraud"
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-[11px] font-bold hover:bg-rose-100 dark:hover:bg-rose-950/60 transition"
            >
              <AlertTriangle className="w-3 h-3" />
              Report a Scam
            </Link>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────── */}
      <div className="border-t border-slate-100 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} TrustHire. Zero scams, zero fees for candidates.
            Built in India.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
            <Link to="/jobs"         className="hover:text-slate-600 dark:hover:text-slate-300 transition">Browse Jobs</Link>
            <Link to="/fraud-board"  className="hover:text-slate-600 dark:hover:text-slate-300 transition">Scam Board</Link>
            <Link to="/report-fraud" className="hover:text-rose-500 transition">Report Fraud</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
