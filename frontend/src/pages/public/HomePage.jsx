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
  RefreshCw,
  Sparkles,
  ExternalLink,
  Briefcase,
  XCircle,
  Share2
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

  // Terminal Showcase State
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'calc' | '3d'
  const [selectedEntity, setSelectedEntity] = useState('razorpay');
  const [isScanning, setIsScanning] = useState(false);
  const [salaryLpa, setSalaryLpa] = useState(24);

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

  const triggerAuditScan = (key) => {
    setSelectedEntity(key);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 450);
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
      salary: 'â‚¹24.0 LPA',
      domain: 'razorpay.com',
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
      salary: 'â‚¹35.0 LPA',
      domain: 'zerodha.com',
      avatar: 'ZD',
      verified: true
    },
    swiggy: {
      name: 'Bundl Technologies Private Limited (Swiggy)',
      cin: 'U74110KA2013PTC096530',
      roc: 'ROC Bangalore, Karnataka',
      gstin: '29AADCB2244F1Z2 (Active)',
      score: 97,
      status: 'Statutory Compliant',
      zeroFees: true,
      role: 'Lead Mobile Engineer (React Native)',
      salary: 'â‚¹30.0 LPA',
      domain: 'swiggy.in',
      avatar: 'SW',
      verified: true
    },
    scam: {
      name: 'Apex Global Placement Solutions',
      cin: 'NOT REGISTERED ON MCA21',
      roc: 'No Corporate Record Found',
      gstin: 'FAKE / UNVERIFIED GSTIN',
      score: 18,
      status: 'High Risk: Deposit Fraud Detected',
      zeroFees: false,
      role: 'Data Entry Clerk (Demands â‚¹2,500 Fee)',
      salary: 'Fake Offer Letter',
      domain: 'gmail.com (Free Webmail)',
      avatar: 'âš ï¸',
      verified: false
    }
  };

  const currentEnt = entities[selectedEntity] || entities.razorpay;

  const calcMonthlyInHand = (lpa) => {
    const gross = (lpa * 100000) / 12;
    const inHand = gross * 0.83; // Standard EPF and deduction factor
    return Math.round(inHand).toLocaleString('en-IN');
  };

  const topCompanies = [
    'Razorpay', 'Zerodha', 'Swiggy', 'Zomato', 'Infosys', 'CRED', 'TCS', 'Flipkart'
  ];

  const steps = [
    {
      num: '01',
      title: 'Real-Time MCA21 Verification',
      desc: 'Every employer is verified against the Ministry of Corporate Affairs database to confirm active CIN registration and ROC status.'
    },
    {
      num: '02',
      title: 'Domain & Identity Auditing',
      desc: 'We enforce verified corporate email domains and corporate GSTIN matching to prevent WhatsApp SIM-card impersonators.'
    },
    {
      num: '03',
      title: 'Zero-Fee Candidate Guarantee',
      desc: 'Never pay for application processing, laptops, or onboarding. Any entity charging fees is immediately blacklisted.'
    },
    {
      num: '04',
      title: 'Transparent Compensation',
      desc: 'Upfront LPA ranges and take-home breakdowns so you negotiate with full market transparency.'
    }
  ];

  const faqs = [
    {
      q: 'What makes TrustHire different from standard job boards?',
      a: 'Traditional portals allow anyone with a Gmail account to post jobs, resulting in widespread deposit fraud and fake WhatsApp recruiters. TrustHire requires statutory validation (MCA21 CIN, registered corporate domain, and active GSTIN) before an employer can publish opportunities.'
    },
    {
      q: 'How does TrustHire verify an employer with the Ministry of Corporate Affairs?',
      a: 'When an employer registers, their 21-digit Corporate Identification Number (CIN) is cross-checked against statutory Indian MCA21 records. We inspect active incorporation status, company registration date, and official ROC compliance.'
    },
    {
      q: 'Is TrustHire 100% free for candidates and freshers?',
      a: 'Yes. TrustHire is permanently free for job seekers. Applying for jobs, creating profiles, viewing corporate statutory audits, and utilizing the take-home calculator carry zero fees.'
    },
    {
      q: 'What should I do if a recruiter asks for money for an interview or laptop?',
      a: 'Legitimate employers never demand money for interviews, aptitude tests, uniform kits, or laptop deposits. If anyone asks you for money, immediately report them on our Public Fraud Board. We will investigate and publish an alert for the community.'
    },
    {
      q: 'How is the 0-100 Corporate TrustScore computed?',
      a: 'TrustScore combines verified MCA21 incorporation (+30), corporate domain validation (+20), active GSTIN record (+20), and clean candidate safety history (+30). Verified candidate fraud complaints deduct points immediately.'
    }
  ];

  return (
    <div className="space-y-24 pb-28 theme-transition relative overflow-hidden bg-grid-pattern">
      
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none radial-glow -z-10" />

      {/* Hero Section: Centered, High-Impact Modern Architecture */}
      <section className="pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-8">
        
        {/* Shimmer Announcement Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/[0.08] border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold shadow-sm backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>TrustHire 2.0 â€¢ Indiaâ€™s Statutory Verified Hiring Infrastructure</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        </motion.div>

        {/* Master Headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Where India's top talent meets{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-300">
              strictly verified
            </span>{' '}
            companies.
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Every employer is cross-checked against Ministry of Corporate Affairs (MCA21) registries. 
            Zero application fees. Zero fake recruiters. Upfront salary disclosures.
          </p>
        </motion.div>

        {/* Command Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <form 
            onSubmit={handleSearchSubmit} 
            className="glass-panel p-2.5 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/60 flex flex-col sm:flex-row items-center gap-2 border border-slate-200/80 dark:border-white/[0.1] transition-all focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500/60"
          >
            <div className="flex items-center space-x-3 px-3 py-2 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800">
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Role, skill, or company (e.g. React, Golang)..."
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 px-3 py-2 w-full sm:w-1/2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City (Bengaluru, Pune) or 'Remote'..."
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-1.5 flex-shrink-0 shadow-lg shadow-emerald-600/25 cursor-pointer"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1">Trending:</span>
            {['React', 'Backend Engineer', 'Remote', 'â‚¹25L+ LPA', 'Bengaluru', 'Product Designer'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleQuickTagClick(tag)}
                className="px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-emerald-500/40 transition text-xs font-medium cursor-pointer shadow-xs"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Live Trust Metrics Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-6 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 max-w-3xl mx-auto"
        >
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">100% MCA21 Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">â‚¹0 Candidate Fees Enforced</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Corporate Domain Verified</span>
          </div>
        </motion.div>

      </section>

      {/* Centerpiece: Interactive Trust Terminal Showcase */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.1] bg-white/95 dark:bg-[#0D131F]/95 backdrop-blur-xl shadow-2xl shadow-slate-200/50 dark:shadow-black/70 overflow-hidden">
          
          {/* Terminal Top Window Bar */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                trusthire-telemetry --interactive
              </span>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex items-center space-x-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'audit'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Statutory Audit</span>
              </button>

              <button
                onClick={() => setActiveTab('calc')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'calc'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                <span>Take-Home Calculator</span>
              </button>

              <button
                onClick={() => setActiveTab('3d')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === '3d'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5 text-emerald-600" />
                <span>3D Trust Nexus</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Live Interactive MCA21 Audit Terminal */}
          {activeTab === 'audit' && (
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Company Selector Pills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>SELECT TEST ENTITY TO AUDIT:</span>
                  {isScanning && (
                    <span className="text-emerald-600 flex items-center space-x-1 font-mono text-[11px]">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>QUERYING MCA21 API...</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'razorpay', label: 'Razorpay', tag: 'Fintech â€¢ 98 Score' },
                    { key: 'zerodha', label: 'Zerodha', tag: 'Trading â€¢ 99 Score' },
                    { key: 'swiggy', label: 'Swiggy', tag: 'Consumer â€¢ 97 Score' },
                    { key: 'scam', label: 'Suspect Entity', tag: 'âš ï¸ Scam Warning' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => triggerAuditScan(item.key)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        selectedEntity === item.key
                          ? item.key === 'scam'
                            ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 text-rose-800 dark:text-rose-200 ring-2 ring-rose-400/20'
                            : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-xs">{item.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{item.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Entity Forensic Dossier */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedEntity}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/40 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        currentEnt.verified
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
                      }`}>
                        {currentEnt.avatar}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">{currentEnt.name}</h3>
                          {currentEnt.verified ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-[10px] font-bold font-mono">
                              MCA21 ACTIVE
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 text-[10px] font-bold font-mono">
                              UNREGISTERED
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          CIN: {currentEnt.cin} â€¢ {currentEnt.roc}
                        </p>
                      </div>
                    </div>

                    <TrustScoreBadge score={currentEnt.score} size="lg" />
                  </div>

                  {/* Forensic Parameters Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">GSTIN RECORD</span>
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{currentEnt.gstin}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">VERIFIED DOMAIN</span>
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">@{currentEnt.domain}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">CANDIDATE CHARGES</span>
                      <span className={`font-bold text-xs ${currentEnt.zeroFees ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                        {currentEnt.zeroFees ? 'â‚¹0 (Zero Fees Guaranteed)' : 'âš ï¸ Demands Deposit'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500">
                      Sample listing: <strong className="text-slate-800 dark:text-slate-200">{currentEnt.role}</strong> ({currentEnt.salary})
                    </div>
                    <Link
                      to="/jobs"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
                    >
                      Browse Verified Jobs â†’
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Tab 2: Interactive In-Hand Take-Home Salary Calculator */}
          {activeTab === 'calc' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Annual Gross CTC (Lakhs Per Annum):</span>
                  <span className="font-mono text-xl font-black text-emerald-600">â‚¹{salaryLpa}.0 LPA</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="65"
                  step="1"
                  value={salaryLpa}
                  onChange={(e) => setSalaryLpa(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>â‚¹6L</span>
                  <span>â‚¹20L</span>
                  <span>â‚¹40L</span>
                  <span>â‚¹65L</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase font-mono tracking-wider block">
                    Estimated In-Hand
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                    â‚¹{calcMonthlyInHand(salaryLpa)}
                  </div>
                  <span className="text-[11px] text-slate-500">Credited to bank account / mo</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider block">
                    Provident Fund (EPF 12%)
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 font-mono">
                    â‚¹{Math.round(((salaryLpa * 100000 * 0.4) / 12) * 0.12).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-slate-500">Employer + Employee retirement</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider block">
                    Tax / Standard Deduction
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 font-mono">
                    â‚¹75,000 Exempt
                  </div>
                  <span className="text-[11px] text-slate-500">Standard salaried deduction</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center">
                All TrustHire job listings mandate transparent CTC disclosures without hidden deductions.
              </p>
            </div>
          )}

          {/* Tab 3: Interactive 3D WebGL Trust Nexus */}
          {activeTab === '3d' && (
            <div className="p-6 sm:p-8 space-y-3">
              <div className="h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                <TrustNetworkScene />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-emerald-400 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <span>THREE.JS WEBGL CORE â€¢ ACTIVE</span>
                  <span>18 STATUTORY NODES</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center font-mono">
                Interactive real-time node mesh visualizing statutory employer compliance across India.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* Verified Employers Marquee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          JOIN OVER 4,200+ COMPLIANT TECH COMPANIES HIRING ON TRUSTHIRE
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {topCompanies.map((c, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{c}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Verified Opportunities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
              CURATED FEED
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

      {/* Side-by-Side Scam Anatomy vs TrustHire Verified Anatomy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono font-bold uppercase text-rose-500 tracking-wider">
            CANDIDATE FORENSIC DEFENSE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            How to spot a fake job offer in 5 seconds
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Compare the anatomy of a predatory recruitment scam with a genuine verified TrustHire offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Anatomy of a Scam Trap */}
          <div className="rounded-3xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-mono text-xs font-bold uppercase">
                âš ï¸ THE SCAM TRAP
              </span>
              <span className="text-xs font-mono text-rose-600 font-semibold">100% ILLEGAL</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/50 space-y-1">
                <div className="font-bold text-rose-600 dark:text-rose-400">1. Demands Candidate Money</div>
                <p className="text-slate-600 dark:text-slate-400">
                  "Pay â‚¹2,500 for training kit / interview uniform / laptop security via GooglePay before interview."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/50 space-y-1">
                <div className="font-bold text-rose-600 dark:text-rose-400">2. Temporary Messaging Only</div>
                <p className="text-slate-600 dark:text-slate-400">
                  Conducts text-only interviews exclusively on WhatsApp or Telegram to avoid IP and corporate email traceability.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/50 space-y-1">
                <div className="font-bold text-rose-600 dark:text-rose-400">3. Zero Technical Evaluation</div>
                <p className="text-slate-600 dark:text-slate-400">
                  Issues instant offer letters offering â‚¹12 LPA for roles you never applied for without technical testing.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Anatomy of a TrustHire Verified Job */}
          <div className="rounded-3xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-mono text-xs font-bold uppercase">
                ðŸ›¡ï¸ TRUSTHIRE VERIFIED
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">STATUTORY SAFE</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">1. Permanent Zero-Fee Guarantee</div>
                <p className="text-slate-600 dark:text-slate-400">
                  Every company signs our zero-deposit policy. Any recruiter requesting money is instantly blacklisted.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">2. MCA21 Corporate Identification</div>
                <p className="text-slate-600 dark:text-slate-400">
                  Every employer's 21-digit CIN is verified directly against Ministry of Corporate Affairs registries.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-800/50 space-y-1">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">3. Official Domain & GSTIN Cross-Checked</div>
                <p className="text-slate-600 dark:text-slate-400">
                  HR contacts must match registered company domains and GSTIN filings. No anonymous recruiters.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4-Step Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
            SECURITY BLUEPRINT
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            How TrustHire Works
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            A four-step statutory security pipeline built to protect Indian engineers and freshers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-panel space-y-3 shadow-sm hover:border-emerald-500/40 transition"
            >
              <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                {s.num}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base pt-1">{s.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Public Fraud Advisory Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 glass-panel space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Public Scam Advisory Radar</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live community incident feed alerting candidates of active recruiter impersonation.</p>
            </div>
            <Link
              to="/fraud-board"
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1 flex-shrink-0"
            >
              <span>View Full Scam Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentScams.length > 0 ? (
              recentScams.slice(0, 3).map((scam) => (
                <div key={scam._id} className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3 text-xs flex flex-col justify-between">
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

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                      {scam.amountDemanded > 0 ? `Demanded: â‚¹${scam.amountDemanded.toLocaleString()}` : 'Zero-Fee Fraud'}
                    </span>
                    <button
                      onClick={() => {
                        const msg = `âš ï¸ SCAM ALERT on TrustHire: Beware of fake recruiter claiming "${scam.title}". Read details: ${window.location.origin}/fraud-board`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Alert WhatsApp</span>
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
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
            TRANSPARENCY
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Everything you need to know about MCA verification, zero-fee enforcement, and safe hiring.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm overflow-hidden transition-colors shadow-xs"
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

      {/* Recruiter Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 glass-panel p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Are you an employer hiring verified talent?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Verify your company identity via corporate CIN in under 2 minutes. Verified companies receive 4x more applications from top developers.
            </p>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link
              to="/employer/verify"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer"
            >
              Verify Company
            </Link>
            <Link
              to="/employer/post-job"
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              Post an Opening
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
