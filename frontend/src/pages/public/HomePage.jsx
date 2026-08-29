import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  FileWarning,
} from 'lucide-react';

const STATS = [
  { icon: ShieldCheck, value: '2,400+', label: 'Verified employers', color: 'text-trust-green' },
  { icon: FileWarning, value: '380+', label: 'Fraud reports filed', color: 'text-trust-amber' },
  { icon: Users, value: '18,000+', label: 'Job seekers protected', color: 'text-navy-500' },
];

const HOW_IT_WORKS = [
  {
    step: 'A',
    title: 'Search jobs — filter by verified',
    desc: 'Toggle "Verified Only" to see listings from employers whose legal identity we\'ve confirmed.',
    icon: Search,
  },
  {
    step: 'B',
    title: 'Check the employer\'s trust profile',
    desc: 'See their company registration date, type, and how many fraud reports (if any) they\'ve received.',
    icon: ShieldCheck,
  },
  {
    step: 'C',
    title: 'Apply — or report if something feels wrong',
    desc: 'Apply directly through TrustHire. If a job asks you for money, report it — your report protects others.',
    icon: CheckCircle2,
  },
];

const REPORT_TYPES = [
  { label: 'Asked for money / fees', count: 142, color: 'bg-red-100 text-red-700' },
  { label: 'Fake company', count: 89, color: 'bg-orange-100 text-orange-700' },
  { label: 'Scam interview', count: 64, color: 'bg-amber-100 text-amber-700' },
  { label: 'Misleading job description', count: 43, color: 'bg-yellow-100 text-yellow-700' },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('city', location);
    params.set('verifiedOnly', 'true');
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="bg-navy-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24">
          {/* Trust signal pill */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-navy-500 text-navy-100 text-xs font-semibold px-4 py-1.5 rounded-full border border-navy-400">
              <ShieldCheck className="w-3.5 h-3.5 text-trust-green" />
              Every employer is verified against MCA and GST records
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-center leading-tight mb-4">
            Apply only to jobs
            <br />
            <span className="text-green-400">that legally exist.</span>
          </h1>

          <p className="text-center text-navy-200 text-lg max-w-2xl mx-auto mb-10">
            Fake job listings cost Indian job seekers crores every year. TrustHire verifies every
            employer against government records — and shows you their fraud history before you apply.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto shadow-lg"
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills, or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none text-sm"
              />
            </div>
            <div className="hidden sm:block w-px bg-slate-100" />
            <div className="flex-1 flex items-center gap-2 px-3">
              <span className="text-slate-400 text-xs font-medium">📍</span>
              <input
                type="text"
                placeholder="City (e.g. Jamshedpur, Mumbai)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="btn-primary rounded-lg text-sm flex-shrink-0"
            >
              Search verified jobs
            </button>
          </form>

          <p className="text-center text-navy-300 text-xs mt-3">
            Showing verified employers only by default.{' '}
            <Link to="/jobs" className="underline hover:text-white">
              Browse all listings
            </Link>
          </p>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STATS.map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="font-display font-bold text-2xl text-slate-900">{value}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-slate-900 text-center mb-3">
            How TrustHire works
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
            Three steps. No registration required to browse.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="card p-6">
                <div className="w-9 h-9 bg-navy-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fraud Board Preview ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-trust-red mb-3 block">
                Public Fraud Board
              </span>
              <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">
                Every report is visible.
                <br />
                Not buried in a support ticket.
              </h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                When you report a suspicious employer on TrustHire, your report is counted and
                categorized publicly. When 3+ people report the same issue, the listing is
                automatically suspended.
              </p>
              <Link
                to="/fraud-board"
                className="inline-flex items-center gap-2 text-navy-600 font-semibold hover:underline"
              >
                View the fraud board
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="card p-5 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-trust-red" />
                <span className="text-sm font-semibold text-slate-700">
                  Recent report categories (last 30 days)
                </span>
              </div>
              {REPORT_TYPES.map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
                    {count} reports
                  </span>
                </div>
              ))}
              <p className="text-xs text-slate-400 pt-2 border-t border-slate-50">
                Reports are anonymized. Submitter identity is never disclosed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-navy-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            Hiring? Get your company verified.
          </h2>
          <p className="text-navy-200 mb-8">
            Verified employers get a trust badge on every listing. Job seekers apply 3× more often
            to verified listings. Verification is free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register?role=employer"
              className="bg-white text-navy-600 font-semibold px-6 py-3 rounded-lg hover:bg-navy-50 transition-colors"
            >
              Register as employer
            </Link>
            <Link
              to="/register"
              className="text-white font-medium hover:underline flex items-center gap-1"
            >
              Job seeker? Create free account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
