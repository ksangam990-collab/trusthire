import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, Clock, CheckCircle2, AlertCircle, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { applicationsApi } from '../../api';
import TrustScoreBadge from '../../components/ui/TrustScoreBadge';

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
      applied: { label: 'Applied', color: 'bg-slate-800 text-slate-300 border-slate-700' },
      reviewing: { label: 'Under Review', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
      shortlisted: { label: 'Shortlisted', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
      interview: { label: 'Interview Scheduled', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
      hired: { label: 'Hired', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' },
      rejected: { label: 'Not Selected', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
    };
    const current = statusMap[status] || statusMap.applied;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${current.color}`}>
        {current.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Candidate Portal</h1>
          <p className="text-xs text-slate-400">Track application lifecycles, employer authenticity signals, and status transitions.</p>
        </div>
        <Link
          to="/jobs"
          className="px-5 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold text-xs transition flex items-center space-x-1.5 self-start md:self-auto shadow-lg shadow-emerald-500/10"
        >
          <Briefcase className="w-4 h-4" />
          <span>Browse More Verified Jobs</span>
        </Link>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold font-mono text-slate-300 uppercase tracking-wider">
            Submitted Applications ({applications.length})
          </h2>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app._id}
                className="p-5 rounded-xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-base flex-shrink-0">
                    {app.job?.employer?.logo ? (
                      <img src={app.job.employer.logo} alt={app.job.employer.companyName} className="w-full h-full object-cover rounded-lg" />
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
                          <span>Verified Org</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {app.job?.title || 'Position'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>{app.job?.location?.city} ({app.job?.workplaceType})</span>
                      <span className="text-slate-600">•</span>
                      <span className="inline-flex items-center space-x-1 font-mono text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
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
          <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No applications submitted yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Browse our verified jobs registry to apply securely without risk of fee-charging recruiters.
            </p>
            <Link
              to="/jobs"
              className="inline-block px-4 py-2 rounded-lg bg-emerald-400 text-slate-900 font-bold text-xs"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}