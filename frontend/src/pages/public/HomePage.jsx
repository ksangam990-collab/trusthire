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
  { value: '2,400+', label: 'Verified Tech Jobs', detail: 'Cross-checked with MCA21' },
  { value: '380+',   label: 'Registered Employers', detail: 'Official corporate domains' },
  { value: '18,000+',label: 'Job Seekers Protected', detail: 'Zero scam victims' },
  { value: '₹0 Fees', label: '100% Free Forever', detail: 'Zero candidate charges' },
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

  const spotlight = SPOTLIGHTS[activeTab];

  return (
    <div className="theme-transition overflow-x-hidden min-h-screen">

      {/* ════════════════════════════════════════
          HERO SECTION (Optimized for Mobile & Desktop)
      ════════════════════════════════════════ */}
      <section className="relative pt-6 sm:pt-12 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        {/* Pill Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -6 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4 sm:mb-6"
        >
          <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span>India's Verified Hiring Network</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.35, delay: 0.05 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white mb-3 sm:mb-4"
        >
          Find genuine tech jobs in India<br />
          <span className="text-emerald-500 dark:text-emerald-400">without the scams.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.35, delay: 0.1 }}
          className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8"
        >
          Every employer is verified against government records before posting.
          Upfront salaries. Zero application fees.
        </motion.p>

        {/* Search Bar */}
        <motion.form 
          onSubmit={doSearch} 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.35, delay: 0.15 }}
          className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xl shadow-slate-200/50 dark:shadow-black/50 flex flex-col sm:flex-row gap-2 transition-all focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 mb-3 sm:mb-4"
        >
          <div className="flex items-center gap-2.5 flex-1 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800">
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <input 
              type="text" 
              value={keyword} 
              onChange={e => setKeyword(e.target.value)}
              placeholder="Role, skill, or employer..."
              className="w-full text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none min-w-0" 
            />
          </div>
          <div className="flex items-center gap-2.5 flex-1 px-3 py-2">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input 
              type="text" 
              value={city} 
              onChange={e => setCity(e.target.value)}
              placeholder="City or 'Remote'..."
              className="w-full text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none min-w-0" 
            />
          </div>
          <button 
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 flex-shrink-0 shadow-sm cursor-pointer"
          >
            <span>Search Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.form>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-500 mb-6 sm:mb-8">
          <span className="font-semibold text-slate-600 dark:text-slate-400">Popular:</span>
          {QUICK_TAGS.map(t => (
            <button 
              key={t} 
              onClick={() => navigate('/jobs?keyword=' + encodeURIComponent(t))}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition font-medium cursor-pointer"
            >
              {t}
            </button>
          ))}
        </div>

        {/* Key Guarantees Strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> MCA21 & GST Verified
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Upfront Salary Disclosure
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> ₹0 Fees for Candidates
          </span>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS BENTO STRIP (Responsive 2x2 on Mobile, 4x1 on Desktop)
      ════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
            {STATS.map((s, i) => (
              <div key={i} className={`text-center ${i > 0 ? 'pt-3 sm:pt-0 sm:pl-4' : ''}`}>
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {s.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
                  {s.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TRUSTED COMPANIES BAR
      ════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="text-center space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Candidates on TrustHire explore opportunities at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {COMPANIES.map(c => (
              <div 
                key={c.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs"
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
        
        {/* Header with Segmented Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
              <span>Interactive Verification Showcase</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              See what a verified job looks like
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
          <div className="px-5 sm:px-7 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-slate-500 font-semibold">
                MCA21 CIN: <strong className="text-slate-700 dark:text-slate-300">{spotlight.cin}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trust Score {spotlight.score}/100</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 sm:p-7 space-y-6">
            
            {/* Employer & Role Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`w-12 h-12 rounded-2xl ${spotlight.avatarBg} text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  {spotlight.avatarText}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {spotlight.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Verified Employer
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {spotlight.role}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {spotlight.location} · {spotlight.jobType} · Recruiter domain verified: <code className="text-slate-700 dark:text-slate-300 font-mono">@{spotlight.domain}</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Compensation & Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Verified Compensation
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {spotlight.salary} <span className="text-xs font-semibold text-slate-500 font-sans">/ year</span>
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {spotlight.monthly}
                </div>
              </div>

              <div className="space-y-1.5 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Candidate Protections
                </span>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>No security deposit or registration fee</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>Direct recruiter review (zero intermediary)</span>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-400 mr-1">Skills:</span>
              {spotlight.skills.map(sk => (
                <span key={sk} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
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
          SCAM RULES (High Contrast Candidate Shield)
      ════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 sm:mb-20">
        <div className="bg-slate-900 dark:bg-[#090d16] border border-slate-800 rounded-3xl overflow-hidden p-6 sm:p-10 space-y-8 shadow-xl">
          
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> 
              <span>Candidate Protection Guide</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              4 golden rules to avoid hiring scams
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Keep these practical rules in mind whenever communicating with recruiters on WhatsApp, Telegram, or email.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SCAM_RULES.map((r, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    RULE {r.n}
                  </span>
                  <h4 className="font-bold text-white text-sm">{r.title}</h4>
                </div>
                <div className="p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl">
                  <p className="text-xs text-rose-300 italic leading-relaxed">{r.flag}</p>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{r.truth}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              to="/fraud-board"
              className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>View Live Scam Board</span>
            </Link>
            <Link 
              to="/report-fraud"
              className="w-full sm:w-auto px-5 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center cursor-pointer"
            >
              <span>Report a Scam</span>
            </Link>
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
          BOTTOM CALL TO ACTION
      ════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-emerald-600 dark:bg-emerald-700 rounded-3xl p-8 sm:p-12 text-center text-white space-y-4 shadow-xl shadow-emerald-600/10">
          <ShieldCheck className="w-10 h-10 mx-auto opacity-90" strokeWidth={2} />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to find genuine jobs the safe way?
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Browse verified tech jobs with transparent salaries. No recruiter fees, no fake placements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link 
              to="/jobs"
              className="px-6 py-3 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-md w-full sm:w-auto"
            >
              Browse Verified Openings
            </Link>
            <Link 
              to="/register"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl border border-emerald-500 transition cursor-pointer w-full sm:w-auto"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
