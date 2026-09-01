import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Award
} from 'lucide-react';
import { jobsApi, fraudApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import TrustNetworkScene from '../../components/3d/TrustNetworkScene';
import { JobCardSkeleton } from '../../components/ui/Skeleton';

export default function HomePage() {
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentScams, setRecentScams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
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

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 lg:pt-16 pb-6">
        <div className="absolute inset-0 grid-background opacity-40 pointer-events-none" />
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide shadow-glow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INDIA'S FIRST VERIFIED HIRING INFRASTRUCTURE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Apply with <span className="gradient-text-emerald">Zero Risk</span> of Recruitment Fraud.
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs sm:text-sm shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 flex-shrink-0 shadow-lg shadow-emerald-500/10"
                >
                  <span>Search Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Trust Indicators Metric Strip */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-800/80 max-w-lg">
                <div>
                  <div className="text-2xl font-black font-mono text-white tracking-tight">100%</div>
                  <div className="text-xs text-slate-400 mt-0.5">MCA CIN Verified</div>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">₹0</div>
                  <div className="text-xs text-slate-400 mt-0.5">Zero Candidate Fees</div>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-white tracking-tight">24/7</div>
                  <div className="text-xs text-slate-400 mt-0.5">Fraud Radar Active</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Trust Nexus */}
            <div className="lg:col-span-5 h-[420px] relative rounded-2xl border border-slate-800 bg-[#0E1522]/70 backdrop-blur-md overflow-hidden flex items-center justify-center shadow-2xl shadow-emerald-950/20">
              <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE TRUST NEXUS • 100% SECURE</span>
              </div>
              <TrustNetworkScene />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            SECURITY INFRASTRUCTURE
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How TrustHire Eliminates Hiring Scams
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            A multi-layer statutory validation and community intelligence network protecting career seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 transition group shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Automated MCA & GST Validation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every employer must match government registries (MCA21 CIN & GSTIN) before publishing openings. Ghost companies cannot register.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 transition group shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Algorithmic TrustScore (0-100)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Employers carry a verifiable trust quotient based on statutory history, official domain alignment, and clean hiring records.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 transition group shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5 group-hover:scale-110 transition">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Community Fraud Defense</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Candidate scam reports automatically halt suspect listings and alert other applicants in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Verified Openings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
              CURATED OPENINGS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Latest Verified Roles
            </h2>
          </div>
          <Link
            to="/jobs"
            className="mt-4 sm:mt-0 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 group"
          >
            <span>Explore all verified openings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
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
          <div className="text-center py-16 border border-slate-800 rounded-2xl bg-slate-900/30 space-y-2">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-white">No active listings right now</h4>
            <p className="text-xs text-slate-400">Check back shortly or register as an employer to post verified openings.</p>
          </div>
        )}
      </section>

      {/* Live Public Fraud Intelligence Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 border border-amber-500/20 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Live Fraud Intelligence Radar</h3>
                <p className="text-xs text-slate-400">Public incident summaries of fake interviewers, deposit requests, and phishing attempts.</p>
              </div>
            </div>
            <Link
              to="/fraud-board"
              className="text-xs font-semibold px-4 py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition text-center flex-shrink-0"
            >
              Open Full Scam Feed →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentScams.length > 0 ? (
              recentScams.slice(0, 3).map((scam) => (
                <div key={scam._id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase font-mono">
                      {scam.fraudCategory}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(scam.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">{scam.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{scam.description}</p>
                  {scam.amountDemanded > 0 && (
                    <div className="text-[11px] font-mono text-rose-400 font-bold pt-1">
                      Demanded: ₹{scam.amountDemanded.toLocaleString()}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-6 text-xs text-slate-500 font-mono">
                NO ACTIVE CRITICAL THREATS IN LIVE BUFFER
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Employer Onboarding Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 uppercase">
              <Award className="w-4 h-4" />
              <span>FOR VERIFIED RECRUITERS & CORPORATES</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Build Instant Candidate Trust with Official Statutory Badges.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Verify your company via MCA CIN & GSTIN. Verified employers experience 4x higher applicant engagement and verified badge prestige.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
            <Link
              to="/employer/verify"
              className="px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold text-xs sm:text-sm transition text-center shadow-lg shadow-emerald-500/10"
            >
              Verify Company Now
            </Link>
            <Link
              to="/employer/post-job"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition text-center"
            >
              Post an Opening
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
