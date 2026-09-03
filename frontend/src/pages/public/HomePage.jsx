import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert,
  AlertTriangle,
  Briefcase,
  Share2,
  CheckCircle,
  FileCheck,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { jobsApi, fraudApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';
import TrustScoreBadge from '../../components/ui/TrustScoreBadge';

export default function HomePage() {
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentScams, setRecentScams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  // Hero interactive sample showcase state
  const [activeSpotlight, setActiveSpotlight] = useState('razorpay');

  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [jobsRes, fraudRes] = await Promise.all([
          jobsApi.getJobs({ limit: 4, verifiedOnly: 'true' }),
          fraudApi.getBoard({ limit: 3 })
        ]);
        setRecentJobs(jobsRes?.data?.jobs || []);
        setRecentScams(fraudRes?.data?.reports || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (location.trim()) params.append('city', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleQuickTagClick = (tag) => {
    navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
  };

  const spotlights = {
    razorpay: {
      name: 'Razorpay Software',
      role: 'Senior Full Stack Engineer',
      salary: '₹24.0L – ₹32.0L / yr',
      location: 'Bengaluru (Hybrid)',
      cin: 'U72200KA2013PTC070993',
      domain: 'razorpay.com',
      trustScore: 98,
      avatar: 'RZ'
    },
    zerodha: {
      name: 'Zerodha Broking',
      role: 'Systems Architect (Golang)',
      salary: '₹30.0L – ₹42.0L / yr',
      location: 'Bengaluru (Remote)',
      cin: 'U67120KA2010PTC054045',
      domain: 'zerodha.com',
      trustScore: 99,
      avatar: 'ZD'
    },
    swiggy: {
      name: 'Swiggy (Bundl Tech)',
      role: 'Staff React Native Engineer',
      salary: '₹28.0L – ₹38.0L / yr',
      location: 'Bengaluru / Remote',
      cin: 'U74110KA2013PTC096530',
      domain: 'swiggy.in',
      trustScore: 97,
      avatar: 'SW'
    }
  };

  const currentSpotlight = spotlights[activeSpotlight];

  const trustedCompanies = [
    'Razorpay', 'Zerodha', 'Swiggy', 'Zomato', 'Infosys', 'CRED', 'TCS', 'Flipkart'
  ];

  const protections = [
    {
      icon: <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Company Registration Checked',
      desc: 'We cross-check every employer against official Indian corporate registries (CIN & GST) before they can post any job.'
    },
    {
      icon: <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Official Corporate Emails Only',
      desc: 'Recruiters must register with verified company domains (@company.com). We block anonymous webmails and unverified recruiters.'
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: '100% Free for Candidates',
      desc: 'Zero application fees, uniform charges, or laptop deposits. Any company asking candidates for money is permanently banned.'
    }
  ];

  const scamRules = [
    {
      number: '01',
      title: 'Asking for money before an interview',
      redFlag: '"Please deposit ₹2,500 for training materials or uniform fees via Google Pay/PhonePe."',
      truth: 'Legitimate employers in India NEVER charge candidates for recruitment. This is always a scam.'
    },
    {
      number: '02',
      title: 'Interviews conducted only on WhatsApp',
      redFlag: '"You are selected! Chat with the HR manager on WhatsApp to complete your interview."',
      truth: 'Real companies use official video calls (Google Meet, Zoom) or official email, not anonymous WhatsApp text chats.'
    },
    {
      number: '03',
      title: 'Job offer without any interview',
      redFlag: '"Congratulations! Your resume was shortlisted for ₹15 LPA. Sign the offer letter and pay ₹5,000 for verification."',
      truth: 'No genuine company gives out high-paying technical job offers without a proper interview or coding assessment.'
    },
    {
      number: '04',
      title: 'Asking for your banking OTP or UPI PIN',
      redFlag: '"Enter your UPI PIN to activate your salary account or receive your joining bonus."',
      truth: 'Salaries are credited using standard bank account numbers (IFSC). Real HR never needs your UPI PIN or banking passwords.'
    }
  ];

  const faqs = [
    {
      q: 'Is TrustHire completely free for job seekers?',
      a: 'Yes, 100% free forever. You can search jobs, view verified company details, and apply directly to employers without paying anything.'
    },
    {
      q: 'How does TrustHire verify employers?',
      a: 'We verify company registration credentials with the Ministry of Corporate Affairs (MCA21) and ensure recruiters register using official company email domains rather than personal webmail.'
    },
    {
      q: 'What should I do if a recruiter asks me for money?',
      a: 'Never pay any money. Take screenshots and report them immediately using our "Report Scam" button. We will investigate, ban the account, and post a warning to protect other candidates.'
    },
    {
      q: 'Can college freshers and beginners find jobs here?',
      a: 'Yes! We have entry-level, internship, and fresher openings from verified startups and companies across India.'
    }
  ];

  return (
    <div className="space-y-20 pb-24 theme-transition relative overflow-hidden">
      
      {/* Top Ambient Emerald Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none radial-glow -z-10 opacity-75" />

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Clean Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/[0.12] border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>India's Verified Hiring Network</span>
        </div>

        {/* Headline & Subhead */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Find genuine tech jobs in India{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              without the scams.
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Every employer is verified against official corporate registries before posting. 
            Upfront salaries. No fake recruiters. No application fees.
          </p>
        </div>

        {/* Clean, Polished Search Bar */}
        <div className="max-w-2xl mx-auto">
          <form 
            onSubmit={handleSearchSubmit} 
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20"
          >
            <div className="flex items-center space-x-3 px-3 py-2.5 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800">
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skill, or company..."
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 px-3 py-2.5 w-full sm:w-1/2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or 'Remote'..."
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm transition flex items-center justify-center space-x-1.5 flex-shrink-0 shadow-sm shadow-emerald-600/20 cursor-pointer"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-600 dark:text-slate-400 mr-1">Popular:</span>
            {['Frontend', 'Backend', 'Full Stack', 'Remote', 'Bengaluru', 'Fresher'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleQuickTagClick(tag)}
                className="px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition font-medium cursor-pointer shadow-xs"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Simple Value Points */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800 max-w-2xl mx-auto">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-800 dark:text-slate-200">Registered Companies Only</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-800 dark:text-slate-200">₹0 Fees for Candidates</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-800 dark:text-slate-200">Upfront Salaries</span>
          </div>
        </div>

        {/* Interactive Verified Job Spotlight (Visual Centerpiece that eliminates the empty void) */}
        <div className="pt-2 max-w-2xl mx-auto text-left">
          <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl shadow-slate-200/50 dark:shadow-black/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Live Verified Opportunity Spotlight
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                {['razorpay', 'zerodha', 'swiggy'].map((k) => (
                  <button
                    key={k}
                    onClick={() => setActiveSpotlight(k)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                      activeSpotlight === k
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-black text-sm flex items-center justify-center flex-shrink-0">
                  {currentSpotlight.avatar}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {currentSpotlight.name}
                    </h3>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Verified Company</span>
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {currentSpotlight.role}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    CIN: {currentSpotlight.cin} • Official @{currentSpotlight.domain}
                  </p>
                </div>
              </div>

              <TrustScoreBadge score={currentSpotlight.trustScore} size="md" />
            </div>

            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs gap-3">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                  {currentSpotlight.salary}
                </span>
                <span className="text-slate-500 font-medium">
                  {currentSpotlight.location}
                </span>
              </div>
              <Link
                to="/jobs"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center space-x-1 shadow-xs cursor-pointer"
              >
                <span>View Verified Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Verified Companies Row */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Trusted by candidates applying to top tech teams across India
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {trustedCompanies.map((c, i) => (
            <div
              key={i}
              className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5 shadow-xs"
            >
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{c}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Verified Jobs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
              Featured Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Latest Verified Openings
            </h2>
          </div>
          <Link
            to="/jobs"
            className="mt-2 sm:mt-0 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <span>View all verified jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : recentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-2">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No active listings right now</h4>
            <p className="text-xs text-slate-500">New verified jobs will appear here.</p>
          </div>
        )}
      </section>

      {/* How TrustHire Keeps You Safe (3 Simple Cards) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
            Safe Hiring
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Why job hunting on TrustHire is different
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Traditional job boards let anyone with a free email post fake jobs. Here is how we protect you:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {protections.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{p.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Practical Scam Advice: 4 Golden Rules */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>CANDIDATE SAFETY GUIDE</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                4 golden rules to avoid hiring scams
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Keep these practical rules in mind whenever you are looking for a job in India.
              </p>
            </div>

            <Link
              to="/fraud-board"
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>View Recent Scam Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scamRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-amber-400 font-bold text-xs">{rule.number}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-medium text-[10px]">
                    Scam Warning
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm">{rule.title}</h3>
                <p className="italic text-slate-300">{rule.redFlag}</p>
                <p className="text-emerald-400 pt-1 font-medium border-t border-slate-700">{rule.truth}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Scam Alerts (Fraud Radar) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent scam alerts from job seekers</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real reports submitted by candidates to alert the community of active scams.</p>
            </div>
            <Link
              to="/fraud-board"
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>See all scam reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentScams.length > 0 ? (
              recentScams.slice(0, 3).map((scam) => (
                <div key={scam._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900 uppercase">
                        {scam.fraudCategory}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(scam.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{scam.title}</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-3 leading-relaxed">{scam.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                      {scam.amountDemanded > 0 ? `Demanded ₹${scam.amountDemanded.toLocaleString()}` : 'Zero-Fee Scam'}
                    </span>
                    <button
                      onClick={() => {
                        const msg = `⚠️ SCAM ALERT: Beware of fake recruiter claiming "${scam.title}". Read details: ${window.location.origin}/fraud-board`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Share alert</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-6 text-xs text-slate-400">
                No reports right now.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
            Help & Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Clear answers to common questions about TrustHire and safe hiring in India.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between space-x-4 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recruiter Callout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Are you hiring engineering or product talent?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Verify your company registration in under 2 minutes and post verified roles that candidates genuinely trust.
            </p>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link
              to="/employer/verify"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer"
            >
              Verify Company
            </Link>
            <Link
              to="/employer/post-job"
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              Post an Opening
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
