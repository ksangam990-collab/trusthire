import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Building2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert,
  Building,
  Check,
  TrendingUp,
  Sparkles,
  IndianRupee,
  Briefcase,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Eye,
  ExternalLink
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

  const topCompanies = [
    { name: 'Razorpay', location: 'Bengaluru' },
    { name: 'Zerodha', location: 'Bengaluru' },
    { name: 'Swiggy', location: 'Bengaluru' },
    { name: 'Infosys', location: 'Pune' },
    { name: 'Zomato', location: 'Gurugram' },
    { name: 'TCS', location: 'Mumbai' }
  ];

  const steps = [
    {
      num: '01',
      title: 'Search Opportunities',
      desc: 'Discover vetted tech openings with upfront LPA compensation and verified corporate domains.'
    },
    {
      num: '02',
      title: 'Verify Employer Identity',
      desc: 'Inspect statutory MCA21 CIN records, GST filings, and the employer TrustScore before applying.'
    },
    {
      num: '03',
      title: 'Apply with Zero Fees',
      desc: 'Send your resume directly to verified HR teams. Never pay a single rupee for interviews or onboarding.'
    },
    {
      num: '04',
      title: 'Stay Safe & Report',
      desc: 'Alert the community immediately if an impersonator attempts deposit or phishing scams.'
    }
  ];

  const redFlags = [
    {
      title: 'Demanding Application or Training Fees',
      desc: 'Legitimate employers never ask for application processing charges, laptop security deposits, or uniform fees.'
    },
    {
      title: 'Interviews Exclusively on WhatsApp or Telegram',
      desc: 'Scammers avoid official corporate email addresses and conduct fake "text interviews" on messaging apps.'
    },
    {
      title: 'Immediate Job Offers Without an Interview',
      desc: 'Receiving an unprompted offer letter with high salary promises for roles you never applied to is an impersonation scam.'
    },
    {
      title: 'Demanding Sensitive Bank Credentials or OTPs',
      desc: 'Never share banking passwords, UPI PINs, or financial access codes during hiring or background verification.'
    }
  ];

  const faqs = [
    {
      q: 'What is an MCA21 CIN Number and why does TrustHire verify it?',
      a: 'In India, the Ministry of Corporate Affairs (MCA21) issues a unique 21-digit Corporate Identification Number (CIN) to every registered company. TrustHire verifies this number to confirm the employer is a legally registered corporate entity and not an anonymous scammer.'
    },
    {
      q: 'Why do fake recruiters use WhatsApp or Telegram instead of official emails?',
      a: 'Scammers avoid using corporate domain emails because domains require legal verification. They instead use WhatsApp or Gmail to demand application deposits, uniform charges, or laptop security fees. TrustHire screens all employer domains to eliminate impersonation.'
    },
    {
      q: 'Is TrustHire 100% free for job seekers and college freshers?',
      a: 'Yes, TrustHire is completely free for candidates forever. Applying for jobs, creating your profile, and reviewing corporate verification audits carry zero charges.'
    },
    {
      q: 'How does the 0–100 Corporate TrustScore work?',
      a: 'Each employer starts with a baseline quotient. Verified MCA21 registration adds +30 points, official corporate domain validation adds +10 points, and clean candidate feedback adds +10 points. Verified fraud reports deduct -15 points per confirmed incident.'
    },
    {
      q: 'What should I do if an employer asks for money during an interview?',
      a: 'Legitimate companies NEVER ask for money during recruitment. If an employer requests any payment, immediately stop communication and file an incident report on our Fraud Board. Our admin team will investigate and penalize the listing.'
    }
  ];

  return (
    <div className="space-y-16 pb-20 theme-transition">
      {/* 2-Column Split Hero Section (Stripe & Wellfound Inspired) */}
      <section className="pt-10 sm:pt-16 pb-12 bg-gradient-to-b from-white via-slate-50 to-slate-100/60 dark:from-[#0B0F17] dark:via-[#0F172A] dark:to-[#0B0F17] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Value Proposition & Integrated Search */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Statutory Tag */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>MCA21 & GST Statutory Verified • Zero-Fee Guarantee</span>
              </div>

              {/* Inspiring Headline */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                  The trusted way to find your next tech role in India.
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  Search thousands of verified engineering, design, and product jobs. Every company is cross-checked with the Ministry of Corporate Affairs so you never deal with deposit scams.
                </p>
              </div>

              {/* Elevated Dual-Input Search Card */}
              <form onSubmit={handleSearchSubmit} className="bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col sm:flex-row items-center gap-2 max-w-xl">
                <div className="flex items-center space-x-2.5 px-3 py-2 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700">
                  <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Role or skill (e.g. React, Node.js)..."
                    className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2.5 px-3 py-2 w-full sm:w-1/2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or 'Remote'..."
                    className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-1 flex-shrink-0 shadow-sm shadow-indigo-600/20"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/jobs"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition shadow-sm"
                >
                  Browse Verified Jobs
                </Link>
                <Link
                  to="/report-fraud"
                  className="px-5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs transition flex items-center space-x-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Report a Scam</span>
                </Link>
              </div>

              {/* Popular Quick Tags */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1">Popular:</span>
                {['React Developer', 'Node.js', 'Python', 'Remote', 'Bengaluru', 'Fresher'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleQuickTagClick(tag)}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition font-medium shadow-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Trust Metric Strip */}
              <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">100% MCA Checked</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹0 Candidate Fees</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Direct HR Verification</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Verified Job Showcase & Audit Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                
                {/* Header with Live Verification Indicator */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[11px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400">
                      LIVE STATUTORY AUDIT
                    </span>
                  </div>
                  <TrustScoreBadge score={98} size="sm" />
                </div>

                {/* Company & Role Details */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                      RZ
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Razorpay Software Private Limited</h4>
                      <p className="text-[11px] text-slate-500 font-mono">CIN: U72200KA2013PTC070993 • ROC Karnataka</p>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                    Senior Full Stack Engineer (React/Node.js)
                  </h3>

                  <div className="flex flex-wrap gap-2 text-xs pt-1">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      Bengaluru • Hybrid
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                      ₹24.0 Lakhs / yr (~₹1.65L/mo in-hand)
                    </span>
                  </div>
                </div>

                {/* Audit Checklist */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 dark:text-slate-400">MCA21 Company Status:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active & Compliant
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 dark:text-slate-400">GSTIN Registration:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">29AAAAA0000A1Z5 (Active)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 dark:text-slate-400">Candidate Fee Policy:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Zero Fees Guaranteed</span>
                  </div>
                </div>

                <Link
                  to="/jobs"
                  className="block text-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold text-xs transition"
                >
                  Browse Verified Opportunities →
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Corporate Trust Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Verified hiring organizations across India
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {topCompanies.map((c, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center space-x-2 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition"
              >
                <span className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Verified Openings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
              Featured Opportunities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Latest Verified Openings
            </h2>
          </div>
          <Link
            to="/jobs"
            className="mt-3 sm:mt-0 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <span>Explore all verified jobs</span>
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
            <p className="text-xs text-slate-500">Employers will publish verified openings here.</p>
          </div>
        )}
      </section>

      {/* How TrustHire Works (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
            Trust-First Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            How TrustHire Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            A simple, verified 4-step recruitment process engineered for candidate security.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-800">
                {s.num}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base pt-1">{s.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fraud Protection & Red Flags Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>CANDIDATE SAFETY DIRECTIVE</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Know the red flags before you apply.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Recruitment scams cost Indian job seekers over ₹500 Crores annually. Stay vigilant with these 4 golden rules.
              </p>
            </div>

            <Link
              to="/fraud-board"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition flex items-center space-x-1.5 flex-shrink-0"
            >
              <span>Learn How to Spot a Scam</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-800">
            {redFlags.map((rf, idx) => (
              <div key={idx} className="space-y-2 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                <div className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                  !
                </div>
                <h4 className="font-bold text-white text-sm">{rf.title}</h4>
                <p className="text-slate-300 leading-relaxed">{rf.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Scam Advisory Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Public Scam Advisory Feed</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified reports of fake recruiter deposits and WhatsApp impersonation.</p>
            </div>
            <Link
              to="/fraud-board"
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1 flex-shrink-0"
            >
              <span>Open Full Fraud Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentScams.length > 0 ? (
              recentScams.slice(0, 3).map((scam) => (
                <div key={scam._id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900 uppercase font-mono">
                        {scam.fraudCategory}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(scam.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{scam.title}</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-3 leading-relaxed">{scam.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                      {scam.amountDemanded > 0 ? `Demanded: ₹${scam.amountDemanded.toLocaleString()}` : 'Zero-Fee Fraud'}
                    </span>
                    <button
                      onClick={() => {
                        const msg = `⚠️ SCAM ALERT on TrustHire: Beware of fake recruiter "${scam.employer?.companyName || 'unverified entity'}" claiming "${scam.title}". Read: https://trusthire-six.vercel.app/fraud-board`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      Alert WhatsApp 📲
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-6 text-xs text-slate-400">
                No critical threats in live feed.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Everything you need to know about TrustHire
          </h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Clear, transparent answers on statutory verification, zero fees, and fraud prevention.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between space-x-4 text-sm font-bold text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recruiter Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Hiring verified engineering or product talent?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Verified corporate badges increase candidate application rates by 4x. Verify your company in 2 minutes.
            </p>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link
              to="/employer/verify"
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition shadow-sm"
            >
              Verify Company
            </Link>
            <Link
              to="/employer/post-job"
              className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs sm:text-sm transition"
            >
              Post an Opening
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
