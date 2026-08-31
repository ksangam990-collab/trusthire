import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, Briefcase, IndianRupee, Clock, CheckCircle2 } from 'lucide-react';
import TrustScoreBadge from '../ui/TrustScoreBadge';

export default function JobCard({ job }) {
  const {
    _id,
    title,
    employer,
    location,
    jobType,
    workplaceType,
    experienceLevel,
    salary,
    isFromVerifiedEmployer,
    employerTrustScore,
    createdAt
  } = job;

  const formatSalary = (sal) => {
    if (!sal || (!sal.min && !sal.max)) return 'Undisclosed';
    if (sal.min && sal.max) {
      return `₹${(sal.min / 100000).toFixed(1)}L - ₹${(sal.max / 100000).toFixed(1)}L / yr`;
    }
    return `Up to ₹${((sal.max || sal.min) / 100000).toFixed(1)}L / yr`;
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return '1d ago';
    return `${diff}d ago`;
  };

  return (
    <div className="group relative bg-[#111827]/80 hover:bg-[#151E30] border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-emerald-950/10">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-start space-x-3.5">
          <div className="w-11 h-11 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300 font-bold text-sm">
            {employer?.logo ? (
              <img src={employer.logo} alt={employer.companyName} className="w-full h-full object-cover rounded-lg" />
            ) : (
              employer?.companyName?.charAt(0) || <Building2 className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-xs font-medium text-slate-400">{employer?.companyName || 'Verified Org'}</span>
              {isFromVerifiedEmployer && (
                <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>MCA Verified</span>
                </span>
              )}
            </div>
            <Link to={`/jobs/${_id}`}>
              <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition mt-1 line-clamp-1">
                {title}
              </h3>
            </Link>
          </div>
        </div>

        {/* Right Trust Badge */}
        <div className="flex-shrink-0">
          <TrustScoreBadge score={employerTrustScore || employer?.trustScore || 40} size="sm" />
        </div>
      </div>

      {/* Meta Badges */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
        <span className="inline-flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{location?.city}{location?.state ? `, ${location.state}` : ''} ({workplaceType})</span>
        </span>
        <span className="inline-flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span>{jobType} • {experienceLevel}</span>
        </span>
        <span className="inline-flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 text-slate-300">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
          <span>{formatSalary(salary)}</span>
        </span>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="inline-flex items-center space-x-1 text-slate-500 font-mono">
          <Clock className="w-3 h-3" />
          <span>Posted {timeAgo(createdAt)}</span>
        </span>
        <Link
          to={`/jobs/${_id}`}
          className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center space-x-1"
        >
          <span>View Verification & Details →</span>
        </Link>
      </div>
    </div>
  );
}