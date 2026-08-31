import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, ShieldAlert, ArrowRight, CheckCircle2, Lock, Building, Users, AlertTriangle } from 'lucide-react';
import { jobsApi, fraudApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import TrustNetworkScene from '../../components/3d/TrustNetworkScene';

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
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 lg:pt-20">
        <div className="absolute inset-0 grid-background opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-4 h-4" />
                <span>INDIA'S ZERO-SCAM VERIFIED HIRING NETWORK</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Know <span className="gradient-text-emerald">who you are applying to</span> before sharing your identity.
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                TrustHire verifies corporate MCA CINs, GST registrations, and executive domains to eliminate ghost jobs, fake placement charges, and recruitment phishing.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Role, skill (e.g. React, Node.js, Product Manager)..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-semibold text-sm transition flex items-center justify-center space-x-2 flex-shrink-0"
                >
                  <span>Search Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Stats Strip */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg">
                <div>
                  <div className="text-2xl font-bold font-mono text-white">100%</div>
                  <div className="text-xs text-slate-400">MCA CIN Validated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">0 INR</div>
                  <div className="text-xs text-slate-400">No Application Fees</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-white">24/7</div>
                  <div className="text-xs text-slate-400">Fraud Engine Monitoring</div>
                </div>
              </div>
            </div>

            {/* Right 3D Visual */}
            <div className="lg:col-span-5 h-[420px] relative rounded-2xl border border-slate-800 bg-[#0E1522]/50 backdrop-blur-sm overflow-hidden flex items-center justify-center">
              <div className="absolute top-3 left-4 z-20 flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE VERIFICATION NEXUS</span>
              </div>
              <TrustNetworkScene />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Architecture Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Automated MCA & GST Validation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every recruiting organization must pass statutory identity and domain verification before posting openings.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Algorithmic Trust Score</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Employers are scored from 0 to 100 on historical recruitment integrity, domain continuity, and verified scam signals.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Instant Auto-Suspension</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multiple validated community fraud alerts trigger automated account lockout, halting active applications instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Verified Openings Marketplace Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              VERIFIED LISTINGS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Latest Verified Opportunities
            </h2>
          </div>
          <Link
            to="/jobs"
            className="mt-4 sm:mt-0 text-sm font-medium text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>Explore all verified jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 rounded-xl bg-slate-900/50 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : recentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-slate-800 rounded-xl bg-slate-900/30">
            <Building className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No verified openings listed at this moment.</p>
          </div>
        )}
      </section>

      {/* Live Fraud Intelligence Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-gradient-to-b from-amber-950/20 to-slate-900/40 border border-amber-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Live Public Fraud Board</h3>
                <p className="text-xs text-slate-400">Surfacing verified scams, fake recruiters, and registration fee schemes.</p>
              </div>
            </div>
            <Link
              to="/fraud-board"
              className="mt-4 sm:mt-0 text-xs font-semibold px-4 py-2 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition text-center"
            >
              View Full Intelligence Feed →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentScams.slice(0, 3).map((scam) => (
              <div key={scam._id} className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {scam.fraudCategory}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(scam.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">{scam.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{scam.description}</p>
                {scam.amountDemanded > 0 && (
                  <div className="text-xs font-mono text-rose-400 pt-1">
                    Demanded: ₹{scam.amountDemanded.toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Are you an authentic employer looking to build talent trust?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Verify your corporate identity via MCA CIN & GSTIN. Verified employers enjoy 4x higher applicant engagement and instant TrustHire Verified Badges.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/employer/verify"
              className="px-6 py-3 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-semibold text-sm transition text-center shadow-lg shadow-emerald-500/10"
            >
              Verify Company Now
            </Link>
            <Link
              to="/employer/post-job"
              className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition text-center"
            >
              Post an Opening
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}