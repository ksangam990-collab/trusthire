import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, RotateCcw, PlusCircle, Radio, Share2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { fraudApi } from '../../api';
import { Skeleton } from '../../components/ui/Skeleton';

const SEVERITY_COLORS = {
  Critical: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  High: 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800',
  Medium: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
  Low: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700',
};

export default function FraudBoardPage() {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFraudBoard = async (page = pagination.page) => {
    setLoading(true);
    try {
      const res = await fraudApi.getBoard({ category: category || undefined, severity: severity || undefined, page, limit: 9 });
      setReports(res?.data?.reports || []);
      setPagination(res?.data?.pagination || { page: 1, pages: 1, total: 0 });
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchFraudBoard(1); }, [category, severity]);

  const handleShare = (scam) => {
    const msg = `⚠️ SCAM ALERT on TrustHire: "${scam.title}" — Read more: ${window.location.origin}/fraud-board`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 theme-transition">
      {/* Header */}
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/30 dark:to-slate-900 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Live Scam Alert Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Recruitment Fraud Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">Community-verified reports of fake recruiters, deposit scams, and impersonation fraud across India.</p>
        </div>
        <Link to="/report-fraud"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition shadow-sm flex-shrink-0 self-start sm:self-auto cursor-pointer">
          <PlusCircle className="w-4 h-4" />
          <span>Report Incident</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">All Categories</option>
          <option value="Registration Fee / Security Deposit">Registration Fee / Deposit</option>
          <option value="Fake Offer Letter">Fake Offer Letter</option>
          <option value="Identity Theft / Document Misuse">Identity Theft</option>
          <option value="Phishing / Impersonation">Phishing / Impersonation</option>
          <option value="Unpaid Trial Work">Unpaid Trial Work</option>
          <option value="Misleading Salary / Job Role">Misleading Salary</option>
        </select>

        <select value={severity} onChange={e => setSeverity(e.target.value)}
          className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">All Severity</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {(category || severity) && (
          <button onClick={() => { setCategory(''); setSeverity(''); }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition font-medium cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        )}

        <span className="ml-auto text-xs text-slate-500 font-medium">{pagination.total || 0} reports</span>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white">No scam reports found</h3>
          <p className="text-sm text-slate-500">No verified reports match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map(report => (
            <div key={report._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800 rounded-2xl p-5 space-y-3 transition flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${SEVERITY_COLORS[report.severity] || SEVERITY_COLORS.Medium}`}>
                  <AlertTriangle className="w-3 h-3" /> {report.severity}
                </span>
                <span className="text-[10px] text-slate-400 flex-shrink-0">{new Date(report.createdAt).toLocaleDateString('en-IN')}</span>
              </div>

              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide block">{report.fraudCategory}</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">{report.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{report.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                  {report.amountDemanded > 0 ? `₹${report.amountDemanded.toLocaleString('en-IN')} demanded` : 'Non-monetary scam'}
                </span>
                <button onClick={() => handleShare(report)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => fetchFraudBoard(pagination.page - 1)} disabled={pagination.page <= 1}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-xs text-slate-500 font-medium">Page {pagination.page} of {pagination.pages}</span>
          <button onClick={() => fetchFraudBoard(pagination.page + 1)} disabled={pagination.page >= pagination.pages}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
