import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Filter, RotateCcw, Building2, ExternalLink } from 'lucide-react';
import { fraudApi } from '../../api';

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
      console.error('Failed to load fraud feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFraudBoard();
  }, [category, severity, pagination.page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-rose-950/30 via-slate-900 to-slate-900 border border-rose-500/30">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold text-rose-400 tracking-wider uppercase">TRUSTHIRE SECURITY RADAR</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Public Fraud Intelligence Feed</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Public safety notices for fraudulent recruiters demanding security deposits, circulating fake offer letters, or harvesting identities.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="">All Fraud Categories</option>
            <option value="Registration Fee / Security Deposit">Registration Fee / Security Deposit</option>
            <option value="Fake Offer Letter">Fake Offer Letter</option>
            <option value="Identity Theft / Document Misuse">Identity Theft / Document Misuse</option>
            <option value="Phishing / Impersonation">Phishing / Impersonation</option>
            <option value="Unpaid Trial Work">Unpaid Trial Work</option>
          </select>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="">All Severity Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>
        </div>

        <button
          onClick={() => {
            setCategory('');
            setSeverity('');
          }}
          className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-slate-900/50 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="p-5 rounded-xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 transition space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    {report.severity} RISK
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    {report.fraudCategory}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Logged on {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white">{report.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{report.description}</p>

              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center space-x-4">
                  <span>Targeted Entity: <strong className="text-slate-200">{report.employer?.companyName || 'Unregistered Recruiter'}</strong></span>
                  {report.amountDemanded > 0 && (
                    <span className="text-rose-400 font-mono font-semibold">Demand: ₹{report.amountDemanded.toLocaleString()}</span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase">
                  Status: {report.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
          <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No active fraud reports found</h3>
          <p className="text-xs text-slate-400">No incident reports currently match the selected severity and category filters.</p>
        </div>
      )}
    </div>
  );
}