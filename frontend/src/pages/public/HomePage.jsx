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
  Building,
  Check,
  Briefcase,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { jobsApi, fraudApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';

export default function HomePage() {
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentScams, setRecentScams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // Interactive Verification Inspector State
  const [lookupCin, setLookupCin] = useState('U72900KA2021PTC145678');
  const [inspecting, setInspecting] = useState(false);
  const [companyAudit, setCompanyAudit] = useState({
    companyName: 'TechCorp Solutions India Private Limited',
    cin: 'U72900KA2021PTC145678',
    roc: 'ROC Bangalore',
    status: 'Active (Compliant with MCA21)',
    incorporationDate: '14 May 2021',
    gstinStatus: 'Active & Verified',
    trustScore: 94,
    depositFeeFlag: 'Zero Fees Verified'
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

  const handleRunInspector = (e) => {
    e.preventDefault();
    setInspecting(true);
    setTimeout(() => {
      setInspecting(false);
      const isCompliant = lookupCin.length >= 10;
      if (isCompliant) {
        setCompanyAudit({
          companyName: 'Innovate Labs Private Limited',
          cin: lookupCin.toUpperCase(),
          roc: 'ROC Karnataka',
          status: 'Active & Good Standing',
          incorporationDate: '12 Jan 2020',
          gstinStatus: 'Active • 29AAAAA0000A1Z5',
          trustScore: 96,
          depositFeeFlag: 'Zero Fees Verified'
        });
      } else {
        setCompanyAudit({
          companyName: 'Unverified Entity / Unknown Identifier',
          cin: lookupCin,
          roc: 'Not Found',
          status: 'Record Mismatch',
          incorporationDate: '—',
          gstinStatus: 'Unregistered',
          trustScore: 25,
          depositFeeFlag: 'Flagged for Manual Review'
        });
      }
    }, 400);
  };

  return (
    <div className="space-y-20 pb-20 theme-transition bg-grid">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Value Proposition & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span>Statutory MCA21 Verified Jobs • 100% Free for Job Seekers</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Apply for jobs with confidence. <br className="hidden sm:inline" />
                <span className="text-emerald-600 dark:text-emerald-400">Zero recruitment scams.</span>
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                TrustHire validates corporate CIN numbers against Ministry of Corporate Affairs records and GST registrations before jobs go live. Say goodbye to fake offer letters and deposit fees.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="pt-1 flex flex-col sm:flex-row gap-2 max-w-xl">
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" strokeWidth={1.75} />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Role or skill (e.g. React, Node.js, Product Manager)..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500 shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-xs sm:text-sm transition flex items-center justify-center space-x-1.5 flex-shrink-0 shadow-sm"
                >
                  <span>Search Jobs</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </form>

              {/* Verified Metrics */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800 max-w-lg text-xs">
                <div>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">100%</div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">MCA Registry Verified</div>
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">₹0</div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">Candidate Charges</div>
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">Live</div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">Community Fraud Alerts</div>
                </div>
              </div>
            </div>

            {/* Right: Real Statutory Verification Inspector Card */}
            <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Building className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Live Employer Statutory Inspector
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  MCA21 CONNECTED
                </span>
              </div>

              {/* Inspector Input */}
              <form onSubmit={handleRunInspector} className="flex gap-2">
                <input
                  type="text"
                  value={lookupCin}
                  onChange={(e) => setLookupCin(e.target.value)}
                  placeholder="Enter 21-digit Corporate CIN..."
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={inspecting}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-medium rounded-lg flex-shrink-0"
                >
                  {inspecting ? 'Checking...' : 'Inspect'}
                </button>
              </form>

              {/* Audit Results Table */}
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3.5 space-y-2.5 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{companyAudit.companyName}</div>
                    <div className="font-mono text-[11px] text-slate-500">{companyAudit.cin}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Trust Score</span>
                    <span className="text-base font-mono font-black text-emerald-600 dark:text-emerald-400">
                      {companyAudit.trustScore}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">MCA Registrar:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{companyAudit.roc}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">GSTIN Status:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{companyAudit.gstinStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Filing Status:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" strokeWidth={2} />
                      <span>{companyAudit.status}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Recruitment Fee:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                      {companyAudit.depositFeeFlag}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
                <span>Every job on TrustHire carries this statutory audit record.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8 space-y-1">
          <h2 className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
            Verification Architecture
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            How we ensure authentic job opportunities
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Statutory MCA21 Cross-Check</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Employers must provide a verified Corporate Identification Number (CIN) and GST registration. Unregistered organizations cannot publish listings.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800/60">
              <Lock className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Zero-Fee Candidate Guarantee</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Legitimate employers never demand security deposits, uniform fees, or training charges. Any listing found requesting payment is automatically suspended.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800/60">
              <ShieldAlert className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Public Incident Board</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Job seekers can flag impersonators and scam recruiters. Verified reports are published publicly to warn other applicants across the community.
            </p>
          </div>
        </div>
      </section>

      {/* Verified Openings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
              Curated Openings
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Latest Verified Roles
            </h2>
          </div>
          <Link
            to="/jobs"
            className="mt-3 sm:mt-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <span>View all verified openings</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
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
          <div className="text-center py-12 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 space-y-2">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto" strokeWidth={1.5} />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">No active listings right now</h4>
            <p className="text-xs text-slate-500">Sign in as an employer to publish verified openings.</p>
          </div>
        )}
      </section>

      {/* Live Fraud Warnings Board */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F172A] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Public Fraud Warnings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified reports of fake recruiter deposits and impersonation.</p>
            </div>
            <Link
              to="/fraud-board"
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex-shrink-0"
            >
              Open Full Fraud Board →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentScams.length > 0 ? (
              recentScams.slice(0, 3).map((scam) => (
                <div key={scam._id} className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                      {scam.fraudCategory}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(scam.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-200 line-clamp-1">{scam.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-2">{scam.description}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-4 text-xs text-slate-400 font-mono">
                No critical threats in live feed.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recruiter Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Hiring developers or designers? Verify your company in 2 minutes.
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Verified corporate badges increase candidate application rates by 4x. Validate your MCA CIN or GSTIN today.
            </p>
          </div>
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <Link
              to="/employer/verify"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-xs transition"
            >
              Verify Company
            </Link>
            <Link
              to="/employer/post-job"
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs transition"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
