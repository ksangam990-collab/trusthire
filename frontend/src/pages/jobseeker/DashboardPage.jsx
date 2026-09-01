import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Clock, CheckCircle2, AlertCircle, FileText, ArrowRight, User } from 'lucide-react';
import { applicationsApi } from '../../api';
import TrustScoreBadge from '../../components/ui/TrustScoreBadge';
import { Skeleton } from '../../components/ui/Skeleton';

export default function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCandidateData = async () => {
      setLoading(true);
      try {
        const res = await applicationsApi.getCandidateApplications();
        setApplications(res?.data?.applications || []);
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load your applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidateData();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      applied: { label: 'Application Sent', color: 'bg-slate-800 text-slate-300 border-slate-700' },
      reviewing: { label: 'Under Review', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
      shortlisted: { label: 'Shortlisted', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
      interview: { label: 'Interview Scheduled', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
      hired: { label: 'Offer Extended', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
      rejected: { label: 'Not Selected', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
    };
    const current = statusMap[status] || statusMap.applied;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${current.color}`}>
        {current.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-28 w-full rounded-3xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tight">Candidate Portal & Application Tracker</h1>
          <p className="text-xs text-slate-400">Track application stages, employer verification signals, and interview invitations.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/profile"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center space-x-1.5"
          >
            <User className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
          <Link
            to="/jobs"
            className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold text-xs transition flex items-center space-x-1.5 shadow-glow-sm"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse More Jobs</span>
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-2xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
            Active Applications ({applications.length})
          </h2>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app._id}
                className="p-5 sm:p-6 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-base flex-shrink-0">
                    {app.job?.employer?.logo ? (
                      <img src={app.job.employer.logo} alt={app.job.employer.companyName} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      app.job?.employer?.companyName?.charAt(0) || <Building2 className="w-6 h-6 text-slate-500" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-300">{app.job?.employer?.companyName}</span>
                      {app.job?.employer?.verificationStatus === 'verified' && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>MCA Verified</span>
                        </span>
                      )}
                    </div>
                    <Link to={`/jobs/${app.job?._id}`}>
                      <h3 className="text-base font-bold text-white hover:text-emerald-400 transition">
                        {app.job?.title || 'Position'}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>{app.job?.location?.city} ({app.job?.workplaceType})</span>
                      <span className="text-slate-600">•</span>
                      <span className="inline-flex items-center space-x-1 font-mono text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col sm:items-end justify-between items-center gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-slate-800">
                  <TrustScoreBadge score={app.job?.employer?.trustScore || 40} size="sm" />
                  {getStatusBadge(app.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No applications submitted yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Browse through authentic MCA-verified listings and submit applications securely with zero fees.
            </p>
            <div className="pt-2">
              <Link
                to="/jobs"
                className="inline-block px-5 py-2.5 rounded-xl bg-emerald-400 text-slate-900 font-bold text-xs shadow-glow-sm"
              >
                Browse Open Roles
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
