import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Search, MapPin, ArrowRight, CheckCircle2,
  Lock, Building2, AlertTriangle, FileCheck, Users,
  ChevronDown, ChevronUp, IndianRupee, TrendingUp, Radio, Star
} from 'lucide-react';
import { jobsApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';

/* ─────────────────── Data ─────────────────── */
const QUICK_TAGS = ['Frontend', 'Backend', 'Full Stack', 'Remote', 'Bengaluru', 'Fresher'];

const SPOTLIGHTS = [
  { name: 'Razorpay',  role: 'Senior Full Stack Engineer',   salary: 'Rs 24L – 32L / yr', loc: 'Bengaluru · Hybrid',  score: 98, av: 'R' },
  { name: 'Zerodha',   role: 'Systems Architect (Golang)',    salary: 'Rs 30L – 42L / yr', loc: 'Bengaluru · Remote',  score: 99, av: 'Z' },
  { name: 'Swiggy',    role: 'Staff React Native Engineer',   salary: 'Rs 28L – 38L / yr', loc: 'Bengaluru / Remote',  score: 97, av: 'S' },
];

const HOW = [
  { icon: Building2,  title: 'Every company is verified',    desc: 'We cross-check employer CIN and GST against MCA21 before they can post a single job.' },
  { icon: FileCheck,  title: 'Official domains only',        desc: 'Recruiters must register with their corporate email. Personal Gmail and webmail are blocked.' },
  { icon: Lock,       title: 'Zero fees for candidates',     desc: 'Applying is always free. Any employer asking for money gets permanently removed.' },
];

const SCAM_RULES = [
  { n: '01', title: 'They ask for money first',          flag: '"Pay Rs 2,500 for uniform / training kit via PhonePe."',          truth: 'Real companies in India never charge candidates. This is always a scam.' },
  { n: '02', title: 'Interview only on WhatsApp',        flag: '"You are selected! Complete your HR round on WhatsApp."',         truth: 'Legitimate employers use official video calls or email — never WhatsApp chats.' },
  { n: '03', title: 'Offer without any interview',       flag: '"Your CV matched! Pay Rs 4,000 to unlock your offer letter."',   truth: 'No genuine company gives a job offer without a proper interview process first.' },
  { n: '04', title: 'They ask for your UPI PIN or OTP',  flag: '"Enter your UPI PIN to activate your salary account."',          truth: 'Salaries use bank account numbers. Real HR never needs your UPI PIN or OTP.' },
];

const FAQS = [
  { q: 'Is TrustHire free for job seekers?',             a: 'Yes, completely free. Search, apply, and view salary details without paying a rupee.' },
  { q: 'How do you verify companies?',                    a: 'We match every employer against the Ministry of Corporate Affairs (MCA21) registry and require official corporate email domains during signup.' },
  { q: 'What if a recruiter asks me for money?',          a: "Don't pay. Screenshot everything and report it using our Report button. We investigate every case and ban scammers." },
  { q: 'Are there fresher or entry-level jobs?',          a: 'Yes! We have internships, fresher, and entry-level roles from verified startups and large companies across India.' },
  { q: 'Can paid employers rank their jobs higher?',      a: 'No. Rankings are based on recency and trust score only — never by payment.' },
];

const COMPANIES = ['Razorpay', 'Zerodha', 'Swiggy', 'Zomato', 'Infosys', 'CRED', 'TCS', 'Flipkart'];

/* ─────────────────── Component ─────────────────── */
export default function HomePage() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [keyword, setKeyword]   = useState('');
  const [city, setCity]         = useState('');
  const [openFaq, setOpenFaq]   = useState(null);
  const [spot, setSpot]         = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    jobsApi.getJobs({ limit: 4, verifiedOnly: 'true' })
      .then(r => setJobs(r?.data?.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const doSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (keyword.trim()) p.set('keyword', keyword.trim());
    if (city.trim())    p.set('city',    city.trim());
    navigate('/jobs?' + p.toString());
  };

  const S = SPOTLIGHTS[spot];

  return (
    <div className="theme-transition overflow-x-hidden">

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative bg-white dark:bg-[#080c14]">

        {/* Very subtle dot-grid texture */}
        <div className="absolute inset-0 pointer-events-none"
          style={{backgroundImage:'radial-gradient(circle, rgba(16,185,129,0.07) 1px, transparent 1px)', backgroundSize:'28px 28px'}} />

        {/* Soft top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">

          {/* ── Badge ── */}
          <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} transition={{duration:0.35}}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-6">
            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
            India's Verified Hiring Network
          </motion.div>

          {/* ── Headline ── */}
          <motion.h1 initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.05}}
            className="text-[2.4rem] sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white mb-5">
            Find genuine jobs in India<br />
            <span className="text-emerald-500">without the scams.</span>
          </motion.h1>

          {/* ── Sub ── */}
          <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.1}}
            className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-8">
            Every employer is verified before posting. Salaries shown upfront. Zero fees for candidates — always.
          </motion.p>

          {/* ── Search bar ── */}
          <motion.form onSubmit={doSearch} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.4,delay:0.15}}
            className="flex flex-col sm:flex-row max-w-2xl mx-auto bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-900/5 dark:shadow-black/40 overflow-hidden mb-5 focus-within:ring-2 focus-within:ring-emerald-500/40 transition-all">
            {/* keyword */}
            <div className="flex items-center gap-2.5 flex-1 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder="Job title, skill, or company..."
                className="flex-1 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none min-w-0" />
            </div>
            {/* city */}
            <div className="flex items-center gap-2.5 flex-1 px-4 py-3.5">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input type="text" value={city} onChange={e => setCity(e.target.value)}
                placeholder="City or 'Remote'..."
                className="flex-1 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none min-w-0" />
            </div>
            {/* button */}
            <div className="px-2 py-2 flex-shrink-0">
              <button type="submit"
                className="w-full h-full px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                Search Jobs <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>

          {/* ── Quick tags ── */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.25}}
            className="flex flex-wrap items-center justify-center gap-2 text-xs mb-10">
            <span className="text-slate-500 dark:text-slate-500 font-medium">Popular:</span>
            {QUICK_TAGS.map(t => (
              <button key={t} onClick={() => navigate('/jobs?keyword=' + encodeURIComponent(t))}
                className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-400 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-800 transition font-medium cursor-pointer">
                {t}
              </button>
            ))}
          </motion.div>

          {/* ── Inline trust strip ── */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-500 dark:text-slate-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> MCA21-verified companies</span>
            <span className="w-px h-4 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Salary shown upfront</span>
            <span className="w-px h-4 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero fees for candidates</span>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS  (clean horizontal bar)
      ════════════════════════════════════════ */}
      <div className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 dark:divide-slate-800">
          {[
            { v: '2,400+', l: 'Verified Jobs' },
            { v: '380+',   l: 'Verified Companies' },
            { v: '18,000+',l: 'Candidates Protected' },
            { v: 'Rs 0',   l: 'Fees for Candidates' },
          ].map((s, i) => (
            <div key={i} className="py-5 px-4 text-center">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{s.v}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          COMPANY STRIP
      ════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#080c14] py-6 border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Trusted by candidates applying to
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {COMPANIES.map(c => (
              <span key={c} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                {c} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          SPOTLIGHT — verified job preview
      ════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start gap-3 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Preview</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">What verified jobs look like</h2>
          </div>
          <div className="sm:ml-auto flex gap-1.5 mt-1">
            {SPOTLIGHTS.map((s, i) => (
              <button key={i} onClick={() => setSpot(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${spot===i ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
          {/* Live badge */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              Live Opening · Sample
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> Trust Score {S.score}/100
            </span>
          </div>
          {/* Company row */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl font-black text-slate-700 dark:text-white flex-shrink-0">
              {S.av}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{S.name}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> Verified Company
                </span>
              </div>
              <p className="text-base font-black text-slate-900 dark:text-white">{S.role}</p>
              <p className="text-xs text-slate-500 mt-0.5">{S.loc}</p>
            </div>
          </div>
          {/* Salary + CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] text-slate-500 block mb-0.5">Annual CTC</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{S.salary}</span>
            </div>
            <Link to="/jobs"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-sm">
              Browse All Jobs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-[10px] text-slate-400 mt-3">Sample only. Real verified jobs on our job board. No fees required to apply.</p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED JOBS
      ════════════════════════════════════════ */}
      <section className="bg-slate-50 dark:bg-slate-950/40 border-y border-slate-200 dark:border-slate-800 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Fresh Listings</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">Latest verified openings</h2>
            </div>
            <Link to="/jobs" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 flex-shrink-0">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <JobCardSkeleton key={i} />)}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map(j => <JobCard key={j._id} job={j} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="font-bold text-slate-900 dark:text-white text-sm">No active listings yet</p>
              <p className="text-xs text-slate-500">Verified jobs will appear here as employers sign up.</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Safe Hiring</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Why TrustHire is different</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">Other job boards let anyone post with a free Gmail. We check every employer first.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HOW.map((h, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 hover:border-emerald-300 dark:hover:border-emerald-800 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                <h.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{h.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          SCAM RULES — dark card
      ════════════════════════════════════════ */}
      <section className="bg-slate-50 dark:bg-slate-950/40 border-y border-slate-200 dark:border-slate-800 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 dark:bg-[#0a0f1a] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" /> Candidate Safety Guide
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">4 golden rules to avoid hiring scams</h2>
              <p className="text-sm text-slate-400 mt-1">Keep these in mind every time you apply for a job online in India.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {SCAM_RULES.map((r, i) => (
                <div key={i} className={`p-6 border-slate-800 ${i < 2 ? 'border-b' : ''} ${i % 2 === 0 ? 'sm:border-r' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono font-black text-amber-400">{r.n}</span>
                    <h4 className="font-bold text-white text-sm">{r.title}</h4>
                  </div>
                  <div className="p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl mb-3">
                    <p className="text-xs text-rose-300 italic leading-relaxed">{r.flag}</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.truth}</p>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/fraud-board"
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition cursor-pointer">
                <AlertTriangle className="w-4 h-4" /> View Scam Board
              </Link>
              <Link to="/report-fraud"
                className="flex items-center gap-2 px-5 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold text-sm rounded-xl transition cursor-pointer">
                Report a Scam
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ
      ════════════════════════════════════════ */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-8 space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Common Questions</h2>
          <p className="text-sm text-slate-500">Quick answers for job seekers and employers</p>
        </div>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group">
                <span className="font-semibold text-sm text-slate-900 dark:text-white pr-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">{f.q}</span>
                {openFaq === i
                  ? <ChevronUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative overflow-hidden bg-emerald-600 rounded-2xl p-8 sm:p-10 text-center text-white">
          {/* subtle pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize:'24px 24px'}} />
          <div className="relative space-y-4">
            <ShieldCheck className="w-10 h-10 mx-auto opacity-80" strokeWidth={1.5} />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Start your safe job search today</h2>
            <p className="text-emerald-100 text-sm max-w-sm mx-auto">Browse verified job openings from companies that passed our background check.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/jobs"
                className="px-6 py-3 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-sm rounded-xl transition cursor-pointer shadow-md w-full sm:w-auto">
                Browse Verified Jobs
              </Link>
              <Link to="/register"
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl border border-emerald-500 transition cursor-pointer w-full sm:w-auto">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
