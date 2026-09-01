import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Building2, 
  Users, 
  AlertTriangle,
  Sparkles,
  Zap,
  Globe,
  Award,
  Shield,
  FileCheck,
  Check
} from 'lucide-react';
import { jobsApi, fraudApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import TrustNetworkScene from '../../components/3d/TrustNetworkScene';
import InteractiveMeshBackground from '../../components/canvas/InteractiveMeshBackground';
import { JobCardSkeleton } from '../../components/ui/Skeleton';

export default function HomePage() {
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentScams, setRecentScams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // Interactive CIN Simulator Widget State
  const [simulatedCin, setSimulatedCin] = useState('U72900KA2021PTC145678');
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState({
    verified: true,
    company: 'TechCorp India Pvt Ltd',
    trustScore: 92,
    status: 'MCA21 Active & Good Standing'
  });

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
    if (searchKeyword.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const handleSimulate = (e) => {
    e.preventDefault();
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      const isEven = simulatedCin.length % 2 === 0;
      setSimResult({
        verified: isEven,
        company: isEven ? 'Innovate Systems India Ltd' : 'Unregistered / Inactive Entity',
        trustScore: isEven ? 95 : 30,
        status: isEven ? 'MCA21 Active & Good Standing' : 'Statutory Registry Not Found'
      });
    }, 600);
  };

  return (
    <div className="relative min-h-screen space-y-24 pb-24 overflow-hidden theme-transition">
      {/* Interactive Constellation Canvas */}
      <InteractiveMeshBackground />

      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 pb-8 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Search */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>INDIA'S FIRST VERIFIED RECRUITMENT NETWORK</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Apply with <span className="gradient-text-emerald">Zero Risk</span> of Career Fraud.
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                TrustHire validates corporate MCA CINs, GST registrations, and executive domain integrity to eliminate fake offer letters, deposit fees, and ghost jobs.
              </p>

              {/* Search Bar Container */}
              <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-2.5 max-w-xl">
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Role, skill (e.g. React, Node.js, Cloud Architect)..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm shadow-sm"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-300 text-white dark:text-slate-900 font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 flex-shrink-0 shadow-md shadow-emerald-500/20"
                >
                  <span>Explore Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>

              {/* Metric Strip */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-200 dark:border-slate-800 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">100%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">MCA Verified</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">₹0</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Zero Candidate Fees</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">24/7</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Fraud Radar Active</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: 3D Trust Nexus with Floating Live Status */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 h-[420px] relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/60 dark:bg-[#0E1522]/80 backdrop-blur-xl overflow-hidden flex items-center justify-center shadow-xl dark:shadow-2xl"
            >
              <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>3D TRUST NEXUS • ACTIVE</span>
              </div>
              <TrustNetworkScene />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Statutory Verification Demo Simulator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f172a]/85 backdrop-blur-xl shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1 max-w-lg">
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                INTERACTIVE SIMULATION
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Test Statutory MCA21 Validation Live
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                See how TrustHire validates government registries and computes employer TrustScores in real-time.
              </p>
            </div>

            <form onSubmit={handleSimulate} className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto flex-grow max-w-md">
              <input
                type="text"
                value={simulatedCin}
                onChange={(e) => setSimulatedCin(e.target.value.toUpperCase())}
                placeholder="Enter 21-character CIN..."
                className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-emerald-500 flex-grow"
              />
              <button
                type="submit"
                disabled={simulating}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-300 text-white dark:text-slate-900 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-sm"
              >
                {simulating ? <span>Checking...</span> : <span>Run Audit</span>}
              </button>
            </form>
          </div>

          {/* Result Card */}
          {simResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-2xl border text-xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-center ${
                simResult.verified
                  ? 'bg-emerald-50/70 dark:bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50/70 dark:bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`p-2 rounded-xl ${simResult.verified ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
                  {simResult.verified ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{simResult.company}</div>
                  <div className="text-[11px] opacity-80 font-mono">{simResult.status}</div>
                </div>
              </div>

              <div className="text-center sm:text-left">
                <span className="text-[10px] font-mono uppercase opacity-70">Statutory Score:</span>
                <div className="text-lg font-black font-mono text-slate-900 dark:text-white">{simResult.trustScore} / 100</div>
              </div>

              <div className="text-right sm:text-right">
                <span className={`inline-block px-3 py-1 rounded-full font-mono text-[11px] font-bold ${
                  simResult.verified ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                }`}>
                  {simResult.verified ? 'VERIFIED STATUTORY MATCH' : 'SUSPICIOUS / UNREGISTERED'}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Trust Pillars Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            SECURITY INFRASTRUCTURE
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How TrustHire Eliminates Hiring Scams
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            A multi-layer statutory validation and community intelligence network protecting career seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-[#0f172a]/75 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Automated MCA & GST Validation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every employer must match government registries (MCA21 CIN & GSTIN) before publishing openings. Ghost companies cannot register.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-[#0f172a]/75 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Algorithmic TrustScore (0-100)</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Employers carry a verifiable trust quotient based on statutory history, official domain alignment, and clean hiring records.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-[#0f172a]/75 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Community Fraud Defense</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Candidate scam reports automatically halt suspect listings and alert other applicants in real-time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Verified Openings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              CURATED OPENINGS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Latest Verified Roles
            </h2>
          </div>
          <Link
            to="/jobs"
            className="mt-4 sm:mt-0 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center space-x-1.5 group"
          >
            <span>Explore all verified openings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : recentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/30 space-y-2">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">No active listings right now</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Register as an employer to post verified openings.</p>
          </div>
        )}
      </section>

      {/* Live Fraud Intelligence Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/5 via-slate-100/70 to-white/90 dark:from-amber-950/20 dark:via-slate-900/80 dark:to-slate-950 border border-amber-500/25 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Live Fraud Intelligence Radar</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Public incident summaries of fake interviewers, deposit requests, and phishing attempts.</p>
              </div>
            </div>
            <Link
              to="/fraud-board"
              className="text-xs font-bold px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 transition text-center flex-shrink-0"
            >
              Open Full Scam Feed →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentScams.length > 0 ? (
              recentScams.slice(0, 3).map((scam) => (
                <div key={scam._id} className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase font-mono">
                      {scam.fraudCategory}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(scam.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 line-clamp-1">{scam.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{scam.description}</p>
                  {scam.amountDemanded > 0 && (
                    <div className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-bold pt-1">
                      Demanded: ₹{scam.amountDemanded.toLocaleString()}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-6 text-xs text-slate-400 font-mono">
                NO ACTIVE CRITICAL THREATS IN LIVE BUFFER
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recruiter Callout Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-500/10 via-slate-100 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/30 p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
              <Award className="w-4 h-4" />
              <span>FOR VERIFIED RECRUITERS & ENTERPRISES</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Build Instant Candidate Trust with Official Statutory Badges.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Verify your company via MCA CIN & GSTIN. Verified employers experience 4x higher applicant engagement and verified badge prestige.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
            <Link
              to="/employer/verify"
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-300 text-white dark:text-slate-900 font-bold text-xs sm:text-sm transition text-center shadow-md"
            >
              Verify Company Now
            </Link>
            <Link
              to="/employer/post-job"
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition text-center"
            >
              Post an Opening
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
