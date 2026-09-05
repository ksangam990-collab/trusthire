import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Search, MapPin, ArrowRight, CheckCircle2,
  Lock, Building2, AlertTriangle, FileCheck, Users,
  ChevronDown, ChevronUp, IndianRupee, TrendingUp, Radio,
  Sparkles, Check, ExternalLink, Briefcase, BadgeCheck
} from 'lucide-react';
import { jobsApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';

/* ─────────────────── Data ─────────────────── */
const QUICK_TAGS = ['Frontend', 'Backend', 'Full Stack', 'Remote', 'Bengaluru', 'Fresher'];

const STATS = [
  { value: '2,400+', label: 'Verified Tech Jobs', sub: 'Cross-checked via MCA21' },
  { value: '380+',   label: 'Registered Companies', sub: 'Official corporate domains' },
  { value: '18,000+',label: 'Job Seekers Protected', sub: 'Zero fake placements' },
  { value: '₹0 Fees', label: '100% Free Forever', sub: 'Zero candidate charges' },
];

const COMPANIES = [
  { name: 'Razorpay', domain: 'razorpay.com' },
  { name: 'Zerodha', domain: 'zerodha.com' },
  { name: 'Swiggy', domain: 'swiggy.in' },
  { name: 'Zomato', domain: 'zomato.com' },
  { name: 'Infosys', domain: 'infosys.com' },
  { name: 'CRED', domain: 'cred.club' },
  { name: 'TCS', domain: 'tcs.com' },
  { name: 'Flipkart', domain: 'flipkart.com' }
];

const SPOTLIGHTS = [
  {
    id: 'razorpay',
    name: 'Razorpay Software',
    shortName: 'Razorpay',
    role: 'Senior Full Stack Engineer',
    salary: '₹24.0L – ₹32.0L',
    monthly: '~₹1.65L – ₹2.2L / mo in-hand',
    location: 'Bengaluru (Hybrid)',
    jobType: 'Full-time',
    skills: ['React', 'TypeScript', 'Node.js', 'Go', 'AWS'],
    cin: 'U72200KA2013PTC070993',
    domain: 'razorpay.com',
    score: 98,
    avatarBg: 'bg-blue-600',
    avatarText: 'RZ'
  },
  {
    id: 'zerodha',
    name: 'Zerodha Broking Ltd',
    shortName: 'Zerodha',
    role: 'Systems Architect (Golang)',
    salary: '₹30.0L – ₹42.0L',
    monthly: '~₹2.05L – ₹2.85L / mo in-hand',
    location: 'Bengaluru (Remote)',
    jobType: 'Full-time · Remote',
    skills: ['Go', 'PostgreSQL', 'Kafka', 'Docker', 'Linux'],
    cin: 'U67120KA2010PTC054045',
    domain: 'zerodha.com',
    score: 99,
    avatarBg: 'bg-emerald-600',
    avatarText: 'ZD'
  },
  {
    id: 'swiggy',
    name: 'Bundl Technologies (Swiggy)',
    shortName: 'Swiggy',
    role: 'Staff React Native Engineer',
    salary: '₹28.0L – ₹38.0L',
    monthly: '~₹1.90L – ₹2.60L / mo in-hand',
    location: 'Bengaluru / Hybrid',
    jobType: 'Full-time',
    skills: ['React Native', 'TypeScript', 'GraphQL', 'Mobile Perf'],
    cin: 'U74110KA2013PTC096530',
    domain: 'swiggy.in',
    score: 97,
    avatarBg: 'bg-orange-600',
    avatarText: 'SW'
  }
];

const HOW = [
  { icon: Building2,  title: 'Statutory Registry Verified',  desc: 'Every employer CIN and GSTIN is checked against official Ministry of Corporate Affairs (MCA21) records before posting.' },
  { icon: FileCheck,  title: 'Official Corporate Domains',   desc: 'Recruiters must verify with their official @company.com email. Anonymous Gmail and Yahoo accounts are strictly prohibited.' },
  { icon: Lock,       title: 'Zero Candidate Charges',       desc: 'Applying is 100% free. Any employer asking for application fees, training deposits, or uniform costs is permanently banned.' },
];

const SCAM_RULES = [
  { n: '01', title: 'They ask for money first',          flag: '"Pay ₹2,500 for uniform / training kit via PhonePe."',          truth: 'Real companies in India never charge candidates. This is always a scam.' },
  { n: '02', title: 'Interview only on WhatsApp',        flag: '"You are selected! Complete your HR round on WhatsApp."',         truth: 'Legitimate employers use official video calls or email — never WhatsApp chats.' },
  { n: '03', title: 'Offer without any interview',       flag: '"Your CV matched! Pay ₹4,000 to unlock your offer letter."',   truth: 'No genuine company gives a job offer without a proper interview process first.' },
  { n: '04', title: 'They ask for your UPI PIN or OTP',  flag: '"Enter your UPI PIN to activate your salary account."',          truth: 'Salaries use bank account numbers. Real HR never needs your UPI PIN or OTP.' },
];

const FAQS = [
  { q: 'Is TrustHire free for job seekers?',             a: 'Yes, completely free. Search, apply, and view salary details without paying a rupee.' },
  { q: 'How do you verify companies?',                    a: 'We match every employer against the Ministry of Corporate Affairs (MCA21) registry and require official corporate email domains during signup.' },
  { q: 'What if a recruiter asks me for money?',          a: "Don't pay. Screenshot everything and report it using our Report button. We investigate every case and ban scammers." },
  { q: 'Are there fresher or entry-level jobs?',          a: 'Yes! We have internships, fresher, and entry-level roles from verified startups and large companies across India.' },
  { q: 'Can paid employers rank their jobs higher?',      a: 'No. Rankings are based on recency and trust score only — never by payment.' },
];

export default function HomePage() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [keyword, setKeyword]   = useState('');
  const [city, setCity]         = useState('');
  const [openFaq, setOpenFaq]   = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    jobsApi.getJobs({ limit: 4, sortBy: 'createdAt', order: 'desc' })
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

  const spotlight = SPOTLIGHTS[activeTab];

  return (
    <div className="theme-transition overflow-x-hidden min-h-screen">

      {/* ════════════════════════════════════════
          HERO & VALUE HUB (Unified, Balanced Viewport)
      ════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-5 sm:pt-10 pb-10 sm:pb-14 max-w-5xl mx-auto text-center">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none -z-10" />

        {/* Verification Status Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -4 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.25 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3 sm:mb-4"
        >
          <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>India's Verified Hiring Network</span>
        </motion.div>

        {/* Primary Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 6 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.05 }}
          className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white mb-2.5 sm:mb-3"
        >
          Find genuine tech jobs in India<br />
          <span className="text-emerald-500 dark:text-emerald-400">without the scams.</span>
        </motion.h1>

        {/* Concise Subhead */}
        <motion.p 
          initial={{ opacity: 0, y: 6 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-slate-600 dark:text-slate-400 text-xs sm:text-base max-w-lg mx-auto leading-relaxed mb-5 sm:mb-6"
        >
          Every employer is verified against official government registries before posting.
          Upfront salaries. Zero candidate fees.
        </motion.p>

        {/* Search Bar */}
        <motion.form 
          onSubmit={doSearch} 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.15 }}
          className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 sm:p-2 shadow-lg shadow-slate-200/40 dark:shadow-black/60 flex flex-col sm:flex-row gap-2 transition-all focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 mb-3"
        >
          <div className="flex items-center gap-2 flex-1 px-3 py-1.5 sm:py-2 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800">
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <input 
              type="text" 
              value={keyword} 
              onChange={e => setKeyword(e.target.value)}
              placeholder="Role, skill, or employer..."
              className="w-full text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none min-w-0" 
            />
          </div>
          <div className="flex items-center gap-2 flex-1 px-3 py-1.5 sm:py-2">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input 
              type="text" 
              value={city} 
              onChange={e => setCity(e.target.value)}
              placeholder="City or 'Remote'..."
              className="w-full text-xs sm:text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none min-w-0" 
            />
          </div>
          <button 
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-1.5 flex-shrink-0 shadow-sm cursor-pointer"
          >
            <span>Search Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.form>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] sm:text-xs text-slate-500 mb-5 sm:mb-6">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Popular:</span>
          {QUICK_TAGS.map(t => (
            <button 
              key={t} 
              onClick={() => navigate('/jobs?keyword=' + encodeURIComponent(t))}
              className="px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition font-medium cursor-pointer"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Integrated Metrics & Guarantees Bar (Fits completely in initial viewport) */}
        <div className="p-3.5 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
            {STATS.map((s, i) => (
              <div key={i} className={`text-center ${i > 0 ? 'pt-2.5 sm:pt-0 sm:pl-3' : ''}`}>
                <div className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {s.label}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ════════════════════════════════════════
          TRUSTED EMPLOYERS BAR
      ════════════════════════════════════════ */}
      <section className="border-y border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 py-5 sm:py-7 mb-10 sm:mb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Trusted by candidates applying to top engineering teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {COMPANIES.map(c => (
              <div 
                key={c.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs"
              >
                <span>{c.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          INTERACTIVE SPOTLIGHT SHOWCASE (Mobile & Desktop Masterpiece)
      ════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 sm:mb-20">
        
        {/* Header with Segmented Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
              <span>Interactive Verification Showcase</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              What verified openings look like
            </h2>
          </div>

          {/* Segmented Control Switcher */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto w-full sm:w-auto">
            {SPOTLIGHTS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveTab(idx)}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === idx
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* The Card */}
        <motion.div 
          key={spotlight.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-black/60 overflow-hidden"
        >
          {/* Card Top Banner */}
          <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-slate-500 font-semibold text-[11px] sm:text-xs">
                MCA21 CIN: <strong className="text-slate-700 dark:text-slate-300">{spotlight.cin}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trust Score {spotlight.score}/100</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">
            
            {/* Employer & Role Header */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${spotlight.avatarBg} text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm`}>
                {spotlight.avatarText}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {spotlight.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" /> Verified Employer
                  </span>
                </div>
                <h4 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                  {spotlight.role}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {spotlight.location} · {spotlight.jobType} · Verified domain: <code className="text-slate-700 dark:text-slate-300 font-mono font-semibold">@{spotlight.domain}</code>
                </p>
              </div>
            </div>

            {/* Compensation & Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Verified Compensation
                </span>
                <div className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {spotlight.salary} <span className="text-xs font-semibold text-slate-500 font-sans">/ year</span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                  {spotlight.monthly}
                </div>
              </div>

              <div className="space-y-1 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-4">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Candidate Protections
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>No security deposit or registration fee</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>Direct recruiter review (zero intermediary)</span>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-xs font-semibold text-slate-400 mr-1">Skills:</span>
              {spotlight.skills.map(sk => (
                <span key={sk} className="text-[11px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {sk}
                </span>
              ))}
            </div>

            {/* Card Footer Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 text-center sm:text-left">
                Free application guarantee · Never pay recruiters for interviews
              </span>
              <Link 
                to="/jobs"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Browse Verified Openings</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED JOBS (Latest Verified Openings)
      ════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 sm:mb-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Active Listings
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              Latest Verified Openings
            </h2>
          </div>
          <Link to="/jobs" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 flex-shrink-0">
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <JobCardSkeleton key={i} />)}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map(j => <JobCard key={j._id} job={j} />)}
          </div>
        ) : (
          <div className="text-center py-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="font-bold text-slate-900 dark:text-white text-sm">No active listings yet</p>
            <p className="text-xs text-slate-500">Verified openings will appear here as companies pass validation.</p>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS (Three Protection Pillars)
      ════════════════════════════════════════ */}
      <section className="bg-slate-50 dark:bg-slate-950/40 border-y border-slate-200 dark:border-slate-800 py-12 sm:py-16 mb-14 sm:mb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Safe Recruitment Standard
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              How TrustHire protects every applicant
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Standard job portals let anyone post with a free email. TrustHire enforces strict legal corporate checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {HOW.map((h, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                  <h.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                  {h.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SCAM RULES — Candidate Protection Guide
      ════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 sm:mb-20">

        {/* Outer shell — deep dark card */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0a0e17] border border-white/[0.07] shadow-2xl">

          {/* Subtle amber glow top-left */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-rose-500/6 rounded-full blur-3xl pointer-events-none" />

          {/* ── Header ── */}
          <div className="relative px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8 border-b border-white/[0.06]">

            {/* Section label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] font-bold uppercase tracking-widest">
              <AlertTriangle className="w-3.5 h-3.5" />
              Candidate Protection Guide
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  4 golden rules to<br className="hidden sm:block" />
                  <span className="text-amber-400"> avoid hiring scams</span>
                </h2>
                <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                  Keep these rules in mind whenever a recruiter contacts you on WhatsApp, Telegram, or email.
                </p>
              </div>

              {/* Stat callout */}
              <div className="flex-shrink-0 p-3 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center min-w-[120px]">
                <div className="text-2xl font-black text-rose-400">₹0</div>
                <div className="text-[11px] text-slate-400 font-semibold mt-0.5 leading-tight">
                  Real jobs<br/>never charge you
                </div>
              </div>
            </div>
          </div>

          {/* ── Rules grid ── */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.05]">
            {SCAM_RULES.map((r, i) => (
              <div
                key={i}
                className="bg-[#0a0e17] p-6 sm:p-8 space-y-4 hover:bg-white/[0.02] transition-colors duration-200"
              >
                {/* Rule number + title row */}
                <div className="flex items-start gap-3">
                  {/* Number badge */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/12 border border-amber-500/25 flex items-center justify-center">
                    <span className="text-[11px] font-black font-mono text-amber-400 leading-none">
                      {r.n}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-white text-sm sm:text-base leading-snug pt-1">
                    {r.title}
                  </h4>
                </div>

                {/* Scam phrase quote */}
                <div className="relative pl-3 border-l-2 border-rose-500/50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-500/70 mb-1">
                    What scammers say:
                  </div>
                  <p className="text-xs sm:text-[13px] text-rose-300/90 italic leading-relaxed font-medium">
                    {r.flag}
                  </p>
                </div>

                {/* Truth */}
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                    {r.truth}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Footer CTA ── */}
          <div className="relative px-6 sm:px-10 py-6 sm:py-7 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 text-center sm:text-left max-w-xs">
              Spotted a scam? Report it in 30 seconds — every report protects hundreds of job seekers.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <Link
                to="/fraud-board"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all duration-150 shadow-lg shadow-rose-900/30 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                View Live Scam Board
              </Link>
              <Link
                to="/report-fraud"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.04] hover:bg-white/[0.07] text-slate-300 hover:text-white text-xs font-bold transition-all duration-150 cursor-pointer"
              >
                Report a Scam
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ ACCORDION
      ════════════════════════════════════════ */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 mb-16">
        <div className="text-center mb-6 space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Clear answers for job seekers and hiring teams
          </p>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((f, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"
              >
                <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white pr-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  {f.q}
                </span>
                {openFaq === i
                  ? <ChevronUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          BOTTOM CALL TO ACTION — Rich version
      ════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-[#090d16] border border-slate-800 shadow-2xl">

          {/* Background glow orbs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">

              {/* Left: Text */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>India's Verified Hiring Network</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  Ready to find genuine jobs<br className="hidden sm:block" />
                  <span className="text-emerald-400"> the safe way?</span>
                </h2>

                <p className="text-slate-400 text-xs sm:text-sm max-w-md lg:max-w-none leading-relaxed">
                  Every job on TrustHire is posted by a company verified against official government registries.
                  Transparent salaries. Zero candidate fees. Zero placement fraud.
                </p>

                <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 pt-1">
                  <Link
                    to="/jobs"
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Browse Verified Openings
                  </Link>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Create Free Account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right: Trust stats */}
              <div className="w-full lg:w-auto grid grid-cols-2 gap-3 lg:gap-4 flex-shrink-0">
                {[
                  { value: '2,400+', label: 'Active Jobs',        icon: Briefcase },
                  { value: '380+',   label: 'Verified Companies', icon: Building2 },
                  { value: '₹0',     label: 'Candidate Fees',     icon: IndianRupee },
                  { value: '100%',   label: 'Fraud-Free Promise',  icon: ShieldCheck },
                ].map(({ value, label, icon: Icon }) => (
                  <div
                    key={label}
                    className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center"
                  >
                    <Icon className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
                    <div className="text-lg sm:text-xl font-black text-white">{value}</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
