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
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert,
  Check,
  AlertTriangle,
  Calculator,
  Box,
  RefreshCw
} from 'lucide-react';
import { jobsApi, fraudApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';
import TrustScoreBadge from '../../components/ui/TrustScoreBadge';
import TrustNetworkScene from '../../components/3d/TrustNetworkScene';

export default function HomePage() {
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentScams, setRecentScams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  // Interactive Hero Showcase state
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | '3d' | 'calc'
  const [selectedEntity, setSelectedEntity] = useState('razorpay');
  const [isAuditing, setIsAuditing] = useState(false);
  const [salaryLpa, setSalaryLpa] = useState(24);

  // Interactive Red Flags Active Index
  const [activeFlag, setActiveFlag] = useState(0);

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

  const triggerAuditSimulation = (key) => {
    setSelectedEntity(key);
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
    }, 500);
  };

  const entities = {
    razorpay: {
      name: 'Razorpay Software Private Limited',
      cin: 'U72200KA2013PTC070993',
      roc: 'ROC Bangalore, Karnataka',
      gstin: '29AAAAA0000A1Z5 (Active)',
      score: 98,
      status: 'Statutory Compliant',
      zeroFees: true,
      role: 'Senior Full Stack Engineer',
      salary: 'â‚¹24.0 Lakhs / yr',
      avatar: 'RZ',
      verified: true
    },
    zerodha: {
      name: 'Zerodha Broking Limited',
      cin: 'U67120KA2010PTC054045',
      roc: 'ROC Bangalore, Karnataka',
      gstin: '29AABCB1234F1Z8 (Active)',
      score: 99,
      status: 'Statutory Compliant',
      zeroFees: true,
      role: 'Systems Architect (Golang)',
      salary: 'â‚¹35.0 Lakhs / yr',
      avatar: 'ZD',
      verified: true
    },
    zomato: {
      name: 'Zomato Limited',
      cin: 'L93030HR2010PLC040809',
      roc: 'ROC Delhi & Haryana',
      gstin: '07AAACZ1234D1Z2 (Active)',
      score: 96,
      status: 'Statutory Compliant',
      zeroFees: true,
      role: 'Staff Product Designer',
      salary: 'â‚¹28.0 Lakhs / yr',
      avatar: 'ZM',
      verified: true
    },
    scam: {
      name: 'Global Apex Placement Agency (Unregistered)',
      cin: 'NOT REGISTERED ON MCA21',
      roc: 'No Corporate Record Found',
      gstin: 'INVALID / FAKE REGISTRATION',
      score: 18,
      status: 'Severe Risk: Fake Recruiter Deposit Alert',
      zeroFees: false,
      role: 'Data Entry (Demands â‚¹2,500 Fee)',
      salary: 'Fake Offer Promise',
      avatar: 'âš ï¸',
      verified: false
    }
  };

  const currentEnt = entities[selectedEntity] || entities.razorpay;

  // Monthly salary calculation helper
  const calcMonthlyInHand = (lpa) => {
    const gross = (lpa * 100000) / 12;
    const inHand = gross * 0.83;
    return Math.round(inHand).toLocaleString('en-IN');
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
      quote: '"Please deposit â‚¹2,500 for uniform/laptop security kit via GooglePay before the HR interview."',
      forensic: 'Legitimate corporate employers NEVER charge candidates for interviews, software licenses, or training kits. Under Indian labor regulations, this is 100% fraud.',
      counter: 'TrustHire automatically bans and logs any recruiter demanding candidate deposits.'
    },
    {
      title: 'Interviews Exclusively on WhatsApp or Telegram',
      quote: '"Greetings! You have been selected. Please message HR manager on WhatsApp +91-98xxx to complete interview."',
      forensic: 'Scammers avoid using registered corporate email domains (@company.com). They use temporary SIM cards to lure job seekers without paper trails.',
      counter: 'We enforce corporate domain MX verification and statutory phone authentication.'
    },
    {
      title: 'Immediate Job Offers Without an Interview',
      quote: '"Congratulations! Your resume was shortlisted for â‚¹12 LPA remote developer. Sign attached offer letter now."',
      forensic: 'Issuing high-salary employment contracts without technical evaluation or video rounds is a signature trap to collect banking documents and fake insurance fees.',
      counter: 'Every job on TrustHire undergoes verified HR screening before publication.'
    },
    {
      title: 'Demanding Sensitive Bank Credentials or OTPs',
      quote: '"To credit your onboarding stipend, kindly submit your UPI PIN or banking OTP for auto-verification."',
      forensic: 'Salaries are credited via standard NEFT/IMPS IFSC account numbers. No company ever needs your ATM PIN, NetBanking password, or UPI OTP.',
      counter: 'TrustHire maintains a public live scam board to flag phishing attempts.'
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
      q: 'How does the 0â€“100 Corporate TrustScore work?',
      a: 'Each employer starts with a baseline quotient. Verified MCA21 registration adds +30 points, official corporate domain validation adds +10 points, and clean candidate feedback adds +10 points. Verified fraud reports deduct -15 points per confirmed incident.'
    },
    {
      q: 'What should I do if an employer asks for money during an interview?',
      a: 'Legitimate companies NEVER ask for money during recruitment. If an employer requests any payment, immediately stop communication and file an incident report on our Fraud Board. Our admin team will investigate and penalize the listing.'
    }
  ];

  return (
    <div className="space-y-20 pb-24 theme-transition relative overflow-hidden">
      {/* 2-Column Split Hero Section with Interactive Showcase */}
      <section className="relative pt-12 sm:pt-20 pb-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white/60 via-slate-50/50 to-transparent dark:from-[#0B0F17]/80 dark:via-[#0F172A]/50 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition & Interactive Search */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-7"
            >
              {/* Statutory Tag */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>MCA21 & GST Statutory Verified â€¢ Zero-Fee Guarantee</span>
              </div>

              {/* Inspiring Headline */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                  The trusted way to find your next{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300">
                    tech role in India.
                  </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  Search thousands of verified engineering, design, and product jobs. Every company is cross-checked with the Ministry of Corporate Affairs so you never deal with deposit scams.
                </p>
              </div>

              {/* Elevated Dual-Input Search Card with Interactive Focus */}
              <form onSubmit={handleSearchSubmit} className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/40 flex flex-col sm:flex-row items-center gap-2 max-w-xl transition-all focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20">
                <div className="flex items-center space-x-2.5 px-3 py-2 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800">
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
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-1.5 flex-shrink-0 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/jobs"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm hover:shadow-md active:scale-95"
                >
                  Browse Verified Jobs
                </Link>
                <Link
                  to="/report-fraud"
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition flex items-center space-x-1.5 active:scale-95"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                  <span>Report a Scam</span>
                </Link>
              </div>

              {/* Popular Quick Tags with Spring Physics */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1">Popular:</span>
                {['React Developer', 'Node.js', 'Python', 'Remote', 'Bengaluru', 'Fresher'].map((tag) => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickTagClick(tag)}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition font-medium shadow-sm cursor-pointer"
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>

              {/* Trust Metric Strip */}
              <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">100% MCA Checked</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">â‚¹0 Candidate Fees</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Direct HR Verification</span>
                </div>
              </div>

            </motion.div>

            {/* Right Column: Interactive Statutory Audit Simulator / 3D Trust Showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="p-6 rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/60 space-y-5">
                
                {/* Interactive Mode Navigation Tabs */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveTab('audit')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                        activeTab === 'audit'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Live Audit</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('3d')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                        activeTab === '3d'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5 text-emerald-600" />
                      <span>3D Nexus</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('calc')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                        activeTab === 'calc'
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                      <span>In-Hand</span>
                    </button>
                  </div>

                  <TrustScoreBadge score={currentEnt.score} size="sm" />
                </div>

                {/* Tab 1: Live Interactive Audit Simulator */}
                {activeTab === 'audit' && (
                  <div className="space-y-4">
                    {/* Entity Quick Selectors */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>Select Company to Inspect:</span>
                        {isAuditing && (
                          <span className="text-emerald-600 flex items-center space-x-1">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Querying MCA21...</span>
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { key: 'razorpay', label: 'Razorpay' },
                          { key: 'zerodha', label: 'Zerodha' },
                          { key: 'zomato', label: 'Zomato' },
                          { key: 'scam', label: 'Fake Entity' }
                        ].map((item) => (
                          <button
                            key={item.key}
                            onClick={() => triggerAuditSimulation(item.key)}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition text-center truncate ${
                              selectedEntity === item.key
                                ? item.key === 'scam'
                                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-700 dark:text-rose-300'
                                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Company Details */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedEntity}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-xs flex-shrink-0 ${
                            currentEnt.verified
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          }`}>
                            {currentEnt.avatar}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{currentEnt.name}</h4>
                            <p className="text-[11px] text-slate-500 font-mono truncate">CIN: {currentEnt.cin} â€¢ {currentEnt.roc}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500 font-medium">Sample Verified Opening:</p>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{currentEnt.role}</h3>
                        </div>

                        {/* Audit Checklist Card */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 dark:text-slate-400">MCA21 Status:</span>
                            <span className={`font-bold flex items-center gap-1 ${
                              currentEnt.verified ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                              {currentEnt.verified ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                              {currentEnt.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 dark:text-slate-400">GSTIN Registration:</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">{currentEnt.gstin}</span>
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 dark:text-slate-400">Candidate Fee Policy:</span>
                            <span className={`font-bold ${currentEnt.zeroFees ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                              {currentEnt.zeroFees ? '100% Zero Fees Guaranteed' : 'Violates Security Policy'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <Link
                      to="/jobs"
                      className="block text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs transition"
                    >
                      Browse All Verified Opportunities â†’
                    </Link>
                  </div>
                )}

                {/* Tab 2: 3D Trust Nexus Visualizer */}
                {activeTab === '3d' && (
                  <div className="space-y-3">
                    <div className="h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                      <TrustNetworkScene />
                      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-emerald-400/80 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        <span>LIVE 3D TRUST NEXUS</span>
                        <span>18 VERIFIED NODES</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 text-center">
                      Interactive real-time node mesh visualizing statutory employer compliance across India.
                    </p>
                  </div>
                )}

                {/* Tab 3: Interactive In-Hand Take-Home Salary Calculator */}
                {activeTab === 'calc' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Annual CTC Compensation:</span>
                        <span className="font-bold text-emerald-600 font-mono text-sm">â‚¹{salaryLpa}.0 LPA</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="1"
                        value={salaryLpa}
                        onChange={(e) => setSalaryLpa(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>â‚¹5L</span>
                        <span>â‚¹25L</span>
                        <span>â‚¹45L</span>
                        <span>â‚¹60L</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                        Estimated Monthly Take-Home
                      </span>
                      <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                        ~â‚¹{calcMonthlyInHand(salaryLpa)} <span className="text-xs font-normal text-slate-500">/ month in-hand</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Estimated after EPF (12%) and standard new regime tax deductions. All TrustHire listings require transparent LPA breakdown.
                      </p>
                    </div>

                    <Link
                      to={`/jobs?keyword=${salaryLpa}L`}
                      className="block text-center py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                    >
                      Search Roles Offering â‚¹{salaryLpa}+ LPA â†’
                    </Link>
                  </div>
                )}

              </div>
            </motion.div>

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
              <motion.div
                key={i}
                whileHover={{ y: -3, scale: 1.02 }}
                className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center space-x-2 shadow-sm hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition"
              >
                <span className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Verified Openings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
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
            className="mt-3 sm:mt-0 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
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
          <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
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
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.02 }}
              className="p-6 rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition"
            >
              <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                {s.num}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base pt-1">{s.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Forensic Red Flags & Scam Inspector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>INTERACTIVE CANDIDATE SAFETY DIRECTIVE</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Know the red flags before you apply.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Click any scam scenario below to inspect the forensic analysis and statutory defense.
              </p>
            </div>

            <Link
              to="/fraud-board"
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center space-x-1.5 flex-shrink-0"
            >
              <span>Explore Public Scam Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Flag Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {redFlags.map((rf, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFlag(idx)}
                className={`p-4 rounded-xl text-left transition space-y-1.5 border cursor-pointer ${
                  activeFlag === idx
                    ? 'bg-slate-800 border-amber-400/80 ring-1 ring-amber-400/40'
                    : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">0{idx + 1}</span>
                  {activeFlag === idx && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                </div>
                <h4 className="font-bold text-sm text-white line-clamp-1">{rf.title}</h4>
              </button>
            ))}
          </div>

          {/* Forensic Breakdown Panel for Active Flag */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFlag}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4 text-xs"
            >
              <div className="flex items-start space-x-3">
                <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-mono font-bold text-[11px] uppercase">
                  Common Trap
                </span>
                <p className="italic text-slate-200 text-sm font-medium">
                  {redFlags[activeFlag].quote}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-700">
                <div className="space-y-1">
                  <span className="font-bold text-amber-300 uppercase tracking-wider text-[10px] font-mono">
                    Forensic Breakdown
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {redFlags[activeFlag].forensic}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] font-mono">
                    TrustHire Statutory Protection
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {redFlags[activeFlag].counter}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Public Scam Advisory Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Public Scam Advisory Radar</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time incident feed of verified candidate complaints and WhatsApp impersonation.</p>
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
                <div key={scam._id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-xs flex flex-col justify-between">
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
                      {scam.amountDemanded > 0 ? `Demanded: â‚¹${scam.amountDemanded.toLocaleString()}` : 'Zero-Fee Fraud'}
                    </span>
                    <button
                      onClick={() => {
                        const msg = `âš ï¸ SCAM ALERT on TrustHire: Beware of fake recruiter "${scam.employer?.companyName || 'unverified entity'}" claiming "${scam.title}". Read: ${window.location.origin}/fraud-board`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                    >
                      Alert WhatsApp ðŸ“²
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

      {/* Frequently Asked Questions with Framer Motion Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
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
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm overflow-hidden transition-colors shadow-sm"
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
                      transition={{ duration: 0.25 }}
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

      {/* Recruiter Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
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
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer"
            >
              Verify Company
            </Link>
            <Link
              to="/employer/post-job"
              className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              Post an Opening
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
