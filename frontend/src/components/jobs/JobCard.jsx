import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, CheckCircle2, Building2 } from 'lucide-react';
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

  return (
    <div className="rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Top row: Company, Title, TrustScore */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-sm flex-shrink-0">
              {employer?.logo ? (
                <img src={employer.logo} alt={employer.companyName} className="w-full h-full object-cover rounded-lg" />
              ) : (
                employer?.companyName?.charAt(0) || <Building2 className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {employer?.companyName || 'Verified Corporate'}
                </span>
                {isFromVerifiedEmployer && (
                  <span className="inline-flex items-center space-x-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <Link to={`/jobs/${_id}`}>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {title}
                </h3>
              </Link>
            </div>
          </div>

          <TrustScoreBadge score={score} size="sm" />
        </div>

        {/* Location and specs */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <MapPin className="w-3 h-3 text-slate-400" strokeWidth={1.5} />
            <span>{location?.city || 'India'} • {workplaceType}</span>
          </span>

          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Briefcase className="w-3 h-3 text-slate-400" strokeWidth={1.5} />
            <span>{jobType}</span>
          </span>

          {salary?.min > 0 && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-900/50">
              <IndianRupee className="w-3 h-3 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
              <span>₹{(salary.min / 100000).toFixed(1)}L - ₹{(salary.max / 100000).toFixed(1)}L LPA</span>
            </span>
          )}
        </div>

        {/* Skills */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono text-[11px]">
          {createdAt ? `Posted ${new Date(createdAt).toLocaleDateString()}` : 'Active Listing'}
        </span>

        <Link
          to={`/jobs/${_id}`}
          className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          View Role & Apply →
        </Link>
      </div>
    </div>
  );
}
