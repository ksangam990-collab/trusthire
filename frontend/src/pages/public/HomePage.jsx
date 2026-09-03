import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Search, MapPin, ArrowRight, CheckCircle2,
  Lock, Building2, AlertTriangle, Briefcase, FileCheck,
  Users, TrendingUp, ChevronDown, ChevronUp, IndianRupee, Radio
} from 'lucide-react';
import { jobsApi, fraudApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';
import TrustScoreBadge from '../../components/ui/TrustScoreBadge';

const STATS = [
  { icon: Briefcase,    value: '2,400+', label: 'Verified Jobs' },
  { icon: Building2,   value: '380+',   label: 'Verified Companies' },
  { icon: Users,       value: '18,000+',label: 'Candidates Protected' },
  { icon: IndianRupee, value: '0',      label: 'Fees for Candidates' },
];

const HOW_IT_WORKS = [
  { icon: Building2,  title: 'Company registration checked', desc: 'Every employer is cross-verified against MCA21 and GST databases before posting any job.' },
  { icon: FileCheck,  title: 'Official company emails only', desc: 'Recruiters must sign up with verified corporate domains. No anonymous webmails allowed.' },
  { icon: Lock,       title: 'Zero fees, always', desc: 'Candidates never pay anything. Any employer asking for money gets permanently banned.' },
];

const SCAM_RULES = [
  {
    number: '01',
    title: 'They ask for money before joining',
    flag: '"Deposit Rs 2,500 for training kit or uniform via PhonePe."',
    truth: 'Real employers in India never charge candidates to apply or join. Always a scam.'
  },
  {
    number: '02',
    title: 'The interview is only on WhatsApp',
    flag: '"You are selected! Please complete your HR round on WhatsApp chat."',
    truth: 'Legitimate companies use official email, Zoom, or Google Meet — not WhatsApp messages.'
  },
  {
    number: '03',
    title: 'An offer arrives without any interview',
    flag: '"Your CV matched our requirements. Pay Rs 4,000 to unlock your offer letter."',
    truth: 'No genuine company gives high-paying offers without a proper interview process first.'
  },
  {
    number: '04',
    title: 'They ask for your UPI PIN or OTP',
    flag: '"Enter your UPI PIN to activate your salary account before joining."',
    truth: 'Salaries are paid to bank accounts. No HR ever needs your UPI PIN or banking OTP.'
  },
];

const FAQS = [
  { q: 'Is TrustHire free for job seekers?', a: 'Yes, completely free. Search, view salaries, and apply without paying a rupee.' },
  { q: 'How do you verify employers?', a: 'We match every employer against the Ministry of Corporate Affairs (MCA21) registry and require official company email domains during signup.' },
  { q: 'What do I do if a recruiter asks for money?', a: "Don't pay. Screenshot everything and report the company using our Report button. We investigate every case." },
  { q: 'Are there fresher and entry-level jobs?', a: 'Yes! We have internships, fresher, and entry-level openings from verified startups and established companies across India.' },
  { q: 'Can employers pay to rank their jobs higher?', a: 'No. Jobs are ranked by recency and trust score — never by payment. Verified companies naturally rank higher.' },
];

const SPOTLIGHTS = [
  { key: 'razorpay', name: 'Razorpay', role: 'Senior Full Stack Engineer', salary: '24L – 32L / yr', location: 'Bengaluru · Hybrid', score: 98, avatar: 'R', color: 'blue' },
  { key: 'zerodha',  name: 'Zerodha',  role: 'Systems Architect (Go)',     salary: '30L – 42L / yr', location: 'Bengaluru · Remote', score: 99, avatar: 'Z', color: 'emerald' },
  { key: 'swiggy',   name: 'Swiggy',   role: 'Staff React Native Engineer', salary: '28L – 38L / yr', location: 'Bengaluru / Remote', score: 97, avatar: 'S', color: 'orange' },
];

export default function HomePage() {
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSpot, setActiveSpot] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    jobsApi.getJobs({ limit: 4, verifiedOnly: 'true' })
      .then(r => setRecentJobs(r?.data?.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (keyword.trim()) p.append('keyword', keyword.trim());
    if (location.trim()) p.append('city', location.trim());
    navigate(`/jobs?${p.toString()}`);
  };

  const spot = SPOTLIGHTS[activeSpot];

  return (
    <div className="theme-transition">

      {/* ══════════ HERO ══════════ */}
      <section className="relative overflow-hidden bg-white dark:bg-[#080c14]">
        {/* Subtle gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-white to-white dark:from-emerald-950/20 dark:via-[#080c14] dark:to-[#080c14] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-14 text-center">

          {/* Pill badge */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-5">
            <ShieldCheck className="w-3.5 h-3.5" />
            India's Verified Hiring Network
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.06 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-4">
            Find genuine jobs in India<br />
            <span className="text-emerald-600 dark:text-emerald-400">without the scams.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.12 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">
            Every employer is verified against official registries before posting.
            Salaries shown upfront. Zero fees for candidates.
          </motion.p>

          {/* Search bar */}
          <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.18 }}
            className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-black/50 p-2 flex flex-col sm:flex-row gap-2 focus-within:ring-2 focus-within:ring-emerald-500/30 transition-all mb-4">
            <div className="flex items-center gap-2 flex-1 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800">
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder="Job title, skill, or company..."
                className="w-full text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2 flex-1 px-3 py-2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                placeholder="City or 'Remote'..."
                className="w-full text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none" />
            </div>
            <button type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 flex-shrink-0 shadow-sm cursor-pointer">
              Search Jobs <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>

          {/* Quick tags */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
            className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 mb-10">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Popular:</span>
            {['Frontend', 'Backend', 'Full Stack', 'Remote', 'Bengaluru', 'Fresher'].map(tag => (
              <button key={tag} onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer font-medium">
                {tag}
              </button>
            ))}
          </motion.div>

          {/* ── Stats bar ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center shadow-sm">
                <s.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                <div className="text-lg font-black text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-[11px] text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ INTERACTIVE SPOTLIGHT ══════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-6 items-stretch">

          {/* Left: company tabs */}
          <div className="flex flex-row md:flex-col gap-2 md:w-48 flex-shrink-0">
            <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1 hidden md:block">Sample Verified Jobs</div>
            {SPOTLIGHTS.map((s, i) => (
              <button key={s.key} onClick={() => setActiveSpot(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeSpot === i ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-400'}`}>
                <span className="w-7 h-7 rounded-lg bg-white/20 dark:bg-slate-800 flex items-center justify-center font-black text-sm flex-shrink-0">{s.avatar}</span>
                <span className="truncate">{s.name}</span>
              </button>
            ))}
          </div>

          {/* Right: spotlight card */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>Live Verified Opening</span>
              </div>
              <TrustScoreBadge score={spot.score} size="sm" />
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl font-black text-slate-800 dark:text-slate-200 flex-shrink-0">
                {spot.avatar}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{spot.name}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> Verified Company
                  </span>
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white">{spot.role}</p>
                <p className="text-xs text-slate-500 mt-0.5">{spot.location}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-3">
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                Rs {spot.salary}
              </span>
              <Link to="/jobs"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-sm">
                Browse All Jobs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
              * Sample only. Real verified jobs from this employer are on our jobs page. No fees to apply.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ COMPANY TRUST ROW ══════════ */}
      <section className="bg-slate-50 dark:bg-slate-950/50 border-y border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Trusted by candidates applying to</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['Razorpay', 'Zerodha', 'Swiggy', 'Zomato', 'Infosys', 'CRED', 'TCS', 'Flipkart'].map(c => (
              <span key={c} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 shadow-sm">
                {c} <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED JOBS ══════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Fresh Listings</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">Latest verified openings</h2>
          </div>
          <Link to="/jobs" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <JobCardSkeleton key={i} />)}
          </div>
        ) : recentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentJobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        ) : (
          <div className="text-center py-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">No active listings yet</p>
            <p className="text-xs text-slate-500">New verified jobs will appear here as employers sign up.</p>
          </div>
        )}
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="bg-slate-50 dark:bg-slate-950/40 border-y border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Safe Hiring</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Why TrustHire is different</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">Traditional job boards let anyone post with a free Gmail. Here is what we do differently:</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOW_IT_WORKS.map((h, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                  <h.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{h.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SCAM RULES ══════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 p-6 sm:p-10 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Candidate Safety Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">4 golden rules to avoid hiring scams</h2>
            <p className="text-sm text-slate-400">Keep these in mind every time you look for a job online in India.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SCAM_RULES.map((rule, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-amber-400">{rule.number}</span>
                  <h4 className="font-bold text-white text-sm">{rule.title}</h4>
                </div>
                <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl">
                  <p className="text-xs text-rose-300 italic leading-relaxed">{rule.flag}</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rule.truth}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 border-t border-slate-800">
            <Link to="/fraud-board" className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition flex items-center gap-2 cursor-pointer">
              <AlertTriangle className="w-4 h-4" /> View Public Scam Board
            </Link>
            <Link to="/report-fraud" className="px-5 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold text-sm rounded-xl transition cursor-pointer">
              Report a Scam
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="bg-white dark:bg-slate-950/30 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="text-center space-y-1 mb-7">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500">Quick answers for job seekers and employers</p>
          </div>
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <span className="font-bold text-sm text-slate-900 dark:text-white pr-4">{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-emerald-600 rounded-2xl p-8 sm:p-10 text-center text-white space-y-4">
          <ShieldCheck className="w-10 h-10 mx-auto opacity-80" />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Ready to find a job the safe way?</h2>
          <p className="text-emerald-100 text-sm max-w-md mx-auto">Browse verified job openings from companies that have been checked against official government records.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/jobs" className="px-6 py-3 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-sm rounded-xl transition cursor-pointer shadow-md">
              Browse Verified Jobs
            </Link>
            <Link to="/register" className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl border border-emerald-500 transition cursor-pointer">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
