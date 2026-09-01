import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronRight,
  UserCheck,
  UserX,
  Eye,
  FileText
} from 'lucide-react';
import { employerApi, applicationsApi } from '../../api';
import TrustScoreBadge from '../../components/ui/TrustScoreBadge';
import { Skeleton, Spinner } from '../../components/ui/Skeleton';

export default function EmployerDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, applicantsRes] = await Promise.all([
        employerApi.getMetrics(),
        applicationsApi.getEmployerApplicants(selectedJobId || undefined)
      ]);
      setMetrics(metricsRes?.data || null);
      setApplicants(applicantsRes?.data?.applications || []);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load employer metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedJobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await applicationsApi.updateStatus(applicationId, { status: newStatus });
      setApplicants(prev =>
        prev.map(app => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      alert(err.message || 'Failed to update candidate status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && !metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const { overview, funnel, recentJobs } = metrics || {
    overview: { trustScore: 40, verificationStatus: 'unverified', activeJobs: 0, totalJobs: 0, totalApplications: 0, fraudReportsCount: 0 },
    funnel: { applied: 0, reviewing: 0, shortlisted: 0, interview: 0, hired: 0, rejected: 0 },
    recentJobs: []
  };

  const isVerified = overview.verificationStatus === 'verified';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5 flex-wrap">
            <h1 className="text-2xl font-black text-white tracking-tight">Employer Command Center</h1>
            {isVerified ? (
              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Statutory Verified Entity</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Verification Pending</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Track candidates, manage verified openings, and audit employer trust metrics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isVerified && (
            <Link
              to="/employer/verify"
              className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold text-xs transition flex items-center space-x-1.5 shadow-glow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify CIN & GSTIN</span>
            </Link>
          )}
          <Link
            to="/employer/post-job"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Post Opening</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] text-slate-400 font-mono">TRUST SCORE</span>
            <div className="text-2xl font-black font-mono text-white mt-1">{overview.trustScore}/100</div>
          </div>
          <TrustScoreBadge score={overview.trustScore} size="sm" showLabel={false} />
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] text-slate-400 font-mono">ACTIVE LISTINGS</span>
            <div className="text-2xl font-black font-mono text-white mt-1">{overview.activeJobs}</div>
          </div>
          <Briefcase className="w-8 h-8 text-emerald-400/30" />
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] text-slate-400 font-mono">CANDIDATES</span>
            <div className="text-2xl font-black font-mono text-white mt-1">{overview.totalApplications}</div>
          </div>
          <Users className="w-8 h-8 text-blue-400/30" />
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] text-slate-400 font-mono">FRAUD ALERTS</span>
            <div className={`text-2xl font-black font-mono mt-1 ${overview.fraudReportsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {overview.fraudReportsCount}
            </div>
          </div>
          <AlertTriangle className={`w-8 h-8 ${overview.fraudReportsCount > 0 ? 'text-rose-400/30' : 'text-slate-700'}`} />
        </div>
      </div>

      {/* Recruitment Funnel Stages */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 space-y-4 shadow-sm">
        <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Recruitment Pipeline Funnel</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(funnel).map(([statusKey, count]) => (
            <div key={statusKey} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400">{statusKey}</span>
              <div className="text-xl font-bold font-mono text-white mt-1">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Pipeline Stream */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">Candidate Review Stream</h2>
            <p className="text-xs text-slate-400">Review resumes, contact details, and advance applicants through hiring stages.</p>
          </div>
          {recentJobs.length > 0 && (
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="">All Openings ({applicants.length} candidates)</option>
              {recentJobs.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          )}
        </div>

        {applicants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Resume</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 text-right">Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {applicants.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{app.candidate?.name || 'Applicant'}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{app.candidate?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{app.job?.title || 'Job Opening'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{app.contactPhone || '—'}</td>
                    <td className="py-3.5 px-4">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline font-mono inline-flex items-center space-x-1 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Doc</span>
                        </a>
                      ) : (
                        <span className="text-slate-600">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                        app.status === 'hired' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                        app.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                        app.status === 'interview' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        disabled={updatingId === app._id}
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none"
                      >
                        <option value="applied">applied</option>
                        <option value="reviewing">reviewing</option>
                        <option value="shortlisted">shortlisted</option>
                        <option value="interview">interview</option>
                        <option value="hired">hired</option>
                        <option value="rejected">rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-2">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-white">No applicants received yet</h4>
            <p className="text-xs text-slate-400">As candidates discover your verified listings, their submissions will populate here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
