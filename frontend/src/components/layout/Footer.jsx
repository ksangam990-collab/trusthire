import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, ExternalLink, AlertTriangle, Mail, Github,
  ArrowUpRight, Briefcase, Building2, FileSearch, Phone,
  CheckCircle2, Lock, Zap, IndianRupee
} from 'lucide-react';

/* ─── Nav data ───────────────────────────────────────────────────────────── */
const SEEKER_LINKS = [
  { to: '/jobs',                    label: 'Browse All Jobs' },
  { to: '/jobs?verifiedOnly=true',  label: 'Verified Jobs Only' },
  { to: '/fraud-board',             label: 'Scam Board' },
  { to: '/report-fraud',            label: 'Report an Incident' },
  { to: '/register',                label: 'Create Free Account' },
];

const EMPLOYER_LINKS = [
  { to: '/register',            label: 'Register as Employer' },
  { to: '/employer/verify',     label: 'Get MCA Verified' },
  { to: '/employer/post-job',   label: 'Post a Job' },
  { to: '/employer/dashboard',  label: 'Recruiter Dashboard' },
];

const VERIFY_LINKS = [
  { href: 'https://www.mca.gov.in',    label: 'MCA21 Registry'  },
  { href: 'https://www.gst.gov.in',    label: 'GST Portal'       },
  { href: 'https://cybercrime.gov.in', label: 'Cyber Crime Cell', rose: true },
  { href: 'https://www.india.gov.in',  label: 'India Gov Portal' },
];

const TRUST_PILLARS = [
  { icon: ShieldCheck,   label: 'MCA21 Verified',      sub: 'Every employer checked' },
  { icon: IndianRupee,   label: 'Zero Candidate Fees', sub: 'Always free to apply'   },
  { icon: Lock,          label: 'Fraud-Free Promise',  sub: 'Scammers auto-banned'   },
  { icon: Zap,           label: 'Live Scam Radar',     sub: '24 / 7 monitoring'      },
];

/* ─── Reusable link row ──────────────────────────────────────────────────── */
const NavLink = ({ to, href, label, rose }) => {
  const base =
    'group flex items-center gap-2 py-1 text-[13px] font-medium transition-all duration-150 ' +
    (rose
      ? 'text-slate-500 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400'
      : 'text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white');

  const dot =
    'w-1 h-1 rounded-full flex-shrink-0 transition-all duration-150 bg-slate-300 dark:bg-slate-700 ' +
    (rose
      ? 'group-hover:bg-rose-500'
      : 'group-hover:bg-emerald-500');

  const inner = (
    <>
      <span className={dot} />
      {label}
      {href && (
        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-all duration-150 flex-shrink-0 -translate-y-px translate-x-px" />
      )}
    </>
  );

  if (href) {
    return (
      <li>
        <a href={href} target="_blank" rel="noreferrer" className={base}>
          {inner}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link to={to} className={base}>
        {inner}
      </Link>
    </li>
  );
};

/* ─── Column heading ─────────────────────────────────────────────────────── */
const ColHead = ({ children }) => (
  <h4 className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 mb-4">
    {children}
  </h4>
);

/* ════════════════════════════════════════════════════════════════════════════
   Footer
═══════════════════════════════════════════════════════════════════════════ */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="theme-transition border-t border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#070b12]">

      {/* ══ Trust pillars strip ══════════════════════════════════════════════ */}
      <div className="border-b border-slate-200 dark:border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TRUST_PILLARS.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl
                           bg-white dark:bg-white/[0.03]
                           border border-slate-200 dark:border-white/[0.06]
                           shadow-sm dark:shadow-none"
              >
                <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center
                                bg-emerald-50 dark:bg-emerald-500/10
                                border border-emerald-200 dark:border-emerald-500/20">
                  <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {label}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Main body ════════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* ── Brand column — 2 of 5 ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                              bg-emerald-50 dark:bg-emerald-500/10
                              border border-emerald-200 dark:border-emerald-500/25
                              group-hover:border-emerald-400 dark:group-hover:border-emerald-500/50
                              shadow-sm transition-all duration-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <span className="block text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  TrustHire
                </span>
                <span className="block text-[10px] font-bold font-mono tracking-widest uppercase
                                 text-emerald-600 dark:text-emerald-500 mt-0.5">
                  Verified Network
                </span>
              </div>
            </Link>

            {/* Tagline */}
            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              India's only hiring platform where every employer is verified against official government
              registries before posting a single job. Zero scams. Zero fees. Zero fake placements.
            </p>

            {/* Live status badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl
                            bg-emerald-50 dark:bg-emerald-500/8
                            border border-emerald-200 dark:border-emerald-500/20">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                MCA21 Registry — Live
              </span>
            </div>

            {/* Contact row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="https://github.com/ksangam990-collab/trusthire"
                target="_blank" rel="noreferrer" aria-label="GitHub"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150
                           border border-slate-200 dark:border-white/10
                           bg-white dark:bg-white/5
                           text-slate-500 dark:text-slate-400
                           hover:border-slate-400 dark:hover:border-white/20
                           hover:text-slate-900 dark:hover:text-white
                           shadow-sm dark:shadow-none"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@trusthire.in" aria-label="Email support"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150
                           border border-slate-200 dark:border-white/10
                           bg-white dark:bg-white/5
                           text-slate-500 dark:text-slate-400
                           hover:border-slate-400 dark:hover:border-white/20
                           hover:text-slate-900 dark:hover:text-white
                           shadow-sm dark:shadow-none"
              >
                <Mail className="w-4 h-4" />
              </a>
              <Link
                to="/report-fraud"
                className="h-9 px-3.5 rounded-xl flex items-center gap-1.5 text-[11px] font-bold
                           transition-all duration-150
                           bg-rose-50 dark:bg-rose-500/10
                           border border-rose-200 dark:border-rose-500/20
                           text-rose-600 dark:text-rose-400
                           hover:bg-rose-100 dark:hover:bg-rose-500/15
                           hover:border-rose-300 dark:hover:border-rose-500/35"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Report Scam
              </Link>
            </div>
          </div>

          {/* ── Nav columns — 3 of 5 ─────────────────────────────────────── */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">

            {/* For Job Seekers */}
            <div>
              <ColHead>For Job Seekers</ColHead>
              <ul className="space-y-0.5">
                {SEEKER_LINKS.map(l => <NavLink key={l.to} {...l} />)}
              </ul>
            </div>

            {/* For Employers */}
            <div>
              <ColHead>For Employers</ColHead>
              <ul className="space-y-0.5">
                {EMPLOYER_LINKS.map(l => <NavLink key={l.to} {...l} />)}
              </ul>
            </div>

            {/* Verify */}
            <div>
              <ColHead>Verify &amp; Stay Safe</ColHead>
              <ul className="space-y-0.5">
                {VERIFY_LINKS.map(l => <NavLink key={l.href} {...l} />)}
              </ul>

              {/* Emergency report tile */}
              <div className="mt-5 p-3.5 rounded-xl
                              bg-rose-50 dark:bg-rose-500/8
                              border border-rose-200 dark:border-rose-500/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span className="text-[11px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                    Got scammed?
                  </span>
                </div>
                <p className="text-[11px] text-rose-600/80 dark:text-rose-500/80 leading-relaxed mb-2.5">
                  File a report in 30 seconds. Every report protects the next candidate.
                </p>
                <Link
                  to="/report-fraud"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold
                             text-rose-600 dark:text-rose-400
                             hover:text-rose-700 dark:hover:text-rose-300 transition"
                >
                  Report now
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══ Divider ═════════════════════════════════════════════════════════ */}
      <div className="border-t border-slate-200 dark:border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4
                        flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Copyright */}
          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center sm:text-left">
            © {year} TrustHire · Built in India · Zero scams, zero fees for candidates
          </p>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
            <Link to="/jobs"         className="hover:text-slate-700 dark:hover:text-slate-300 transition">Jobs</Link>
            <Link to="/fraud-board"  className="hover:text-slate-700 dark:hover:text-slate-300 transition">Scam Board</Link>
            <Link to="/report-fraud" className="hover:text-rose-600 dark:hover:text-rose-400 transition">Report Fraud</Link>
            <a
              href="https://www.mca.gov.in"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition"
            >
              MCA21 <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

        </div>
      </div>

    </footer>
  );
}
