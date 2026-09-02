import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, CheckCircle2, Building2, Clock, ArrowRight } from 'lucide-react';
import TrustScoreBadge from '../ui/TrustScoreBadge';

export default function JobCard({ job }) {
  const {
    _id,
    title,
    employer,
    location,
    salary,
    jobType,
    workplaceType,
    experienceLevel,
    skills,
    isFromVerifiedEmployer,
    employerTrustScore,
    createdAt
  } = job;

  const score = employerTrustScore || employer?.trustScore || 40;

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently posted';
    const diffDays = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Posted today';
    if (diffDays === 1) return 'Posted 1 day ago';
    if (diffDays < 30) return `Posted ${diffDays} days ago`;
    return `Posted ${new Date(dateStr).toLocaleDateString()}`;
  };

  return (
    <div className="rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        {/* Header: Company Icon + Details + TrustScore */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-lg flex-shrink-0">
              {employer?.logo ? (
                <img src={employer.logo} alt={employer.companyName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                employer?.companyName?.charAt(0) || <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {employer?.companyName || 'Verified Corporate'}
                </span>
                {isFromVerifiedEmployer && (
                  <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified MCA</span>
                  </span>
                )}
              </div>

              <Link to={`/jobs/${_id}`}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors leading-snug">
                  {title}
                </h3>
              </Link>
            </div>
          </div>

          <TrustScoreBadge score={score} size="sm" />
        </div>

        {/* Location & Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{location?.city || 'India'} ({workplaceType})</span>
          </span>

          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span>{jobType} • {experienceLevel}</span>
          </span>

          {salary?.min > 0 && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-900">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>₹{(salary.min / 100000).toFixed(1)}L - ₹{(salary.max / 100000).toFixed(1)}L / yr</span>
            </span>
          )}
        </div>

        {/* Skills Tag Cloud */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Strip */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatTimeAgo(createdAt)}</span>
        </span>

        <Link
          to={`/jobs/${_id}`}
          className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center space-x-1"
        >
          <span>View Role & Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
