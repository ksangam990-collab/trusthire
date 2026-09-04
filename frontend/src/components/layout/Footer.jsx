import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, ExternalLink, AlertTriangle, Mail,
  Github, ArrowUpRight, CheckCircle2, Lock, Zap
} from 'lucide-react';

/* ─── Link data ──────────────────────────────────────────── */
const COLS = [
  {
    heading: 'For Job Seekers',
    links: [
      { to: '/jobs',               label: 'Browse All Jobs' },
      { to: '/jobs?verifiedOnly=true', label: 'Verified Only' },
      { to: '/fraud-board',        label: 'Scam Board' },
      { to: '/report-fraud',       label: 'Report Incident' },
      { to: '/register',           label: 'Create Free Account' },
    ],
  },
  {
    heading: 'For Employers',
    links: [
      { to: '/register',           label: 'Register Company' },
      { to: '/employer/verify',    label: 'Get Verified (MCA)' },
      { to: '/employer/post-job',  label: 'Post a Job' },
      { to: '/employer/dashboard', label: 'Recruiter Dashboard' },
    ],
  },
  {
    heading: 'Verify & Stay Safe',
    links: [
      { href: 'https://www.mca.gov.in',    label: 'MCA21 Registry',  external: true },
      { href: 'https://www.gst.gov.in',    label: 'GST Portal',      external: true },
      { href: 'https://cybercrime.gov.in', label: 'Cyber Crime Cell', external: true, accent: 'rose' },
    ],
  },
];

const GUARANTEES = [
  { icon: ShieldCheck,  label: 'MCA21 Verified Employers' },
  { icon: Lock,         label: 'Zero Candidate Fees — Ever' },
  { icon: CheckCircle2, label: 'Fraud-Free Guarantee' },
  { icon: Zap,          label: 'Instant Scam Reporting' },
];

/* ─── Component ─────────────────────────────────────────── */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#070b12] text-slate-400 border-t border-white/[0.06]">

      {/* ══ Guarantee strip ══════════════════════════════════ */}
      <div className="border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GUARANTEES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[11px] font-semibold text-slate-300 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Main body ════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* ── Brand column (spans 2 of 5) ─────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center group-hover:bg-emerald-500/15 group-hover:border-emerald-500/40 transition-all duration-200">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="block text-base font-black text-white tracking-tight leading-none">
                  TrustHire
                </span>
                <span className="block text-[10px] font-mono text-emerald-500 font-bold mt-0.5 tracking-widest uppercase">
                  Verified
                </span>
              </div>
            </Link>

            {/* Mission statement */}
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India's only hiring platform where every company is checked against official
              government registries before they can post a single job.
              No scams. No fees. No fake placements — ever.
            </p>

            {/* Live status */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-emerald-400">MCA21 Registry — Live</span>
            </div>

            {/* Contact + Social */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://github.com/ksangam990-collab/trusthire"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-150"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@trusthire.in"
                aria-label="Email"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-150"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="/report-fraud"
                aria-label="Report Fraud"
                className="h-9 px-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-1.5 text-rose-400 hover:bg-rose-500/15 hover:border-rose-500/35 transition-all duration-150 text-[11px] font-bold"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Report Scam
              </a>
            </div>
          </div>

          {/* ── Nav columns (3 of 5) ────────────────────────── */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {COLS.map((col) => (
              <div key={col.heading} className="space-y-4">

                {/* Column heading */}
                <h4 className="text-[11px] font-black uppercase tracking-[0.12em] text-white/60">
                  {col.heading}
                </h4>

                {/* Links */}
                <ul className="space-y-1">
                  {col.links.map((lnk) => {
                    const isRose = lnk.accent === 'rose';
                    const cls = `
                      group flex items-center gap-1.5 py-1 text-[13px] font-medium transition-all duration-150
                      ${isRose
                        ? 'text-slate-400 hover:text-rose-400'
                        : 'text-slate-400 hover:text-white'}
                    `;

                    if (lnk.external) {
                      return (
                        <li key={lnk.href}>
                          <a href={lnk.href} target="_blank" rel="noreferrer" className={cls.trim()}>
                            <span className={`w-1 h-1 rounded-full flex-shrink-0 transition-all duration-150
                              ${isRose ? 'bg-slate-600 group-hover:bg-rose-400' : 'bg-slate-600 group-hover:bg-emerald-500'}`}
                            />
                            {lnk.label}
                            <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-60 transition-all duration-150 flex-shrink-0" />
                          </a>
                        </li>
                      );
                    }
                    return (
                      <li key={lnk.to}>
                        <Link to={lnk.to} className={cls.trim()}>
                          <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-emerald-500 flex-shrink-0 transition-all duration-150" />
                          {lnk.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ══ Bottom bar ═══════════════════════════════════════ */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">

          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            © {year} TrustHire. Built in India. Zero scams, zero fees for candidates.
          </p>

          <div className="flex items-center gap-5 text-[11px] text-slate-500">
            <Link to="/jobs"         className="hover:text-slate-300 transition">Jobs</Link>
            <Link to="/fraud-board"  className="hover:text-slate-300 transition">Scam Board</Link>
            <Link to="/report-fraud" className="hover:text-rose-400 transition">Report Fraud</Link>
            <a
              href="https://www.mca.gov.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition inline-flex items-center gap-1"
            >
              MCA21 <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

        </div>
      </div>

    </footer>
  );
}
