import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Eye, 
  FileText,
  Search,
  ExternalLink
} from 'lucide-react';
import { fraudApi, jobsApi, employerApi } from '../../api';
import TrustScoreBadge from '../../components/ui/TrustScoreBadge';
import { Skeleton, Spinner } from '../../components/ui/Skeleton';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('reports');
  const [metrics, setMetrics] = useState(null);
  const [reports, setReports] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter for reports
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingReportId, setUpdatingReportId] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState({});

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [metricsRes, reportsRes, employersRes, jobsRes] = await Promise.all([
        fraudApi.getAdminMetrics().catch(() => ({ data: {} })),
        fraudApi.getAdminReports({ status: statusFilter || undefined }).catch(() => ({ data: { reports: [] } })),
        employerApi.getPublicEmployers().catch(() => ({ data: { employers: [] } })),
        jobsApi.getJobs({ limit: 20 }).catch(() => ({ data: { jobs: [] } }))
      ]);

      setMetrics(metricsRes?.data || {});
      setReports(reportsRes?.data?.reports || []);
      setEmployers(employersRes?.data?.employers || []);
      setJobs(jobsRes?.data?.jobs || []);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [statusFilter]);

  const handleUpdateReport = async (reportId, newStatus) => {
    setUpdatingReportId(reportId);
    try {
      const note = adminNoteInput[reportId] || undefined;
      await fraudApi.updateReportStatus(reportId, { status: newStatus, adminNotes: note });
      setReports(prev =>
        prev.map(r => (r._id === reportId ? { ...r, status: newStatus, adminNotes: note || r.adminNotes } : r))
      );
      const metricsRes = await fraudApi.getAdminMetrics();
      setMetrics(metricsRes?.data || metrics);
    } catch (err) {
      console.error('Failed to update report status:', err.message);
    } finally {
      setUpdatingReportId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 theme-transition">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <span className="text-xs font-mono font-bold uppercase text-rose-600 dark:text-rose-400">
              PLATFORM SECURITY & GOVERNANCE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Super Administrator Control Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Moderate scam incident allegations, audit statutory MCA21 company filings, and enforce zero-fee hiring compliance.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/employer/verify"
            className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
          >
            Statutory CIN Audit Tool
          </Link>
          <Link
            to="/jobs"
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-xs font-semibold"
          >
            View Live Jobs
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Total Accounts</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{metrics?.totalUsers || 0}</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">MCA Verified Orgs</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {metrics?.verifiedEmployers || 0} <span className="text-xs font-normal text-slate-400">/ {metrics?.totalEmployers || 0}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Active Listings</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{metrics?.activeJobs || 0}</div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Pending Scam Reports</span>
          <div className={`text-2xl font-bold font-mono ${metrics?.pendingReports > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
            {metrics?.pendingReports || 0}
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'reports'
              ? 'border-rose-600 dark:border-rose-400 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Scam Incident Moderation ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('employers')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'employers'
              ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Registered Employers ({employers.length})
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'jobs'
              ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Published Openings ({jobs.length})
        </button>
      </div>

      {/* TAB 1: SCAM REPORTS MODERATION */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Filter by status:
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="">All Statuses (Pending, Verified, Dismissed)</option>
              <option value="pending">Pending Review</option>
              <option value="investigating">Under Investigation</option>
              <option value="verified">Verified Scams</option>
              <option value="dismissed">Dismissed Reports</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 text-xs shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        report.status === 'verified' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800' :
                        report.status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}>
                        STATUS: {report.status}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {report.fraudCategory}
                      </span>
                      <span className="text-slate-400">• Severity: <strong>{report.severity}</strong></span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      Filed on {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{report.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed whitespace-pre-line">
                      {report.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Reported Entity:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {report.employer?.companyName || 'Unregistered / Manual Entry'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Demanded Amount:</span>
                      <span className="font-bold font-mono text-rose-600 dark:text-rose-400">
                        {report.amountDemanded > 0 ? `?${report.amountDemanded.toLocaleString()}` : 'None Stated'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Reporter Status:</span>
                      <span className="font-mono text-slate-600 dark:text-slate-400">
                        {report.isAnonymous ? 'Submitted Anonymously' : (report.reporter?.name || 'Candidate')}
                      </span>
                    </div>
                  </div>

                  {/* Moderator Notes & Action Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                    <input
                      type="text"
                      placeholder="Add official moderator audit note (e.g. Fake WhatsApp domain confirmed)..."
                      value={adminNoteInput[report._id] !== undefined ? adminNoteInput[report._id] : (report.adminNotes || '')}
                      onChange={(e) => setAdminNoteInput({ ...adminNoteInput, [report._id]: e.target.value })}
                      className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs flex-grow focus:outline-none"
                    />

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        disabled={updatingReportId === report._id}
                        onClick={() => handleUpdateReport(report._id, 'verified')}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Scam</span>
                      </button>

                      <button
                        disabled={updatingReportId === report._id}
                        onClick={() => handleUpdateReport(report._id, 'investigating')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition"
                      >
                        Investigate
                      </button>

                      <button
                        disabled={updatingReportId === report._id}
                        onClick={() => handleUpdateReport(report._id, 'dismissed')}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-900 dark:text-white">Moderation Queue Clear</h4>
              <p className="text-slate-500">No scam incidents matching this filter are pending action.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EMPLOYERS DIRECTORY */}
      {activeTab === 'employers' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900 uppercase font-mono text-[10px] text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Statutory CIN</th>
                  <th className="py-3 px-4">GSTIN</th>
                  <th className="py-3 px-4">TrustScore</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {employers.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{emp.companyName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">{emp.cin || '—'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">{emp.gstin || '—'}</td>
                    <td className="py-3.5 px-4">
                      <TrustScoreBadge score={emp.trustScore || 40} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        emp.verificationStatus === 'verified' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                      }`}>
                        {emp.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{emp.location?.city || 'India'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PUBLISHED JOBS */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{job.title}</h4>
                  <p className="text-slate-500">{job.employer?.companyName || 'Corporate'}</p>
                </div>
                <TrustScoreBadge score={job.employerTrustScore || 40} size="sm" />
              </div>
              <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
                <span>{job.location?.city}</span>
                <span>•</span>
                <span>{job.jobType}</span>
                <span>•</span>
                <span>?{((job.salary?.min || 0) / 100000).toFixed(1)}L - ?{((job.salary?.max || job.salary?.min || 0) / 100000).toFixed(1)}L</span>
              </div>
              <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                <span className="font-mono text-[10px] text-emerald-600 uppercase font-bold">
                  Status: {job.status}
                </span>
                <Link to={`/jobs/${job._id}`} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  Inspect Listing ?
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
