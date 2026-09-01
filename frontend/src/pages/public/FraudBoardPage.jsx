import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Filter, RotateCcw, Building2, PlusCircle, Search, Radio } from 'lucide-react';
import { fraudApi } from '../../api';
import { Skeleton } from '../../components/ui/Skeleton';

export default function FraudBoardPage() {
  const [reports, setReports] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFraudBoard = async () => {
    setLoading(true);
    try {
      const res = await fraudApi.getBoard({
        category: category || undefined,
        severity: severity || undefined,
        page: pagination.page,
        limit: 10
      });
      setReports(res?.data?.reports || []);
      setPagination(res?.data?.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to load fraud radar feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFraudBoard();
  }, [category, severity, pagination.page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 theme-transition">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-500/10 via-slate-100 to-white dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-900 border border-rose-500/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
              <span>LIVE FRAUD THREAT RADAR</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Public Recruitment Fraud Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Real-time public incident summaries of scam recruiters demanding money, fake job placements, or spoofing corporate identity.
          </p>
        </div>

        <Link
          to="/report-fraud"
          className="px-5 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm transition flex items-center space-x-2 self-start md:self-auto shadow-md shadow-rose-500/20 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report an Incident</span>
        </Link>
      </motion.div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="">All Fraud Categories</option>
            <option value="Registration Fee / Security Deposit">Registration Fee / Security Deposit</option>
            <option value="Fake Offer Letter">Fake Offer Letter</option>
            <option value="Identity Theft / Document Misuse">Identity Theft / Document Misuse</option>
            <option value="Phishing / Impersonation">Phishing / Impersonation</option>
            <option value="Unpaid Trial Work">Unpaid Trial Work</option>
            <option value="Misleading Salary / Job Role">Misleading Salary / Job Role</option>
          </select>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="">All Severity Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button
          onClick={() => {
            setCategory('');
            setSeverity('');
          }}
          className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Reports Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 space-y-3 animate-pulse">
              <div className="flex justify-between">
                <Skeleton className="w-28 h-5" />
                <Skeleton className="w-20 h-4" />
              </div>
              <Skeleton className="w-64 h-5" />
              <Skeleton className="w-full h-12" />
            </div>
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0f172a]/85 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm space-y-3.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono border ${
                    report.severity === 'Critical' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-500/30' :
                    report.severity === 'High' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20' :
                    'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                  }`}>
                    {report.severity} Severity
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-300">
                    {report.fraudCategory}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Logged on {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">{report.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{report.description}</p>

              {report.adminNotes && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Moderator Verification Note:</span>
                  <p>{report.adminNotes}</p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-4">
                  <span>Reported Entity: <strong className="text-slate-800 dark:text-slate-200">{report.employer?.companyName || 'Unregistered Entity'}</strong></span>
                  {report.amountDemanded > 0 && (
                    <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">Demanded: ₹{report.amountDemanded.toLocaleString()}</span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                  STATUS: {report.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/60 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No active fraud reports found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No scam warnings match your selected filter categories. Help keep the network safe by reporting bad actors.
          </p>
        </div>
      )}
    </div>
  );
}
