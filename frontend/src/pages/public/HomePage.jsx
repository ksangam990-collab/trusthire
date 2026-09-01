import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  MapPin,
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
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { jobsApi, fraudApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';

export default function HomePage() {
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentScams, setRecentScams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search inputs
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  // FAQ open/close state
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
    { name: 'Razorpay', location: 'Bengaluru', verified: true },
    { name: 'Zerodha', location: 'Bengaluru', verified: true },
    { name: 'Swiggy', location: 'Bengaluru', verified: true },
    { name: 'Infosys', location: 'Pune', verified: true },
    { name: 'Zomato', location: 'Gurugram', verified: true },
    { name: 'Tata Consultancy Services', location: 'Mumbai', verified: true }
  ];

  const faqs = [
    {
      q: 'What is an MCA21 CIN Number and why does TrustHire verify it?',
      a: 'In India, the Ministry of Corporate Affairs (MCA21) issues a unique 21-digit Corporate Identification Number (CIN) to every registered Private Limited or Public Limited company. TrustHire verifies this number to confirm the employer is a legally registered corporate entity and not an anonymous ghost scammer.'
    },
    {
      q: 'Why do fake recruiters use WhatsApp or Telegram instead of official emails?',
      a: 'Scammers avoid using corporate domain emails (e.g. hr@company.com) because domain registrations require verification. They instead use WhatsApp or Gmail accounts to demand application deposits, uniform charges, or laptop security fees. TrustHire verifies official domains to eliminate impersonation.'
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
      a: 'Legitimate companies NEVER ask for money during recruitment. If an employer requests any payment, immediately stop communication and file an incident report on our Fraud Board. Our admin moderation team will investigate and penalize the listing.'
    }
  ];

  return (
    <div className="space-y-16 pb-20 theme-transition">
      {/* Hero Section */}
      <section className="pt-10 sm:pt-14 pb-8 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Government MCA21 & GST Registered Employers Only</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Find verified jobs in India. <br />
              <span className="text-emerald-600 dark:text-emerald-400">Zero fake recruiters. Zero fees.</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Every employer on TrustHire is screened against official Ministry of Corporate Affairs records. Apply directly to verified hiring teams without the risk of deposit scams.
            </p>
          </div>

          {/* Indeed / LinkedIn Standard Dual-Input Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto bg-white dark:bg-[#131b26] p-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-md flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center space-x-2 px-3 py-2 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, skills, or company (e.g. React, Product Manager)..."
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 px-3 py-2 w-full sm:w-1/2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City (e.g. Bengaluru, Pune) or 'Remote'..."
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-1.5 flex-shrink-0 shadow-sm"
            >
              <span>Find Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Search Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Popular:</span>
            {['React Developer', 'Node.js', 'Product Manager', 'Data Analyst', 'Remote', 'Bengaluru', 'Fresher Roles'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleQuickTagClick(tag)}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Trust Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Verified hiring organizations across India
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {topCompanies.map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white dark:bg-[#131b26] border border-slate-200 dark:border-slate-800 flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Verified Openings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
              Featured Opportunities
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
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
          <div className="text-center py-12 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[#131b26] space-y-2">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">No active listings right now</h4>
            <p className="text-xs text-slate-500">Employers will publish verified openings here.</p>
          </div>
        )}
      </section>

      {/* How TrustHire Protects Candidates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#131b26] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
              Safety & Verification Guarantee
            </h2>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Why applying on TrustHire is 100% safe
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Traditional job portals allow anyone with a Gmail account to post jobs. TrustHire enforces statutory corporate identity verification before any opening goes live.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2.5 p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Government MCA21 Validation</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We cross-check the company's 21-digit CIN and GSTIN with the Ministry of Corporate Affairs database. Fake companies cannot register.
              </p>
            </div>

            <div className="space-y-2.5 p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Zero Candidate Fees Guarantee</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Legitimate employers never demand registration fees, laptop deposits, or uniform charges. Any listing asking for payment is permanently banned.
              </p>
            </div>

            <div className="space-y-2.5 p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Community Fraud Advisory</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Candidates can report impersonator phone numbers and phishing attempts. Confirmed warnings are published immediately on the public Fraud Board.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Fraud Warnings Board */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b26] space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Public Scam Advisory Feed</h3>
              <p className="text-xs text-slate-500">Verified reports of fake recruiter deposits and WhatsApp impersonation.</p>
            </div>
            <Link
              to="/fraud-board"
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex-shrink-0"
            >
              Open Full Fraud Board →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentScams.length > 0 ? (
              recentScams.slice(0, 3).map((scam) => (
                <div key={scam._id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                      {scam.fraudCategory}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(scam.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-200 line-clamp-1">{scam.title}</h4>
                  <p className="text-slate-500 text-[11px] line-clamp-2">{scam.description}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-4 text-xs text-slate-400">
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
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
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
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b26] overflow-hidden transition-colors shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between space-x-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recruiter Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b26] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Hiring verified engineering or product talent?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Verified corporate badges increase candidate application rates by 4x. Verify your company in 2 minutes.
            </p>
          </div>
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <Link
              to="/employer/verify"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs transition shadow-sm"
            >
              Verify Company
            </Link>
            <Link
              to="/employer/post-job"
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs transition"
            >
              Post an Opening
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
